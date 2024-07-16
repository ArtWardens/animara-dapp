import { auth, db, updateUserLastLogin } from "../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";


// functions that we export for saga
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


const handleUpdateUserLeaveTime = async () => {
    try {
        // can do:
        // const result = await updateUserLastLogin(...)
        // instead if we want to have different handling based on 
        // the results returned from backend
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        console.log(`idToken ${idToken}`);
        await updateUserLastLogin({idToken: idToken});
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

const handleUpdateUserRechargableEnergy = async (data) => {
    try {
        const docRef = doc(db, "users", data.userId);
        await updateDoc(docRef, { energyRechargable: data.count });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleGetUserData,
    handleUpdateUserLeaveTime,
    handleUpdateUserRechargableEnergy
};
