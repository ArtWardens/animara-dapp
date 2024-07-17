import { auth, db, updateUserLastLogin } from "../firebase/firebaseConfig";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";

// functions that we export for saga
const handleGetUserData = async (userId) => {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        const completedTaskRef = doc(db, 'oneTimeTask', userId);
        const completedTaskSnap = await getDoc(completedTaskRef);

        if (docSnap.exists()) {
            return {
                ...docSnap.data(),
                completedTask: completedTaskSnap.exists() ? completedTaskSnap.data().completedTask : [],
            };
        } else {
            // docSnap.data() will be undefined in this case
            console.log('No such document!');
        }
    } catch (error) {
        console.log('Error getting user data: ', error);
    }
};


const handleUpdateUserLeaveTime = async () => {
    try {
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
        await updateDoc(docRef, { energyRechargable: data.count, clickByLevel: 0, isCompletedToday: false });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

const handleUpdateUserRechargableInvite = async (data) => {
    try {
        const docRef = doc(db, "users", data.userId);
        await updateDoc(docRef, { inviteRechargable: data.count, clickByLevel: 0, isCompletedToday: false });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

const handleUpdateDailyLogin = async (data) => {
    try {
      const docRef = doc(db, 'users', data.userId);
      updateDoc(docRef, { 
        loggedInToday: true, 
        coins: increment(data.coins),
        loginDays: increment(1),
      });
    } catch (error) {
      console.log('Error getting user data: ', error);
    }
  }

export {
    handleGetUserData,
    handleUpdateUserLeaveTime,
    handleUpdateUserRechargableEnergy,
    handleUpdateUserRechargableInvite,
    handleUpdateDailyLogin
};
