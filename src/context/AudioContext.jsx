import React, { createContext, useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);  // Audio element reference
  const location = useLocation(); // Get current route
  const [currentTrack, setCurrentTrack] = useState(null);  // Track currently playing
  const [isUserInteracted, setIsUserInteracted] = useState(false);  // Detect user interaction
  const [volume, setVolume] = useState(0.5);  // Default volume to 25%

  // Function to start the audio once the user interacts with the document
  const handleUserInteraction = () => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
      if (audioRef.current) {
        audioRef.current.volume = volume;  // Set initial volume
        audioRef.current.play().catch(error => {
          console.log("Autoplay prevented: ", error);
        });
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    // Play the appropriate audio based on the route
    if (location.pathname === '/anitap') {
      if (currentTrack !== 'anitap') {
        setCurrentTrack('anitap');
        audioRef.current.src = "https://storage.animara.world/anitap_bg_audio.mp3";
      }
    } else {
      if (currentTrack !== 'dapp') {
        setCurrentTrack('dapp');
        audioRef.current.src = "https://storage.animara.world/dapp_bg_aud.mp3";
      }
    }

    // Set volume whenever it changes
    audioRef.current.volume = volume;
  }, [location, currentTrack, volume]);

  useEffect(() => {
    // Add event listeners for user interaction
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keypress', handleUserInteraction);

    return () => {
      // Clean up event listeners
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keypress', handleUserInteraction);
    };
  }, [isUserInteracted]);

  return (
    <AudioContext.Provider value={{ audioRef, volume, setVolume }}> {/* Provide volume control */}
      {children}
      <audio ref={audioRef} autoPlay loop />  {/* Autoplay and looping enabled */}
    </AudioContext.Provider>
  );
};