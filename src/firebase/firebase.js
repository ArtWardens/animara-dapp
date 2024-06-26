// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC-f5DY8SY97uD8nThOVxtFEAyUXI1bBQI",
  authDomain: "animara-dapp.firebaseapp.com",
  projectId: "animara-dapp",
  storageBucket: "animara-dapp.appspot.com",
  messagingSenderId: "365901330490",
  appId: "1:365901330490:web:ade904574e59bd22781d03",
  // measurementId: "G-TQ3021STZC",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCXsrX-2wxsd35d5rKcTfN7zkeW4XVY200",
//   authDomain: "moveon-b6ea3.firebaseapp.com",
//   databaseURL: "https://moveon-b6ea3-default-rtdb.firebaseio.com",
//   projectId: "moveon-b6ea3",
//   storageBucket: "moveon-b6ea3.appspot.com",
//   messagingSenderId: "269542446082",
//   appId: "1:269542446082:web:53fd0253312517702a831b",
//   // measurementId: "G-WQVCSX6C65",
// };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, app, db, storage };
