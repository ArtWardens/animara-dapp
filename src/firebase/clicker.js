import { db } from "../firebase/firebaseConfig";
import {  updateDoc, doc } from "firebase/firestore";

const handleUpdateScore = async (data) => {
    try {
        // ! Update to data.userId
        const docRef = doc(db, "users", data.userId);
        
        await updateDoc(docRef, { score: data.score });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleUpdateScore,
};
