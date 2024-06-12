// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCXsrX-2wxsd35d5rKcTfN7zkeW4XVY200",
  authDomain: "moveon-b6ea3.firebaseapp.com",
  projectId: "moveon-b6ea3",
  storageBucket: "moveon-b6ea3.appspot.com",
  messagingSenderId: "269542446082",
  appId: "1:269542446082:web:53fd0253312517702a831b",
  measurementId: "G-WQVCSX6C65",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
