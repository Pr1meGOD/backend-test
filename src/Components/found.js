import { database } from "./firebase.js";
import { ref, get } from "firebase/database";
import { auth } from "./firebase.js"; 

function parseCustomTimestamp(timestampStr) {
  const [datePart, timePart] = timestampStr.split(' ');
  if (!datePart || !timePart) return new Date('invalid');
  const [day, month, year] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

export const fetchFoundItems = async () => {
  try 
  {
    const foundRef = ref(database, "found");
    const snapshot = await get(foundRef);
    
    if (!snapshot.exists()) 
    {
      console.log("No found items found.");
      return [];
    }


    const currentUser = auth.currentUser;
    if (!currentUser) 
    {
      console.error("No user is logged in.");
      return [];
    }
    const currentUserId = currentUser.uid;

    let foundItems = [];
    snapshot.forEach((userSnapshot) => {
      if (userSnapshot.key !== currentUserId) { 
        userSnapshot.forEach((itemSnapshot) => {
          foundItems.push({
            id: itemSnapshot.key,
            ...itemSnapshot.val(),
          });
        });
      }
    });


    foundItems.sort((a, b) => {
      const timeA = parseCustomTimestamp(a.timestamp).getTime();
      const timeB = parseCustomTimestamp(b.timestamp).getTime();
      return timeB - timeA;
    });

    return foundItems;
  } 
  catch (error) 
  {
    console.error("Error fetching found items:", error);
    return [];
    
  }
};
