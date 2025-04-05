// report_item.js
import { ref, push, set, get } from "firebase/database";
import { database, auth } from "./firebase.js";
import { supabase } from "./supabase.js";

export async function reportItem(formData, imageBlob) {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    const userId = user.uid;

    const userRef = ref(database, `users/${userId}`);
    const userSnapshot = await get(userRef);
    if (!userSnapshot.exists()) {
      throw new Error("User data not found in the database.");
    }

    const userData = userSnapshot.val();
    const username = userData.name || "Anonymous";

    // Decide whether it's lost or found
    const itemTypeLower = formData.itemType.toLowerCase();
    let bucket;
    if (itemTypeLower === "lost") {
      bucket = "lost";
    } else if (itemTypeLower === "found") {
      bucket = "found";
    } else {
      throw new Error("Invalid item type. Must be 'Lost' or 'Found'.");
    }

    // Upload image to Supabase
    const fileName = `${Date.now()}_${imageBlob.name || "image.jpg"}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(bucket)
      .upload(fileName, imageBlob);

    if (uploadError) {
      throw uploadError;
    }

    // Get the public URL for the uploaded image
    const { data: publicData, error: publicError } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    if (publicError) {
      throw publicError;
    }
    const imageUrl = publicData.publicUrl;

    // Format the timestamp
    const timestamp = new Date();
    const formattedTime = `${timestamp.getDate()}-${
      timestamp.getMonth() + 1
    }-${timestamp.getFullYear()} ${timestamp.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })}`;

    // Data for this reported item
    const reportData = {
      itemName: formData.itemName,
      description: formData.description,
      question: formData.question,
      itemType: formData.itemType,
      imageUrl,
      timestamp: formattedTime,
    };

    // Create one push key
    const myReportsRef = ref(database, `myreports/${userId}_${username}`);
    const newMyReportRef = push(myReportsRef); // single push key
    const pushKey = newMyReportRef.key;

    // Store the same push key data in myreports
    await set(newMyReportRef, reportData);

    // Also store under lost or found with the SAME push key
    if (itemTypeLower === "lost") {
      const lostRef = ref(database, `lost/${userId}/${pushKey}`);
      await set(lostRef, reportData);
    } else if (itemTypeLower === "found") {
      const foundRef = ref(database, `found/${userId}/${pushKey}`);
      await set(foundRef, reportData);
    }

    // Return success, including the new push key
    return { success: true, data: { id: pushKey, ...reportData } };
  } catch (error) {
    console.error("Error in reporting item:", error);
    return { success: false, error: error.message };
  }
}
