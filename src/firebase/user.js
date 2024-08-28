import { auth, db, storage, updateUserLastLogin, dailyLogin, getReferralStats } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { getIdTokenResult, updateProfile } from "firebase/auth";

// functions that we export for saga
const getUserDataImpl = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    const referralRef = doc(db, 'referrals', uid);
    const referralSnap = await getDoc(referralRef);

    let canResetPassword = false;
    const token = await getIdTokenResult(auth.currentUser);

    const completedTaskRef = doc(db, "oneTimeTask", uid);
    const completedTaskSnap = await getDoc(completedTaskRef);

    if (token.signInProvider === "password") {
      canResetPassword = true;
    }

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const referredBy = referralSnap.exists() ? referralSnap.data().referredBy : null;

      return {
        ...userData,
        referredBy,  // Include referredBy from the "referrals" collection
        completedTask: completedTaskSnap.exists()
          ? completedTaskSnap.data().completedTask
          : [],
        canResetPassword,
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.log("Error getting user data: ", error);
    return null;
  }
};

const updateUserProfileImpl = async (
  name,
  inviteCode,
  phoneNumber,
  photoString
) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No authenticated user found");
    }

    const uid = user.uid;

    let photoURL;
    if (photoString) {
      const pfpRef = ref(storage, `profile-images/${user?.uid}`);
      await uploadString(pfpRef, photoString, "data_url");
      photoURL = await getDownloadURL(pfpRef);
    }

    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User not found");
    }

    const updateData = {};
    if (name) {
      updateData.name = name;
    }

    if (photoURL) {
      updateData.photoUrl = photoURL;
    }

    if (phoneNumber) {
      updateData.phoneNumber = phoneNumber;
    }

    const firestoreUpdate = updateDoc(userRef, updateData);

    const referralRef = doc(db, "referrals", uid);
    const referralDoc = await getDoc(referralRef);

    console.log("Referral Document Exists:", referralDoc.exists());
    console.log("Referral Document Data:", referralDoc.data());

    const referralData = referralDoc.exists() ? referralDoc.data() : {};

    if (inviteCode) {
      referralData.referredBy = inviteCode;
    } else {
      console.log("No invite code provided");
    }

    if (referralDoc.exists()) {
      console.log("Updating existing referral document...");
      await updateDoc(referralRef, referralData);
    } else {
      console.log("Referral document does not exist, unable to update using updateDoc.");
      // Here you might need to add logic to create the document if it doesn't exist
    }

    const authUpdateData = { displayName: name };
    if (photoURL) {
      authUpdateData.photoURL = photoURL;
    }
    const authUpdate = updateProfile(user, authUpdateData);

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
      console.log("Failed to daily login with error: ", error)
  }
}

const getReferralStatsImpl = async () =>{
  try {
    const idToken = await auth.currentUser.getIdToken(false);
    const { data } = await getReferralStats({idToken: idToken});
    if (data.error){
        throw data.error;
    }
    return data;
  }catch (error) {
      console.log("Failed to get referral stats withe error: ", error);
      throw error;
  }
}

export {
    getUserDataImpl,
    updateUserProfileImpl,
    updateUserLeaveTimeImpl,
    dailyLoginImpl,
    getReferralStatsImpl
};
