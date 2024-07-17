import { db } from "../firebase/firebaseConfig";
import { updateDoc, doc, collection, getDocs, increment } from "firebase/firestore";

const handleGetOneTimeTaskList = async () => {
    try {
        const taskListRef = collection(db, 'oneTimeTaskList');
        const querySnapshot = await getDocs(taskListRef);
        return querySnapshot.docs.map(doc => doc.data());
    }catch (error) {
        console.log("Error retrieving leaderboard: ", error)
    }
};

const handleUpdateCompletedTask = async (data) => {
    try {
        const taskRef = doc(db, "oneTimeTask", data.userId);
        const userRef = doc(db, "users", data.userId);

        await updateDoc(taskRef, { 
            completedTask: data.completedTask 
        });

        await updateDoc(userRef, { coins: increment(data.coins) });
    }catch (error) {
        console.log("Error setting completed task: ", error)
    }
};

export {
    handleUpdateCompletedTask,
    handleGetOneTimeTaskList
};