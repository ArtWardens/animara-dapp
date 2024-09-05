import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import useSound from 'use-sound';
import { useAppDispatch } from '../hooks/storeHooks.js';
import {
  useUserDetails,
  useLocalStamina,
  useLocalCoins,
  useSettleTapSessionLoading,
  consumeStamina,
  settleTapSession,
} from '../sagaStore/slices';
import { getAllImagePaths } from '../utils/getImagePath';
import { mascots } from '../utils/constants';

const MascotView = ({ openModal, setOpenModal }) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const localCoins = useLocalCoins();
  const localStamina = useLocalStamina();
  const settlingTapSession = useSettleTapSessionLoading();
  const [isInitialized, setIsInitialized] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const [mascotImages, setMascotImages] = useState([]);
  const [plusOneEffect, setPlusOneEffect] = useState({ show: false, left: 0, top: 0 });
  const [currentMascot, setCurrentMascot] = useState(mascots[0]);
  const [mascotSound] = useSound(currentMascot?.sound);
  const [isOpenRewardModal, setIsOpenRewardModal] = useState(false);
  const [rewardModalFading, setRewardModalFading] = useState(false);
  const [startSlide, setStartSlide] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const idleTimerRef = useRef(null);
  const periodicSettlerTimerRef = useRef(null);
  const plusOneTimerRef = useRef(null);

  const tapSessionSettleInterval = 5000;
  const idleTimeoutDuration = 1500;

  // Intro animation and interactivity setup
  useEffect(() => {
    const slideTimer = setTimeout(() => {
      setStartSlide(true);
    }, 1000);

    const interactivityTimer = setTimeout(() => {
      setIsInteractive(true);
    }, 2000);

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(interactivityTimer);
    };
  }, []);

  // Initial setup for loading images and user-specific data
  useEffect(() => {
    if (isInitialized) return;

    // Determine current mascot based on the user's level
    const mascotIndex = mascots.findIndex((mascot) => (currentUser?.level || 0) <= mascot.maxLevel);
    setCurrentMascot(mascots[mascotIndex]);

    // Preload images for smoother transitions
    const images = getAllImagePaths(currentUser);
    const preloadedImages = images.map((src) => {
      const img = new Image();
      img.src = src; // Preload the image
      return src;
    });

    setMascotImages(preloadedImages); // Set preloaded images

    setIsInitialized(true);
  }, [dispatch, currentUser, isInitialized]);

  // Handle tap session settling when leaving or closing the window
  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (event.clientY <= 0 && !settlingTapSession && (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)) {
        dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)) {
        dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, currentUser, localCoins, localStamina, settlingTapSession]);

  // Tap handler
  const handleTap = useCallback(() => {
    if (!isInteractive) return;

    if (localStamina === 0 && openModal !== 'boosts' && !isOpenRewardModal) {
      setOpenModal('boosts');
      return;
    }

    setImgIndex((prevIndex) => (prevIndex === 0 ? 1 : prevIndex === 1 ? 2 : 1));

    // Reset idle timer to avoid auto-resets while interacting
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      setImgIndex(0); // Reset to `initial` after idle time
    }, idleTimeoutDuration);

    // Handle periodic settler setup
    if (!periodicSettlerTimerRef.current) {
      setupSettler();
    }

    // Dispatch action to consume stamina and play sound
    dispatch(consumeStamina({ staminaToConsume: 1, coinToGain: 1 }));
    mascotSound();

    // Display the floating +1 effect
    const randomLeft = Math.random() * 70 + 15;
    const randomTop = Math.random() * 50 + 5;
    setPlusOneEffect({ show: false, left: randomLeft, top: randomTop });

    setTimeout(() => setPlusOneEffect({ show: true, left: randomLeft, top: randomTop }), 0);

    if (plusOneTimerRef.current) {
      clearTimeout(plusOneTimerRef.current);
    }
    plusOneTimerRef.current = setTimeout(() => setPlusOneEffect({ show: false, left: 0, top: 0 }), 500);
  }, [dispatch, currentUser, localStamina, isInteractive, isOpenRewardModal, mascotSound]);

  // Settler setup
  const setupSettler = useCallback(() => {
    if (periodicSettlerTimerRef.current) return;

    if (!settlingTapSession && (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)) {
      dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
    }

    periodicSettlerTimerRef.current = setInterval(() => {
      periodicSettlerTimerRef.current = null;
    }, tapSessionSettleInterval);
  }, [dispatch, currentUser, localCoins, localStamina, settlingTapSession]);

  // Handle rewards and modals when stamina is updated
  useEffect(() => {
    if (!currentUser || localStamina !== 0 || isOpenRewardModal || !currentUser.canGetDepletionReward) return;

    dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
    setIsOpenRewardModal(true);
  }, [dispatch, localStamina, localCoins, currentUser, isOpenRewardModal]);

  // Close reward modal
  const closeRewardModal = () => {
    setRewardModalFading(true);
    setTimeout(() => {
      setIsOpenRewardModal(false);
      setRewardModalFading(false);
    }, 500);
  };

  return (
    <div className="flex justify-center items-end h-screen w-screen xl:pb-16">
      <div
        onMouseDown={handleTap}
        className="cursor-pointer w-full xl:w-5/6 h-4/5 rounded-3xl p-3"
        style={{
          border: '2px solid var(--Color, #F4FBFF)',
          background: 'rgba(155, 231, 255, 0.58)',
          boxShadow: '0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <div className="absolute flex w-full justify-between -top-9">
          <img
            src={'/assets/images/clicker-character/ring01.webp'}
            alt="ring"
            className="object-cover w-12 absolute left-2"
          />
          <img
            src={'/assets/images/clicker-character/ring01.webp'}
            alt="ring"
            className="object-cover w-12 opacity-0"
          />
          <img
            src={'/assets/images/clicker-character/ring01.webp'}
            alt="ring"
            className="object-cover w-12 opacity-0"
          />
          <img
            src={'/assets/images/clicker-character/ring02.webp'}
            alt="ring"
            className="object-cover w-12 absolute right-8"
          />
        </div>

        <div className="flex w-full h-full rounded-2xl" style={{ backgroundImage: 'url("/assets/images/clicker-character/mascotBg.webp")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
          <div className="flex justify-center items-center place-content-center h-full w-full">
            {/* Plus One Effect */}
            {plusOneEffect.show && (
              <img
                src={'/assets/images/clicker-character/plusOne.webp'}
                alt="+1"
                className="absolute w-40 h-40 animate-fadeInOut z-10"
                style={{ left: `${plusOneEffect.left}%`, top: `${plusOneEffect.top}%` }}
              />
            )}

            {/* Preloaded Mascot Images */}
            {mascotImages.map((src, index) => (
              <div
                key={index}
                className={`absolute bottom-[12rem] xl:bottom-20 transition-transform duration-1000 overflow-visible flex justify-center
                  ${startSlide ? 'translate-y-0' : 'translate-y-full'}
                `}
              >
                <img
                  src={src}
                  alt={`Game mascot ${index}`}
                  className={`transition-opacity w-full xl:w-3/4
                    ${imgIndex === index ? 'block' : 'hidden'}
                  `}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpenRewardModal && (
        <div
          className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90 transition-opacity duration-500 ${rewardModalFading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            zIndex: 100,
          }}
        >
          <video
            src="/assets/images/clicker-character/depletion-rewardBox.webm"
            autoPlay
            loop={false}
            muted
            onEnded={closeRewardModal}
            className="absolute inset-0 object-cover w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

MascotView.propTypes = {
  openModal: PropTypes.string,
  setOpenModal: PropTypes.func,
};

export default MascotView;
