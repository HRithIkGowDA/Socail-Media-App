// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzOsfLoI3zOnizzeI3EEzbl4FU1JcJAdc",
  authDomain: "react-insta-clone-6ad6b.firebaseapp.com",
  projectId: "react-insta-clone-6ad6b",
  storageBucket: "react-insta-clone-6ad6b.appspot.com",
  messagingSenderId: "291297164778",
  appId: "1:291297164778:web:2e045ba8680b1194ccc693",
  measurementId: "G-P59WC38S9W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth();

export { auth };

export default db;
