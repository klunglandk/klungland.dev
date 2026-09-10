import { initializeApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYAXxEcebYbPnpaN5rFOZ1l85OMlKW25c",
  authDomain: "klungland-dev.firebaseapp.com",
  projectId: "klungland-dev",
  storageBucket: "klungland-dev.firebasestorage.app",
  messagingSenderId: "804178541082",
  appId: "1:804178541082:web:9c084a3c4fb84dd4d7efa3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore with full TypeScript typing
export const db: Firestore = getFirestore(app);
