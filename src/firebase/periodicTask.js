import { auth, checkUserLastPeriodicBatchTime } from './firebaseConfig';

// Call this on login or every 12 noon
const handleCheckUserLastPeriodicBatchTime = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken(false);
    const { data } = await checkUserLastPeriodicBatchTime({ idToken: idToken });
    return data;
  } catch (error) {
    console.log('Error checking user details: ', error);
  }
};

export { handleCheckUserLastPeriodicBatchTime };
