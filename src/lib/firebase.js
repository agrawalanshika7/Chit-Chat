import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmwYiDXi5cMJBxS-fHs6UWjK4FY7VFkVo",
  authDomain: "chatapp-dd2fc.firebaseapp.com",
  projectId: "chatapp-dd2fc",
  storageBucket: "chatapp-dd2fc.appspot.com",
  messagingSenderId: "731436616655",
  appId: "1:731436616655:web:66142ab0ca39e6f443a0ba"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();