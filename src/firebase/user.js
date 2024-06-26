import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

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

export {
    handleGetUserData,
};
