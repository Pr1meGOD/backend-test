import { ref, update } from "firebase/database";
import { database } from "./firebase";

export async function changeResponseStatus(itemId, responseUserId, newStatus) {
  try {
    const responseRef = ref(database, `responses/${itemId}/${responseUserId}`);
    await update(responseRef, { responseStatus: newStatus });
    return { success: true };
  } catch (error) {
    console.error("Error updating response status:", error);
    return { success: false, error: error.message };
  }
}

export async function approveResponse(itemId, responseUserId) {
  return changeResponseStatus(itemId, responseUserId, "Approved");
}

export async function rejectResponse(itemId, responseUserId) {
  return changeResponseStatus(itemId, responseUserId, "Rejected");
}
