import { auth, db, completeOneTimeTask } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

const handleGetOneTimeTaskList = async () => {
    try {
        const taskListRef = collection(db, 'oneTimeTaskList');
        const querySnapshot = await getDocs(taskListRef);
        return querySnapshot.docs.map(doc => doc.data());
    }catch (error) {
        console.log("Error retrieving leaderboard: ", error)
    }
};

const handleCompletedOneTimeTask = async (taskId) => {
    try {
        const idToken = await auth.currentUser.getIdToken(/* forceRefresh */ false);
        const { data } = await completeOneTimeTask({idToken: idToken, taskId: taskId});
        return data;
    }catch (error) {
        console.log("Error setting completed task: ", error)
    }
};

export {
    handleCompletedOneTimeTask,
    handleGetOneTimeTaskList
};