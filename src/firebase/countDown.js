import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import moment from 'moment';
import { toast } from "react-toastify";

export const fetchDate = async (documentName) => {
    try {
        const docRef = doc(db, "dateConfig", documentName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().dateTime.toDate();
        } else {
            toast.error(`No date found for ${documentName}`);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching date for ${documentName}:`, error);
        toast.error(`Failed to fetch date for ${documentName}`);
        return null;
    }
};

export const startCountdown = (targetDate, setTimeLeft, setIsContainerVisible) => {
    const countdownDate = moment(targetDate);
    const timer = setInterval(() => {
        const now = moment();
        const duration = moment.duration(countdownDate.diff(now));

        const days = String(duration.days()).padStart(2, '0');
        const hours = String(duration.hours()).padStart(2, '0');
        const minutes = String(duration.minutes()).padStart(2, '0');
        const seconds = String(duration.seconds()).padStart(2, '0');

        if (duration.asMilliseconds() <= 0) {
            clearInterval(timer);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            setIsContainerVisible(false);
        } else {
            setTimeLeft({ days, hours, minutes, seconds });
        }
    }, 1000);

    return () => clearInterval(timer);
};
