import { db } from "../firebase/firebaseConfig";
import {  updateDoc, doc } from "firebase/firestore";

const handleUpdateCoins = async (data) => {
    try {
        // ! Update to data.uid
        const docRef = doc(db, "users", data.uid);
        
        await updateDoc(docRef, { coins: data.coins });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

const handleUpdateClickByLevel = async (data) => {
    try {
        // ! Update to data.uid
        const docRef = doc(db, "users", data.uid);
        
        await updateDoc(docRef, { clickByLevel: data.clickByLevel });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleUpdateCoins,
    handleUpdateClickByLevel
};