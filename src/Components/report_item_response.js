import { ref, push, set, get } from "firebase/database";
import { database, auth } from "./firebase.js";
import { supabase } from "./supabase.js";

export async function reportItemResponse(itemId, answer, imageBlob) {
  try {
 
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    let itemType = null;
    let itemName = null;
    let itemDescription = null;
    let question = null;
    let foundMatch = false;
    let postedBy = null;


    const lostRef = ref(database, "lost");
    const lostSnapshot = await get(lostRef);
    if (lostSnapshot.exists()) {
      const lostData = lostSnapshot.val();
      for (const userId in lostData) {
        if (Object.prototype.hasOwnProperty.call(lostData, userId)) {
          const userItems = lostData[userId];
          if (userItems[itemId]) {
            itemType = "lost";
            itemName = userItems[itemId].itemName || "Unknown";
            itemDescription = userItems[itemId].description || "";
            question = userItems[itemId].question || "";
            postedBy = userId;  
            foundMatch = true;
            break;
          }
        }
      }
    }


    if (!foundMatch) {
      const foundRef = ref(database, "found");
      const foundSnapshot = await get(foundRef);
      if (foundSnapshot.exists()) {
        const foundData = foundSnapshot.val();
        for (const userId in foundData) {
          if (Object.prototype.hasOwnProperty.call(foundData, userId)) {
            const userItems = foundData[userId];
            if (userItems[itemId]) {
              itemType = "found";
              itemName = userItems[itemId].itemName || "Unknown";
              itemDescription = userItems[itemId].description || "";
              question = userItems[itemId].question || "";
              postedBy = userId;  
              foundMatch = true;
              break;
            }
          }
        }
      }
    }

  
    if (!foundMatch) {
      throw new Error("Item data not found in 'lost' or 'found' database nodes.");
    }

    const fileName = `${Date.now()}_${imageBlob.name || "response.jpg"}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("responses")
      .upload(fileName, imageBlob);

    if (uploadError) {
      throw uploadError;
    }


    const { data: publicData, error: publicError } = supabase
      .storage
      .from("responses")
      .getPublicUrl(uploadData.path);

    if (publicError) {
      throw publicError;
    }

    const imageUrl = publicData.publicUrl;


    const timestamp = new Date();
    const formattedTime = `${timestamp.getDate()}-${
      timestamp.getMonth() + 1
    }-${timestamp.getFullYear()} ${timestamp.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`;


    const responseData = {
      itemId,
      itemType,
      itemName,
      itemDescription,
      question,
      answer,
      imageUrl,
      timestamp: formattedTime,
      postedBy,
      responseStatus: "Moderation",
    };


    const responsesRef = ref(database, `responses/${itemId}/${user.uid}`);
    await set(responsesRef, responseData);

    const myResponsesData = {
      itemId,
      itemName,
      itemType,
      itemDescription,
      question,
      answer,
      timestamp: formattedTime,
    };
    const myResponsesRef = ref(database, `my_responses/${user.uid}`);
    const newMyResponsesRef = push(myResponsesRef);
    await set(newMyResponsesRef, myResponsesData);


    return {
      success: true,
      data: responseData,
      message: "Response submitted successfully!",
    };
  } catch (error) {
    console.error("Error in reporting item response:", error);
    return {
      success: false,
      error: error.message,
      message: "Failed to submit response.",
    };
  }
}
