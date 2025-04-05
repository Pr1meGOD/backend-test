// item_details.js
import { database, auth } from "./firebase";
import { ref, get } from "firebase/database";

/**
 * Fetch details of a product from "myreports"
 * for the currently logged-in user, given the productId (push key).
 *
 * The item is stored at: myreports/{userId}_{username}/{productId}
 */
export const fetchProductDetails = async (productId) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("No user is logged in, cannot fetch product details.");
      return null;
    }

    const userId = user.uid;
    const reportsRef = ref(database, "myreports");
    const snapshot = await get(reportsRef);

    if (!snapshot.exists()) {
      console.log("No data under 'myreports'.");
      return null;
    }

    let matchedKey = null;

    // 1) We look for the node that starts with userId (e.g. "userId_username")
    snapshot.forEach((childSnapshot) => {
      const key = childSnapshot.key;
      if (key.startsWith(userId)) {
        // 2) Check if inside that node we have productId
        const childData = childSnapshot.val();
        if (childData && childData[productId]) {
          matchedKey = key;
        }
      }
    });

    if (!matchedKey) {
      console.log(
        `Could not find product ${productId} under userId ${userId} in 'myreports'.`
      );
      return null;
    }

    // 3) Retrieve that specific product's data
    const productRef = ref(database, `myreports/${matchedKey}/${productId}`);
    const productSnapshot = await get(productRef);

    if (!productSnapshot.exists()) {
      console.log(
        `No data found for productId ${productId} under ${matchedKey}`
      );
      return null;
    }

    return { id: productId, ...productSnapshot.val() };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return null;
  }
};

/**
 * Fetch all responses for a given product ID from "responses/[productId]".
 *
 * According to your 'report_item_response.js', each response is stored at:
 *   responses/{itemId}/{someUserUid} => { itemId, itemType, itemName, ... }
 */
export const fetchProductResponses = async (productId) => {
  try {
    const responsesRef = ref(database, `responses/${productId}`);
    const snapshot = await get(responsesRef);

    if (!snapshot.exists()) {
      console.log("No responses found for product", productId);
      return [];
    }

    const responsesObj = snapshot.val();
    // e.g. { userUid1: {...}, userUid2: {...}, ... }

    // Convert that object into an array of objects
    const responsesArray = Object.keys(responsesObj).map((userUid) => {
      const resp = responsesObj[userUid];
      return { id: userUid, ...resp };
    });

    return responsesArray;
  } catch (error) {
    console.error("Error fetching product responses:", error);
    return [];
  }
};
