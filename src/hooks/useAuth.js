import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useLocation } from "react-router-dom";

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setIsLoggedIn(true);
        setLoading(true);

        // Query Firestore to retrieve the user object
        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error("No such user document!");
          setUser(null);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [location]);

  return { isLoggedIn, loading, user };
};

export default useAuth;
