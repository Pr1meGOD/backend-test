import { database } from "./firebase.js";
import { ref, get } from "firebase/database";
import { auth } from "./firebase.js"; 

export const fetchUserListings = async () => {
  try {
    const user = auth.currentUser;
    console.log("Current User:", user);

    if (!user) {
      console.log("No user logged in.");
      return [];
    }

    // Extract only the userId (before the underscore)
    const userId = user.uid;
    console.log("Extracted User ID:", userId);

    // Fetch all user reports
    const reportsRef = ref(database, "myreports");
    const snapshot = await get(reportsRef);

    if (!snapshot.exists()) {
      console.log("No reports found in database.");
      return [];
    }

    // Find the correct key that starts with the userId
    let matchedKey = null;
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.key.startsWith(userId)) {
        matchedKey = childSnapshot.key;
      }
    });

    if (!matchedKey) {
      console.log("No reported items found for this user.");
      return [];
    }

    console.log("Fetching data from:", `myreports/${matchedKey}`);

    const userReportsRef = ref(database, `myreports/${matchedKey}`);
    const userSnapshot = await get(userReportsRef);

    if (!userSnapshot.exists()) {
      console.log("No reported items found for this user.");
      return [];
    }

    console.log("Fetched Data:", userSnapshot.val());

    let userItems = [];
    userSnapshot.forEach((itemSnapshot) => {
      userItems.push({
        id: itemSnapshot.key,
        ...itemSnapshot.val(),
      });
    });

    console.log("Final Parsed Items:", userItems);
    return userItems;
  } catch (error) {
    console.error("Error fetching user listings:", error);
    return [];
  }
};
