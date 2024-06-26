import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  TwitterAuthProvider,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../firebase/firebase";
import {
  generateReferralCode,
  isReferralCodeValid,
  updateCoins,
} from "../utils/fuctions.js";

const handleSignUp = async (
  email: string,
  password: string,
  name: string,
  referralCode?: string
): Promise<User | null> => {
  try {
    const isReferralValid = await isReferralCodeValid(referralCode);
    if (!isReferralValid && referralCode) {
      toast.error("Invalid referral code");
      return null;
    }

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return null;
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    console.log("User signed up successfully:", user);

    const newReferralCode = generateReferralCode();

    const userData = {
      name: name,
      email: user.email,
      referralCode: newReferralCode,
      coins: 0,
      photoURL: user.photoURL || null,
      referredBy: referralCode || null,
      createdAt: serverTimestamp(),
      isKOL: false,
    };

    await setDoc(doc(db, "users", user.uid), userData);
    console.log("User document added to Firestore");

    if (referralCode) {
      try {
        await updateCoins(referralCode, user);
      } catch (error) {
        toast.error("Error using the referral code");
      }
    }
    toast.success("Signed up successfully");

    return user;
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Error signing up");
    return null;
  }
};

const handleSignInWithGoogle = async (
  referralCode?: string
): Promise<User | null> => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const { user } = userCredential;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const newReferralCode = generateReferralCode();
      const userData = {
        name: user.displayName,
        email: user.email,
        referralCode: newReferralCode,
        coins: 0,
        photoURL: user.photoURL || null,
        referredBy: null,
        createdAt: serverTimestamp(),
        isKOL: false,
      };
      await setDoc(doc(db, "users", user.uid), userData);
    }

    const currentData = userDoc.data();
    if (currentData?.referredBy == null && referralCode) {
      await updateDoc(userRef, { referredBy: referralCode });
      await updateCoins(referralCode, user);
    }

    console.log("User signed in with Google:", userCredential.user);
    toast.success("Signed in with Google");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    toast.error("Error signing in with Google");
    return null;
  }
};

const handleSignInWithTwitter = async (
  referralCode?: string
): Promise<User | null> => {
  const provider = new TwitterAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    const { user } = userCredential;

    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      const newReferralCode = generateReferralCode();
      const userData = {
        name: user.displayName,
        email: user.email,
        referralCode: newReferralCode,
        coins: 0,
        photoURL: user.photoURL || null,
        referredBy: null,
        referredUsers: [],
        createdAt: serverTimestamp(),
        isKOL: false,
      };
      await setDoc(doc(db, "users", user.uid), userData);
    }

    const currentData = userDoc.data();
    if (currentData?.referredBy == null && referralCode) {
      await updateDoc(userRef, { referredBy: referralCode });
      await updateCoins(referralCode, user);
    }

    console.log("User signed in with Twitter:", userCredential.user);
    toast.success("Signed in with Twitter");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with Twitter:", error);
    toast.error("Error signing in with Twitter");
    return null;
  }
};

const handleSignIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const { email, password } = data;
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    toast.success("Signed in");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    toast.error("Error signing in");
    return null;
  }
};

const handleLogout = async () => {
  try {
    await auth.signOut();
    toast.success("Logged out successfully");
    return true;
  } catch (error) {
    toast.error("Error signing out");
    return false;
  }
};

const handleEmailVerification = async () => {
  try {
    await sendEmailVerification(auth.currentUser);
    toast.success("Email verification sent");
    return true;
  } catch (error) {
    toast.error("Error sending email verification");
    return false;
  }
};

const handlePasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent");
    return true;
  } catch (error) {
    toast.error("Error sending password reset email");
    return false;
  }
};

export {
  handleEmailVerification,
  handleLogout,
  handlePasswordReset,
  handleSignIn,
  handleSignInWithTwitter,
  handleSignInWithGoogle,
  handleSignUp,
};
