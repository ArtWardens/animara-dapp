import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCcIwEQL5hhqj9f-5ExOIiSlXnSvcJ8YGg",
  authDomain: "animara-38a73.firebaseapp.com",
  projectId: "animara-38a73",
  storageBucket: "animara-38a73.appspot.com",
  messagingSenderId: "924690778781",
  appId: "1:924690778781:web:1b39a99f3e6da6a3596274",
  measurementId: "G-V2D9X0LB6K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);

// define all firebase functions here
const updateUserLastLogin = httpsCallable(functions, "updateUserLastLogin");
const firstLoginLinkReferral = httpsCallable(
  functions,
  "firstLoginLinkReferral"
);
const cleanupFailedRegistration = httpsCallable(
  functions,
  "cleanupFailedRegistration"
);
const loginWithTelegram = httpsCallable(functions, "loginWithTelegram");
const dailyLogin = httpsCallable(functions, "dailyLogin");
const completeOneTimeTask = httpsCallable(functions, "completeOneTimeTask");
const settleTapSession = httpsCallable(functions, "settleTapSession");
const rechargeEnergy = httpsCallable(functions, "rechargeEnergy");
const rechargeEnergyByInvite = httpsCallable(
  functions,
  "rechargeEnergyByInvite"
);
const getUserLocations = httpsCallable(functions, "getUserLocations");
const exploreLocation = httpsCallable(functions, "exploreLocation");
const getReferralStats = httpsCallable(functions, "getReferralStats");
const bindWallet = httpsCallable(functions, "bindWallet");
const unbindWallet = httpsCallable(functions, "unbindWallet");
const registerNFT = httpsCallable(functions, "registerNFT");

export {
  auth,
  app,
  db,
  storage,
  updateUserLastLogin,
  firstLoginLinkReferral,
  cleanupFailedRegistration,
  loginWithTelegram,
  dailyLogin,
  completeOneTimeTask,
  settleTapSession,
  rechargeEnergy,
  rechargeEnergyByInvite,
  getUserLocations,
  exploreLocation,
  getReferralStats,
  bindWallet,
  unbindWallet,
  registerNFT,
};
