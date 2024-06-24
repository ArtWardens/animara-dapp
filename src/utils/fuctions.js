import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  FieldPath,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "../firebase/firebase";
import { HmacSHA256, SHA256, enc } from "crypto-js";
import { getAuth, signInAnonymously } from "firebase/auth";

export const getTodayDate = () => {
  const date = new Date();

  const malaysiaTimeZone = "Asia/Kuala_Lumpur";
  const malaysiaTime = new Date(
    date.toLocaleString("en-US", { timeZone: malaysiaTimeZone })
  );

  let day = malaysiaTime.getDate();
  let month = malaysiaTime.getMonth() + 1;
  let year = malaysiaTime.getFullYear();

  if (day.toString().length === 1) {
    day = "0" + day;
  }
  if (month.toString().length === 1) {
    month = "0" + month;
  }
  if (year.toString().length === 1) {
    year = "0" + year;
  }

  let currentDate = `${day}-${month}-${year}`;
  return currentDate;
};

export const getTodayMalaysiaDate = () => {
  const malaysiaTimeZone = "Asia/Kuala_Lumpur";
  const malaysiaTime = new Date().toLocaleString("en-US", {
    timeZone: malaysiaTimeZone,
  });
  return new Date(malaysiaTime);
};

export function calculateTimeRemaining() {
  const malaysiaTime = getTodayMalaysiaDate();
  const endOfDay = new Date(malaysiaTime);
  endOfDay.setHours(23, 59, 59, 999);

  const timeDifference = endOfDay - malaysiaTime;

  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}

export const generateReferralCode = () => {
  return uuidv4().slice(0, 8);
};

export const updateCoins = async (referralCode, user) => {
  const referrerQuery = query(
    collection(db, "users"),
    where("referralCode", "==", referralCode)
  );
  const referrerSnapshot = await getDocs(referrerQuery);

  const userQuery = doc(db, "users", user.uid);
  const userDoc = await getDoc(userQuery);

  if (!referrerSnapshot.empty) {
    console.log("Referrer found:", referrerSnapshot.docs[0].data());

    const referrerDoc = referrerSnapshot.docs[0];
    const referrerId = referrerDoc.id;

    // Update referrer's data
    await updateDoc(doc(db, "users", referrerId), {
      coins: referrerDoc.data().coins + 5000, // Reward referrer with coins
      referredUsers: arrayUnion(user.uid),
    });

    await updateDoc(doc(db, "users", user.uid), {
      coins: userDoc.data().coins + 5000, // Reward new user with coins
    });
  }
};

export const isReferralCodeValid = async (referralCode) => {
  const querySnapshot = await getDocs(
    query(collection(db, "users"), where("referralCode", "==", referralCode))
  );

  return !querySnapshot.empty;
};

export const signInUser = async () => {
  try {
    const result = await signInAnonymously(auth);
    console.log("User signed in anonymously:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
  }
};

export const storeUserInFirestore = async (uid, data) => {
  const usersCollection = collection(db, "users");
  const q = query(usersCollection, where("telegram_id", "==", data.id));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // User with the same telegram_id already exists
    const userDoc = querySnapshot.docs[0];
    const oldUid = userDoc.id;

    if (oldUid !== uid) {
      // Create a new document with the new uid
      const newDocRef = doc(db, "users", uid);
      await setDoc(newDocRef, {
        ...userDoc.data(),
      });

      // Delete the old document
      await deleteDoc(doc(db, "users", oldUid));

      console.log("User document updated with new uid:", uid);
    } else {
      console.log("User document already has the correct uid:", uid);
    }

    return;
  }

  const userRef = doc(db, "users", uid);
  const newReferralCode = generateReferralCode();
  await setDoc(userRef, {
    name: data.first_name + " " + data.last_name,
    email: null,
    referralCode: newReferralCode,
    coins: 0,
    photoURL: null,
    referredBy: null,
    referredUsers: [],
    createdAt: serverTimestamp(),
    isKOL: false,
    telegram_id: data.id,
  });
};
