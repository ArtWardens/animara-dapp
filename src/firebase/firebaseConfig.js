import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCXsrX-2wxsd35d5rKcTfN7zkeW4XVY200",
  authDomain: "moveon-b6ea3.firebaseapp.com",
  databaseURL: "https://moveon-b6ea3-default-rtdb.firebaseio.com",
  projectId: "moveon-b6ea3",
  storageBucket: "moveon-b6ea3.appspot.com",
  messagingSenderId: "269542446082",
  appId: "1:269542446082:web:53fd0253312517702a831b",
  measurementId: "G-WQVCSX6C65",
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
const claimCashback = httpsCallable(functions, "claimCashback");
const cancelCashbackClaim = httpsCallable(functions, "cancelCashbackClaim");
const checkUserLastPeriodicBatchTime = httpsCallable(functions, "checkUserLastPeriodicBatchTime");
const getNewLeaderBoard = httpsCallable(functions, "getLeaderboard");
const getCashbackClaimHistory = httpsCallable(functions, "getCashbackClaimHistory");
const updateUserStatus = httpsCallable(functions, "updateUserStatus");

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
  claimCashback,
  cancelCashbackClaim,
  checkUserLastPeriodicBatchTime,
  getNewLeaderBoard,
  getCashbackClaimHistory,
  updateUserStatus,
};
