// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOYsGsOMrDOiHb9qyv4m3VWWE_shM3yD0",
  authDomain: "assurance-case-playground.firebaseapp.com",
  projectId: "assurance-case-playground",
  storageBucket: "assurance-case-playground.firebasestorage.app",
  messagingSenderId: "1057808314379",
  appId: "1:1057808314379:web:2c80eacc06fb7efefad70e",
  measurementId: "G-WXVE06K4NG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);