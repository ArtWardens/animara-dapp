import { db } from "../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import moment from 'moment';
import { toast } from "react-toastify";

export const fetchAllDatesImpl = async () => {
    try {
        const collectionRef = collection(db, "dateConfig");
        const querySnapshot = await getDocs(collectionRef);
        const datesMap = {};

        querySnapshot.forEach((doc) => {
            if (doc.exists()) {
                const date = doc.data().dateTime.toDate();
                datesMap[doc.id] = date;
            } else {
                toast.error(`No date found for document with ID ${doc.id}`);
            }
        });

        return datesMap;
    } catch (error) {
        console.error("Error fetching dates:", error);
        throw error;
    }
};

export const startCountdown = (targetDate, setTimeLeft, setIsContainerVisible) => {
    const countdownDate = moment(targetDate);
    const timer = setInterval(() => {
        const now = moment();
        const duration = moment.duration(countdownDate.diff(now));
        const days = String(Math.floor(duration.asDays())).padStart(2, '0');
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
