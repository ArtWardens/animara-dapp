import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";


const firebaseConfig = {
  apiKey: "AIzaSyCOJl7jgY2SMFGsywAi1NGWcBdPl5FPBqQ",
  authDomain: "clickergame-abb43.firebaseapp.com",
  projectId: "clickergame-abb43",
  storageBucket: "clickergame-abb43.appspot.com",
  messagingSenderId: "763649762230",
  appId: "1:763649762230:web:90996f5162b56f89ce5717",
  measurementId: "G-NCBWRKPT2Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// define all firebase functions here
const updateUserLastLogin = httpsCallable(functions, 'updateUserLastLogin');

export { auth, app, db, storage, updateUserLastLogin };
