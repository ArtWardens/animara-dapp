import { db } from "../firebase/firebaseConfig";
import {  updateDoc, doc } from "firebase/firestore";

const handleUpdateCoins = async (data) => {
    try {
        // ! Update to data.userId
        const docRef = doc(db, "users", data.userId);
        
        await updateDoc(docRef, { coins: data.coins });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

const handleUpdateClickByLevel = async (data) => {
    try {
        // ! Update to data.userId
        const docRef = doc(db, "users", data.userId);
        
        await updateDoc(docRef, { clickByLevel: data.clickByLevel });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleUpdateCoins,
    handleUpdateClickByLevel
};