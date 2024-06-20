import { db } from "../firebase/config";
import { toast } from "react-toastify";
import {  updateDoc, setDoc, doc } from "firebase/firestore";

const handleUpdateScore = async (data) => {
    try {
        // ! Update to data.userId
        const docRef = doc(db, "users", "Ij0QBrTicFT9LsAeWRNMJLCu7O32");
        
        await updateDoc(docRef, { score: data.score });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleUpdateScore,
};
