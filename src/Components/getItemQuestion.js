import { ref, get } from "firebase/database";
import { database } from "./firebase.js";

export async function getItemQuestion(userId, itemId) {
  try {
    // 1. Check in the "lost" node for the specific user
    let itemRef = ref(database, `lost/${userId}/${itemId}`);
    let snapshot = await get(itemRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.question) {
        return { success: true, question: data.question };
      }
    }
    
    // 2. Check in the "found" node for the specific user
    itemRef = ref(database, `found/${userId}/${itemId}`);
    snapshot = await get(itemRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.question) {
        return { success: true, question: data.question };
      }
    }
    
    // 3. If not found, search all lost items (in case the userId is not known)
    const lostRef = ref(database, `lost`);
    let allSnapshot = await get(lostRef);
    if (allSnapshot.exists()) {
      const lostData = allSnapshot.val();
      for (const uid in lostData) {
        if (lostData[uid] && lostData[uid][itemId]) {
          const itemData = lostData[uid][itemId];
          if (itemData.question) {
            return { success: true, question: itemData.question };
          }
        }
      }
    }
    
    // 4. Also search all found items if still not found
    const foundRef = ref(database, `found`);
    snapshot = await get(foundRef);
    if (snapshot.exists()) {
      const foundData = snapshot.val();
      for (const uid in foundData) {
        if (foundData[uid] && foundData[uid][itemId]) {
          const itemData = foundData[uid][itemId];
          if (itemData.question) {
            return { success: true, question: itemData.question };
          }
        }
      }
    }
    
    return { success: false, error: "Item not found in database." };
  } catch (error) {
    console.error("Error fetching item question:", error);
    return { success: false, error: error.message };
  }
}
