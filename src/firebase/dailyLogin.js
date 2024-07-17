import { db } from "../firebase/firebaseConfig";
import { updateDoc, doc, increment } from "firebase/firestore";

const handleUpdateLoginRewards = async (data) => {
    // * Param: userId, coins (Int)
    try {
        const docRef = doc(db, "users", data.userId);
        await updateDoc(docRef, { loggedInToday: true, coins: increment(data.coins) });
    }catch (error) {
        console.log("Error setting user data: ", error)
    }
};

export {
    handleUpdateLoginRewards,
};