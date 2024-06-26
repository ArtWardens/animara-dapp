import { auth } from "./firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";

const handleSignUp = async (
  email,
  password,
  name,
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed up successfully:", userCredential.user);
    toast.success("Signed up successfully");

    return userCredential.user;
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Error signing up");
    return null;
  }
};

const handleSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    console.log("User signed in with Google:", userCredential.user);
    toast.success("Signed in with Google");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    toast.error("Error signing in with Google");
    return null;
  }
};

const handleSignIn = async (data) => {
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
  handleSignUp,
  handleSignInWithGoogle,
  handleSignIn,
  handleLogout,
  handleEmailVerification,
  handlePasswordReset,
};
