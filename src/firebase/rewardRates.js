// Function to fetch reward rate from Firestore
import { db } from "../firebase/firebaseConfig";
import { getDoc, doc } from "firebase/firestore";

export const fetchRewardRate = async () => {
    try {
        const docRef = doc(db, "rewardRate", "BO6QrGeuUCpKHGWZoT9n"); // Use the actual document ID
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            // console.log("No such document!");
            return "No document found";
        }
    } catch (error) {
        // console.log("Error fetching reward rate: ", error);
        return "Error fetching data";
    }
};
