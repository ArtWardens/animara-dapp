import { db } from "./firebaseConfig";
import { query, orderBy, limit, collection, getDocs } from "firebase/firestore";

const handleGetLeaderboard = async (date) => {
    // Pass current date with format of 2024_06_26
    // Cronjob will create and insert data
    try {
        const usersRef = collection(db, `mascot_${date}`);
        const q = query(usersRef, orderBy("coins", "desc"), limit(30));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => doc.data());

    }catch (error) {
        console.log("Error retrieving leaderboard: ", error)
    }
};

export {
    handleGetLeaderboard,
};