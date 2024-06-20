import { db } from "../firebase/config";
import { toast } from "react-toastify";
import { doc, getDoc } from "firebase/firestore";

const handleGetUserData = async (userId) => {
    try {
        // ! Update to data.userId when user logged in
        const docRef = doc(db, "users", "Ij0QBrTicFT9LsAeWRNMJLCu7O32");
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
