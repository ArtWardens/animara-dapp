import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken,
} from "firebase/auth";
import {
  auth,
  firstLoginLinkReferral,
  cleanupFailedRegistration,
  loginWithTelegram,
} from "./firebaseConfig.js";
import { isReferralCodeValid } from "../utils/fuctions.js";

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

    // update referral code if any
    if (referralCode !== "") {
      try {
        await firstLoginLinkReferral({ referralCode: referralCode });
      } catch (err) {
        return -3;
      }
    }

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
      try {
        const idToken = await result.user.getIdToken();
        await cleanupFailedRegistration({ idToken: idToken });
      } catch (err) {
        return -4;
      }
      return -5;
    }
    // cleanupFailedRegistration
    return 1;
  } catch (error) {
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
    console.log(error);
    if (error.code === 'auth/account-exists-with-different-credential') {
      throw error;
    }
    return null;
  }
};

const loginWithTelegramImpl = async (telegramUser) => {
  try {
    // call http req
    const token = await loginWithTelegram(telegramUser);
    // sign in with custom token 
    const result = await signInWithCustomToken(auth, token.data.token);
    const { user } = result;
    return user;
  } catch (error) {
    return error;
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
