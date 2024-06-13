import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0gC238R2JQ-ZiGaTxlA382Zi4ueGSZD8",
  authDomain: "clickergame-b2590.firebaseapp.com",
  projectId: "clickergame-b2590",
  storageBucket: "clickergame-b2590.appspot.com",
  messagingSenderId: "394338819672",
  appId: "1:394338819672:web:aa1e25837154e93cca342d",
//   measurementId: "G-XEYYBPZGT5"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig): getApp();
// const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);

export {auth, app, db};