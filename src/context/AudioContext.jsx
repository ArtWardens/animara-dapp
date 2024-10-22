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
  const [wasPausedDueToVisibility, setWasPausedDueToVisibility] = useState(false);  // To track if muted by visibility

  // Function to start the audio once the user interacts with the document
  const handleUserInteraction = () => {
    if (!isUserInteracted) {
      setIsUserInteracted(true);
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : volume;  // Set volume or mute
        audioRef.current.play().catch(error => {
          console.log("Autoplay prevented or audio play error: ", error);
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
        audioRef.current.play().catch(error => {
          console.log("Error resuming audio after unmute:", error);
        });
      }
    }
  };

  // Handle tab visibility change for mobile/Safari
  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Mute the audio if the tab is hidden
      if (audioRef.current && !isMuted) {
        audioRef.current.pause();
        setWasPausedDueToVisibility(true);  // Track that we paused due to visibility
      }
    } else {
      // Unmute the audio if the tab is visible again and it was paused due to visibility
      if (audioRef.current && wasPausedDueToVisibility && !isMuted) {
        audioRef.current.play().catch(error => {
          console.log("Error playing audio after visibility change:", error);
        });
        setWasPausedDueToVisibility(false);  // Reset the flag
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;

    // Play the appropriate audio based on the route
    const playAudioTrack = () => {
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

      // Ensure audio plays if not muted
      audioRef.current.volume = isMuted ? 0 : volume;
      if (!isMuted) {
        audioRef.current.play().catch(error => {
          console.log("Error playing audio on route change:", error);
          retryAudioPlay();  // Attempt to retry audio if it fails to play
        });
      }
    };

    // Retry playing audio after a small delay in case of errors
    const retryAudioPlay = () => {
      setTimeout(() => {
        if (audioRef.current && !isMuted) {
          audioRef.current.play().catch(err => {
            console.log("Retry failed:", err);
          });
        }
      }, 1000); // Retry after 1 second
    };

    // Play audio on location change
    playAudioTrack();
  }, [location, currentTrack, volume, isMuted]);

  useEffect(() => {
    // Add event listeners for user interaction
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keypress', handleUserInteraction);

    // Add event listener for visibility change (to detect tab being hidden)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Clean up event listeners
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keypress', handleUserInteraction);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isUserInteracted, isMuted, wasPausedDueToVisibility]);

  return (
    <AudioContext.Provider value={{ audioRef, volume, setVolume, isMuted, toggleMute }}>
      {children}
      <audio ref={audioRef} autoPlay loop />
    </AudioContext.Provider>
  );
};
