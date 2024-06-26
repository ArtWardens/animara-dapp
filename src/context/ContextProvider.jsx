"use client"
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useState, useContext, useEffect } from 'react';

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();

    useEffect(() => {
        const curntUser = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);
        });
        return () => curntUser;
      }, []);
 
  return (
    <GlobalContext.Provider value={{ 
        currentUser, 
        setCurrentUser
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => useContext(GlobalContext);
