import { auth, db, storage, updateUserLastLogin, dailyLogin } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { getIdTokenResult, updateProfile } from "firebase/auth";

export const isReferralCodeValid = async (referralCode) => {
  try {
    if (referralCode === ''){
      return true;
    }
    try {
      const querySnapshot = await db.collection("users").where("referralCode", "==", referralCode).get();
      return !querySnapshot.empty;
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

// functions that we export for saga
const getUserDataImpl = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    let canResetPassword = false;
    const token = await getIdTokenResult(auth.currentUser);

    const completedTaskRef = doc(db, "oneTimeTask", uid);
    const completedTaskSnap = await getDoc(completedTaskRef);

    if (token.signInProvider === "password") {
      canResetPassword = true;
    }

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        completedTask: completedTaskSnap.exists()
          ? completedTaskSnap.data().completedTask
          : [],
        canResetPassword,
      };
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error getting user data: ", error);
  }
};

const updateUserProfileImpl = async (
  name,
  inviteCode,
  phoneNumber,
  photoString
) => {
  const isReferralValid = await isReferralCodeValid(inviteCode);
  if (!isReferralValid && inviteCode) {
    console.log(isReferralValid);
    console.log(inviteCode);
    throw new Error("Invalid referral code");
  }

  try {
    // Get the current user
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const uid = user.uid;

    // Upload the photo to Firebase Storage if provided
    let photoURL;
    if (photoString) {
      const pfpRef = ref(storage, `profile-images/${user?.uid}`);
      await uploadString(pfpRef, photoString, "data_url");
      photoURL = await getDownloadURL(pfpRef);
    }

    // Fetch the current user document
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const currentData = userDoc.data();
    const updateData = { name: name };

    // Only add photoURL if it's provided
    if (photoURL) {
      updateData.photoUrl = photoURL;
    }

    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber;
    }

    // Only update invite code if it is not already set
    if (!currentData.referredBy && inviteCode) {
      // note: firebase functions that listens to changes on referredBy
      // will be responsible to grant the necessary rewards
      updateData.referredBy = inviteCode;
    }

    // Prepare updates for Firestore and Firebase Auth
    const firestoreUpdate = updateDoc(userRef, updateData);
    const authUpdateData = { displayName: name };
    if (photoURL) {
      authUpdateData.photoURL = photoURL;
    }
    const authUpdate = updateProfile(user, authUpdateData);

    // Execute updates concurrently
    await Promise.all([firestoreUpdate, authUpdate]);
    return await getUserDataImpl(auth.currentUser.uid);

  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

const updateUserLeaveTimeImpl = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
    console.log(`idToken ${idToken}`);
    await updateUserLastLogin({ idToken: idToken });
  } catch (error) {
    console.log("Error setting user data: ", error);
  }
};

const dailyLoginImpl = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
    const { data } = await dailyLogin({idToken: idToken});
    return data;
  }catch (error) {
      console.log("Error updating daily login: ", error)
  }
}

export {
    getUserDataImpl,
    updateUserProfileImpl,
    updateUserLeaveTimeImpl,
    dailyLoginImpl
};
