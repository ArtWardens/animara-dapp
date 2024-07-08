import { db } from "../firebase/firebaseConfig";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";

const handleGetUserData = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
          // docSnap.data() will be undefined in this case
          console.log("No such document!");
        };
    }catch (error) {
        console.log("Error getting user data: ", error);
    }
};

const handleUpdateUserLeaveTime = async (data) => {
    try {
        const docRef = doc(db, "users", data.userId);
        await updateDoc(docRef, { userLeaveTime: serverTimestamp() });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

const handleUpdateUserRechargableEnergy = async (data) => {
    try {
        const docRef = doc(db, "users", data.userId);
        await updateDoc(docRef, { energyRechargable: data.count, clickByLevel: 0, isLevelUp: false });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleGetUserData,
    handleUpdateUserLeaveTime,
    handleUpdateUserRechargableEnergy
};
