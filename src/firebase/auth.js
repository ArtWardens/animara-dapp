import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, auth, firstLoginLinkReferral } from "./firebaseConfig.js";
import {
  generateReferralCode,
  isReferralCodeValid,
  fetchRewardRate,
} from "../utils/fuctions.js";

const signUpWithEmailImpl = async (
  email,
  password,
  name,
  referralCode,
) => {
  try {
    // validate input before proceeding
    if (!name || !email || !password) { return -1; }
    if (!await isReferralCodeValid(referralCode)) { return -2; }

    // create user
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // update referral code if any
    if (referralCode !== ''){
      await firstLoginLinkReferral({ referralCode: referralCode });
    }

    // send verificaiton email
    const actionCodeSettings = {
      url: `${window.location.origin}/login?registrationEmail=${email}`,
      handleCodeInApp: false,
      dynamicLinkDomain: `${process.env.PUBLIC_URL}`
    };
    await sendEmailVerification(result.user, actionCodeSettings);

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

const getUserData = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const newReferralCode = generateReferralCode();
    const rewardRate = await fetchRewardRate();
    if (typeof rewardRate === "string") {
      return null;
    }

    const userData = {
      name: user.displayName,
      email: user.email,
      referralCode: newReferralCode,
      coins: 0,
      photoURL: user.photoURL || null,
      referredBy: null,
      createdAt: serverTimestamp(),
      isKOL: false,
      inviteRechargable: rewardRate.inviteRefresh,
      energyRechargable: rewardRate.basedRefresh,
      level: 1,
      profitPerHour: 0,
      clickByLevel: 0,
      loggedInToday: false,
      loginDays: 0,
      userId: user.uid
    };
    await setDoc(doc(db, "users", user.uid), userData);
  }
}

const loginWithEmailImpl = async (data) => {
  try {
    const { email, password } = data;
    const result = await signInWithEmailAndPassword(auth, email, password);
    const { user } = result;
    await getUserData(user);
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const loginWithGoogleImpl = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    await getUserData(user);
    return user;
  } catch (error) {
    return null;
  }
};

const loginWithTwitterImpl = async () => {
  const provider = new TwitterAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const { user } = result;
    await getUserData(user);
    return user;
  } catch (error) {
    return null;
  }
};

const loginWithTelegramImpl = async () =>{
  try {
    const result = await signInAnonymously(auth);
    console.log("User signed in anonymously:", result.user);
    const { user } = result;
    await getUserData(user);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
  }
}

const logoutImpl = async () => {
  try {
    await auth.signOut();
    return true;
  } catch (error) {
    return false;
  }
};

const resetPasswordImpl = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    return false;
  }
};

export {
  signUpWithEmailImpl,
  loginWithEmailImpl,
  loginWithTwitterImpl,
  loginWithGoogleImpl,
  loginWithTelegramImpl,
  logoutImpl,
  resetPasswordImpl,
  getAuth,
  onAuthStateChanged
};
