import {
  auth,
  db,
  storage,
  updateUserLastLogin,
} from "../firebase/firebaseConfig";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { getIdTokenResult, updateProfile } from "firebase/auth";
import { isReferralCodeValid } from "../utils/fuctions";

// functions that we export for saga
const handleGetUserData = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    let canResetPassword = false;
    const token = await getIdTokenResult(auth.currentUser);

    const completedTaskRef = doc(db, "oneTimeTask", uid);
    const completedTaskSnap = await getDoc(completedTaskRef);

    if (token.signInProvider == "password") {
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
      updateData.referredBy = inviteCode;
      // await updateCoins(inviteCode, user);
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
    return await handleGetUserData(auth.currentUser.uid);

  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};

const handleUpdateUserLeaveTime = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
    console.log(`idToken ${idToken}`);
    await updateUserLastLogin({ idToken: idToken });
  } catch (error) {
    console.log("Error setting user data: ", error);
  }
};

const handleUpdateUserRechargableEnergy = async (data) => {
  try {
    const docRef = doc(db, "users", data.uid);
    await updateDoc(docRef, {
      energyRechargable: data.count,
      clickByLevel: 0,
      isCompletedToday: false,
    });
  } catch (error) {
    console.log("Error setting user data: ", error);
  }
};

const handleUpdateUserRechargableInvite = async (data) => {
  try {
    const docRef = doc(db, "users", data.uid);
    await updateDoc(docRef, {
      inviteRechargable: data.count,
      clickByLevel: 0,
      isCompletedToday: false,
    });
  } catch (error) {
    console.log("Error setting user data: ", error);
  }
};

const handleUpdateDailyLogin = async (data) => {
  console.log(data);
  try {
    const docRef = doc(db, "users", data.uid);
    updateDoc(docRef, {
      loggedInToday: true,
      coins: increment(data.coins),
      loginDays: increment(1),
    });
  } catch (error) {
    console.log("Error getting user data: ", error);
  }
};

export {
  handleGetUserData,
  updateUserProfileImpl,
  handleUpdateUserLeaveTime,
  handleUpdateUserRechargableEnergy,
  handleUpdateUserRechargableInvite,
  handleUpdateDailyLogin,
};
