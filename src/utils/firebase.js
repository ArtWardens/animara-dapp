import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function insertCollection(collectionName, data) {
  try {
    await setDoc(doc(db, collectionName, data.uid), data);
  } catch (error) {
    console.log(error)
  }
};

export async function getCollection(collectionName, uid) {
  const docRef = doc(db, collectionName, uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
};
