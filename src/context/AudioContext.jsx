import React, { createContext, useRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);  // Audio element reference
  const location = useLocation(); // Get current route
  const [currentTrack, setCurrentTrack] = useState(null);  // Track currently playing
  const [isUserInteracted, setIsUserInteracted] = useState(false);  // Detect user interaction
  const [volume, setVolume] = useState(0.5);  // Default volume to 50%
  const [isMuted, setIsMuted] = useState(() => {
    // Load the initial mute state from localStorage (defaults to false)
    return localStorage.getItem('isMuted') === 'true';
  });

  // Function to start the audio once the user interacts with the document
  const handleUserInteraction = () => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;  // Set volume or mute
        audioRef.current.play().catch(error => {
          console.log("Autoplay prevented: ", error);
        });
      }
    }
  };

  // Function to toggle mute/unmute
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('isMuted', newMutedState);  // Persist mute state in localStorage

    if (audioRef.current) {
      if (newMutedState) {
        audioRef.current.pause();  // Pause the audio when muted
      } else {
        audioRef.current.volume = volume;  // Restore volume
        audioRef.current.play();  // Resume playback
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

    // Apply the mute state whenever the route or state changes
    audioRef.current.volume = isMuted ? 0 : volume;

    // Ensure audio is paused if muted
    if (isMuted) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.log("Error playing audio:", error);
      });
    }
  }, [location, currentTrack, volume, isMuted]);

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
    <AudioContext.Provider value={{ audioRef, volume, setVolume, isMuted, toggleMute }}>
      {children}
      <audio ref={audioRef} autoPlay loop />  {/* Autoplay and looping enabled */}
    </AudioContext.Provider>
  );
};
