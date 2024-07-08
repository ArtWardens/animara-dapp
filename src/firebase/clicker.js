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

const handleUpdateClickToLvlUp = async (data) => {
    try {
        // ! Update to data.userId
        const docRef = doc(db, "users", data.userId);
        
        await updateDoc(docRef, { clickToLvlUp: data.clickToLvlUp });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

const handleUpdateLevelUp = async (data) => {
    try {
        // ! Update to data.userId
        const docRef = doc(db, "users", data.userId);
        
        await updateDoc(docRef, { 
            level: data.level, 
            coins: data.coins, 
            clickToLvlUp: data.clickToLvlUp, 
            clickByLevel: data.clickByLevel,
            isLevelUp: true,
        });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleUpdateCoins,
    handleUpdateClickByLevel,
    handleUpdateClickToLvlUp,
    handleUpdateLevelUp
};
