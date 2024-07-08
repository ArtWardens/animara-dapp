// Function to fetch depletionReward from Firestore

import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

export const fetchDepletionReward = async () => {
    try {
        const docRef = doc(db, "staminaRate", "8YAdA856ULyoV3UqQAyY"); // Use the actual document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data().depletionReward;
        } else {
            // console.log("No such document!");
            return "No document found";
        }
    } catch (error) {
        // console.log("Error fetching depletionReward: ", error);
        return "Error fetching data";
    }
};
