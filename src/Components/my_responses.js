import { ref, get } from "firebase/database";
import { database } from "./firebase.js";

export async function fetchMyResponses(userId) {
  try {
    if (!userId) {
      throw new Error("User ID is undefined.");
    }
    const myResponsesRef = ref(database, `my_responses/${userId}`);
    const snapshot = await get(myResponsesRef);
    if (!snapshot.exists()) {
      return [];
    }
    const responsesObj = snapshot.val();
    return Object.keys(responsesObj).map(key => ({
      id: key,
      ...responsesObj[key]
    }));
  } catch (error) {
    console.error("Error fetching my responses:", error);
    return [];
  }
}
