// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBgXn9T8iyHtsAI8cYZ_fN_tjCXhrqwWNI",
  authDomain: "react-firebase-7476e.firebaseapp.com",
  projectId: "react-firebase-7476e",
  storageBucket: "react-firebase-7476e.appspot.com",
  messagingSenderId: "200703096534",
  appId: "1:200703096534:web:4d7bf9310d9f6e6e68bb77",
  measurementId: "G-3WVWDDH92N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
