import {
  GoogleAuthProvider,
  TwitterAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCustomToken,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import {
  auth,
  firstLoginLinkReferral,
  cleanupFailedRegistration,
  loginWithTelegram,
} from "./firebaseConfig.js";

const signUpWithEmailImpl = async (email, password, username, referralCode) => {
  try {
    // validate input before proceeding
    if (!username || !email || !password) {
      return -1;
    }

    // create user
    const result = await createUserWithEmailAndPassword(auth, email, password);

    // update referral code if any
    const idToken = await result.user.getIdToken();
    if (referralCode !== "") {
      try {
        await firstLoginLinkReferral({ idToken: idToken, referralCode: referralCode });
      } catch (err) {
        await cleanupFailedRegistration({ idToken: idToken });
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

      await sendEmailVerification(
        result.user,
        actionCodeSettings
      );

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
    if (error.code === 'auth/error-code:-47'){
      return -6;
    }
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
    const result = await signInWithRedirect(auth, provider);
    const { user } = result;
    return user;
  } catch (error) {
    console.log(error);
    if (error.code === "auth/account-exists-with-different-credential") {
      throw error;
    }
    return null;
  }
};

const loginWithTelegramImpl = async (telegramUser) => {
  try {
    // Firebase does not support signInWithPopup with Telegram
    // for every user authenticated with telegram, our backend creates a corresponding firebase user. When user log in with Telegram, we stealthily login the user with corresponding Firebase user using custom token
    const token = await loginWithTelegram(telegramUser);
    const result = await signInWithCustomToken(auth, token.data.token);
    const { user } = result;
    return user;
  } catch (error) {
    return error;
  }
};

const checkLoginWithRedirectImpl = async () =>{
  const result = await getRedirectResult(auth);
  if (result){
    return result.user || auth.currentUser;
  }
  return null;
}

const logoutImpl = async () => {
    return await auth.signOut();
};

const resetPasswordImpl = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    return false;
  }
};

const getCurrentUserIdImpl = ()=>{
  return auth.currentUser.uid;
}

export {
  signUpWithEmailImpl,
  getIdTokenResult,
  loginWithEmailImpl,
  loginWithTwitterImpl,
  loginWithGoogleImpl,
  loginWithTelegramImpl,
  logoutImpl,
  resetPasswordImpl,
  getCurrentUserIdImpl,
  checkLoginWithRedirectImpl,
};
