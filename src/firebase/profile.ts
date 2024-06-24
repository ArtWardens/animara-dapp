import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { updateCoins, isReferralCodeValid } from "../utils/fuctions";

export async function updateUserProfile(
  name: string,
  inviteCode: string | null,
  photoString?: string
) {
  const isReferralValid = await isReferralCodeValid(inviteCode);
  if (!isReferralValid && inviteCode) {
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
      // const photoBuffer = Buffer.from(photoString, "base64");
      // const photoFileName = `profile-images/${uid}`;
      // const file = storage.ref().child(photoFileName);
      // await file.put(photoBuffer);
      // photoURL = await file.getDownloadURL();
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
    const updateData: any = { name };

    // Only add photoURL if it's provided
    if (photoURL) {
      updateData.photoURL = photoURL;
    }

    // Only update invite code if it is not already set
    if (!currentData.referredBy && inviteCode) {
      updateData.referredBy = inviteCode;
      await updateCoins(inviteCode, user);
    }

    // Prepare updates for Firestore and Firebase Auth
    const firestoreUpdate = updateDoc(userRef, updateData);
    const authUpdateData: any = { displayName: name };
    if (photoURL) {
      authUpdateData.photoURL = photoURL;
    }
    const authUpdate = updateProfile(user, authUpdateData);

    // Execute updates concurrently
    await Promise.all([firestoreUpdate, authUpdate]);

    await auth.currentUser?.reload();

    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
}
