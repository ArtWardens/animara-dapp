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
  auth,
  firstLoginLinkReferral,
  cleanupFailedRegistration,
} from "./firebaseConfig.js";
import {
  isReferralCodeValid,
} from "../utils/fuctions.js";

const signUpWithEmailImpl = async (email, password, name, referralCode) => {
  try {
    // validate input before proceeding
    if (!name || !email || !password) {
      return -1;
    }
    if (!(await isReferralCodeValid(referralCode))) {
      return -2;
    }

    // create user
    const result = await createUserWithEmailAndPassword(auth, email, password);

    console.log(result);

    // update referral code if any
    if (referralCode !== "") {
      try {
        await firstLoginLinkReferral({ referralCode: referralCode });
      } catch (err) {
        return -3;
      }
    }
    console.log(process.env);

    try {
      // send verificaiton email
      const actionCodeSettings = {
        url: `${process.env.REACT_APP_PUBLIC_URL}/login?registrationEmail=${email}`,
        handleCodeInApp: false,
        dynamicLinkDomain: `${process.env.REACT_APP_DOMAIN}`,
      };
      const verifyEmailResult = await sendEmailVerification(
        result.user,
        actionCodeSettings
      );
      console.log(verifyEmailResult);
      //redirect user to verify email page
      window.location.href = "/verify-email";
    } catch (err) {
      console.log(err);
      try {
        await cleanupFailedRegistration();
      } catch (err) {
        return -5;
      }
      return -4;
    }
    // cleanupFailedRegistration
    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

const getIdTokenResult = async (user) => {
  return await user?.getIdTokenResult(true);
};

const loginWithEmailImpl = async (data) => {
  try {
    const { email, password } = data;
    const result = await signInWithEmailAndPassword(auth, email, password);
    const { user } = result;
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
    return user;
  } catch (error) {
    return null;
  }
};

const loginWithTelegramImpl = async () => {
  try {
    const result = await signInAnonymously(auth);
    console.log("User signed in anonymously:", result.user);
    const { user } = result;
    return user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
  }
};

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
  getIdTokenResult,
  loginWithEmailImpl,
  loginWithTwitterImpl,
  loginWithGoogleImpl,
  loginWithTelegramImpl,
  logoutImpl,
  resetPasswordImpl,
  getAuth,
  onAuthStateChanged,
};
