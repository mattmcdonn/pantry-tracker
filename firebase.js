// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA7EDjAVUFC1ZBOlWE27bhMgx-Ge1GPuOs",
  authDomain: "pantry-tracker-dfcfc.firebaseapp.com",
  projectId: "pantry-tracker-dfcfc",
  storageBucket: "pantry-tracker-dfcfc.appspot.com",
  messagingSenderId: "698858773665",
  appId: "1:698858773665:web:0f3f3f93c58cddffdae4e0",
  measurementId: "G-B1RBJKL3CL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}