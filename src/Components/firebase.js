import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCPapbXbHN7nQKBA9JvrKfQBXq8_srIFtk",
  authDomain: "kjslaf.firebaseapp.com",
  projectId: "kjslaf",
  databaseURL: "https://kjslaf-default-rtdb.firebaseio.com/",
  storageBucket: "kjslaf.appspot.com",
  messagingSenderId: "883693940302",
  appId: "1:883693940302:web:80aafcbe8e8abaabbcdd1f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
export { auth, app, database };
