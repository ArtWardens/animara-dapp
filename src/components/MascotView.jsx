import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
import useSound from 'use-sound';
import { PropagateLoader } from 'react-spinners';
import { useAppDispatch } from '../hooks/storeHooks.js';
import {
  useUserDetails,
  useLocalStamina,
  useLocalCoins,
  useSettleTapSessionLoading,
  consumeStamina,
  settleTapSession,
  useRechargeLoading,
  useUserDetailsLoading,
  useDailyLoginLoading,
} from '../sagaStore/slices';
import { getAllImagePaths } from '../utils/getImagePath';
import { mascots } from '../utils/constants';

const MascotView = ({ openModal, setOpenModal }) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const localCoins = useLocalCoins();
  const localStamina = useLocalStamina();
  const rechargingStamina = useRechargeLoading();
  const settlingTapSession = useSettleTapSessionLoading();
  const userDetailsLoading = useUserDetailsLoading();
  const dailyLoginLoading = useDailyLoginLoading();
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
    }, 50);

    const interactivityTimer = setTimeout(() => {
      setIsInteractive(true);
    }, 1000); // Adjust this delay to match the duration of your transitions

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(interactivityTimer);
    };
  }, []);

  // Initial setup for loading images and user-specific data
  useEffect(() => {
    if (isInitialized) return;
    if (!currentUser) return;

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
    if (!currentUser) return;
    const handleMouseLeave = (event) => {
      if (
        event.clientY <= 0 &&
        !settlingTapSession &&
        (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)
      ) {
        dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'hidden' &&
        (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)
      ) {
        dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // remember that we have initialized
    setIsInitialized(true);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, currentUser, localCoins, localStamina, settlingTapSession]);

  // periodic tap session settler
  const setupSettler = useCallback(() => {
    if (!currentUser) return;
    // skip setup settler if already present
    if (periodicSettlerTimerRef.current) {
      return;
    }

    // try to settle tap session if there are any changes
    if (!settlingTapSession && (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)) {
      dispatch(
        settleTapSession({
          newCointAmt: localCoins,
          newStamina: localStamina,
        }),
      );
    }

    // re-setup a timer to repeat this set
    clearInterval(periodicSettlerTimerRef.current);
    periodicSettlerTimerRef.current = setInterval(() => {
      periodicSettlerTimerRef.current = null;
    }, tapSessionSettleInterval);
  }, [settlingTapSession, localCoins, localStamina, currentUser, dispatch]);

  // tap handlers
  const handleTap = useCallback(() => {
    if (!isInteractive) return;

    if (localStamina === 0 && openModal !== 'boosts' && !isOpenRewardModal) {
      setOpenModal('boosts');
      return;
    }

    setImgIndex((prevIndex) => (prevIndex === 0 ? 1 : prevIndex === 1 ? 2 : 1));

    // kickstart idle timer
    const restartIdleTimer = () => {
      // reset timer whenever we call this
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      // set a timer to reset mascot after no action for a duration
      idleTimerRef.current = setTimeout(() => {
        setImgIndex(0);
        clearInterval(periodicSettlerTimerRef.current);
        periodicSettlerTimerRef.current = null;
        // Note: if reward modal is opened, then skip idle handling
        // because usually we are waiting for server to update back depletion rewards
        if (
          !settlingTapSession &&
          !isOpenRewardModal &&
          (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)
        ) {
          dispatch(
            settleTapSession({
              newCointAmt: localCoins,
              newStamina: localStamina,
            }),
          );
        }
      }, idleTimeoutDuration);
    };
    restartIdleTimer();
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
  }, [
    dispatch,
    currentUser,
    localStamina,
    isInteractive,
    isOpenRewardModal,
    mascotSound,
    localCoins,
    openModal,
    setOpenModal,
    settlingTapSession,
    setupSettler,
  ]);

  // grant depletion rewards when local stamina is fully consumed
  useEffect(() => {
    if (!currentUser || localStamina !== 0 || isOpenRewardModal || !currentUser.canGetDepletionReward) return;

    dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
    setIsOpenRewardModal(true);
  }, [dispatch, localStamina, localCoins, currentUser, isOpenRewardModal]);

  useEffect(() => {
    if (!rechargingStamina) {
      return;
    }
    clearInterval(periodicSettlerTimerRef.current);
    periodicSettlerTimerRef.current = null;
  }, [rechargingStamina]);

  const closeRewardModal = () => {
    setRewardModalFading(true);
    setTimeout(() => {
      setIsOpenRewardModal(false);
      setRewardModalFading(false);
    }, 500);
  };

  return (
    <div
      className={`flex justify-center items-start h-full w-screen transition-all duration-700 mt-[-4rem] xl:mt-[-8rem]
      ${startSlide ? 'translate-y-0' : 'translate-y-full'}`}
    >

      <div
        className="flex w-full h-full rounded-2xl"
        onClick={handleTap}
      >
        {userDetailsLoading || dailyLoginLoading ? (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <PropagateLoader color={'#FFB23F'} />
          </div>
        ) : (
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
                className={`transition-transform duration-1000 overflow-visible flex justify-center 
                  ${startSlide ? 'translate-y-0' : 'translate-y-full'}
                `}
              >
                <img
                  src={src}
                  alt={`Game mascot ${index}`}
                  className={`transition-opacity max-h-[45dvh] xs:max-h-[60dvh] xl:max-h-[60dvh] h-full w-full
                    ${imgIndex === index ? 'block' : 'hidden'}
                  `}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpenRewardModal && (
        <div
          className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90 transition-opacity duration-500 ${rewardModalFading ? 'opacity-0' : 'opacity-100'}`}
          style={{
            zIndex: 100,
          }}
        >
          <video
            src="https://storage.animara.world/depletion-reward-w-number.webm"
            autoPlay
            loop={false}
            muted
            playsInline
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
