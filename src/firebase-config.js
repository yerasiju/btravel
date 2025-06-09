import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCp9yJfC8cVV9p6zLDq1jjd7o9PPreNcaQ",
  authDomain: "btravel-78b9b.firebaseapp.com",
  projectId: "btravel-78b9b",
  storageBucket: "btravel-78b9b.firebasestorage.app",
  messagingSenderId: "140581850130",
  appId: "1:140581850130:web:b43a1c2dba68eac82c9ccb",
  measurementId: "G-HFGG5NJTQ6",
};

console.log("🚀 Initializing Firebase...");

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

console.log("🔥 Firebase initialized successfully!");
console.log("📊 Project ID:", firebaseConfig.projectId);
console.log("🗄️ Database app name:", db.app.name);
console.log("🔍 Database type:", typeof db);
console.log("🔍 Database constructor:", db.constructor.name);

// Дополнительная проверка
if (db && db.app && db.app.name) {
  console.log("✅ Firestore instance is valid");
} else {
  console.error("❌ Firestore instance is invalid");
  console.log("🔍 DB object:", db);
}

export { app, auth, db, storage };
