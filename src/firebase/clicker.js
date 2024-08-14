import { auth, db, getUserLocations, exploreLocation } from "../firebase/firebaseConfig";
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

const getUserLocationImpl = async () => {
    // get user's updated details for each location from firebase
    try {
        // obtain the ID token of the currrent logged in user
        const idToken = await auth.currentUser.getIdToken(false);
        const data = await getUserLocations({
            idToken: idToken,
        });
        return data;

    } catch (error) {
        console.log("Error handling get user location details ", error);
      
    }
};

const upgradeUserLocationImpl = async (locationId) => {
    console.log(locationId);
    // update user's location in firestore
    try {
        // obtain the ID token of the currrent logged in user
        const idToken = await auth.currentUser.getIdToken(false);
        const data = await exploreLocation({
            idToken: idToken,
            locationId: locationId.payload
        });
        return data;

    } catch (error) {
        console.log("Error handling get user location details ", error);
      
    }
};

export {
    handleUpdateCoins,
    handleUpdateClickByLevel,
    getUserLocationImpl,
    upgradeUserLocationImpl
};