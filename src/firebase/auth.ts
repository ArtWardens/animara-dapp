import { auth } from "../firebase/firebase.ts";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { User, sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";

const handleSignUp = async (
  email: string,
  password: string,
  name: string
): Promise<User | null> => {
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

const handleSignInWithGoogle = async (): Promise<User | null> => {
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

const handleSignIn = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User signed in successfully:", userCredential.user);
    toast.success("Signed in");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    toast.error("Error signing in");
    return null;
  }
};

const handleLogout = async (): Promise<boolean> => {
  try {
    await auth.signOut();
    toast.success("Logged out successfully");
    return true;
  } catch (error) {
    toast.error("Error signing out");
    return false;
  }
};

const handleEmailVerification = async (): Promise<boolean> => {
  try {
    await sendEmailVerification(auth.currentUser as User);
    toast.success("Email verification sent");
    return true;
  } catch (error) {
    toast.error("Error sending email verification");
    return false;
  }
};

const handlePasswordReset = async (email: string): Promise<boolean> => {
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
