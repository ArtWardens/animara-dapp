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
  const [showWord, setShowWord] = useState(false); // State to manage word display after 2.5 seconds
  const [showCongratulations, setShowCongratulations] = useState(false); // Manage "Congratulations" visibility
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
    }, 1000);

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

    setMascotImages(preloadedImages);

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

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, currentUser, localCoins, localStamina, settlingTapSession]);

  // periodic tap session settler
  const setupSettler = useCallback(() => {
    if (!currentUser) return;
    if (periodicSettlerTimerRef.current) return;

    if (!settlingTapSession && (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)) {
      dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
    }

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

    const restartIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      idleTimerRef.current = setTimeout(() => {
        setImgIndex(0);
        clearInterval(periodicSettlerTimerRef.current);
        periodicSettlerTimerRef.current = null;

        if (!settlingTapSession && !isOpenRewardModal && (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)) {
          dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
        }
      }, idleTimeoutDuration);
    };

    restartIdleTimer();
    if (!periodicSettlerTimerRef.current) setupSettler();

    dispatch(consumeStamina({ staminaToConsume: 1, coinToGain: 1 }));
    mascotSound();

    const randomLeft = Math.random() * 70 + 15;
    const randomTop = Math.random() * 50 + 5;
    setPlusOneEffect({ show: false, left: randomLeft, top: randomTop });

    setTimeout(() => setPlusOneEffect({ show: true, left: randomLeft, top: randomTop }), 0);

    if (plusOneTimerRef.current) clearTimeout(plusOneTimerRef.current);
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
    if (!rechargingStamina) return;
    clearInterval(periodicSettlerTimerRef.current);
    periodicSettlerTimerRef.current = null;
  }, [rechargingStamina]);

  // Reward modal close handler
  const closeRewardModal = () => {
    setRewardModalFading(true);
    setTimeout(() => {
      setIsOpenRewardModal(false);
      setRewardModalFading(false);
      setShowWord(false);
      setShowCongratulations(false);
    }, 500);
  };

  const handleVideoPlay = () => {
    setTimeout(() => {
      setShowWord(true);
      setTimeout(() => {
        setShowWord(false);
      }, 3000);
    }, 2500);

    if (currentUser?.ownsNFT) {
      setTimeout(() => {
        setShowCongratulations(true);
        setTimeout(() => {
          setShowCongratulations(false);
        }, 3300);
      }, 7750);
    }
  };

  const videoSource = currentUser?.ownsNFT ? '/assets/images/boxCoin_full.webm' : '/assets/images/boxCoin_normal.webm';

  return (
    <div
      className={`flex justify-center items-end h-screen w-screen xl:pb-16 transition-all duration-700
      ${startSlide ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div
        className=" w-full xl:w-5/6 h-4/5 rounded-3xl p-3"
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

        <div
          className="flex w-full h-full rounded-2xl"
          onClick={handleTap}
          style={{
            backgroundImage: 'url("/assets/images/clicker-character/mascotBg.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
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
                  className={`absolute bottom-[12rem] xl:bottom-32 transition-transform duration-1000 overflow-visible flex justify-center
                    ${startSlide ? 'translate-y-0' : 'translate-y-full'}`}
                >
                  <img
                    src={src}
                    alt={`Game mascot ${index}`}
                    className={`transition-opacity min-w-[50rem] w-3/4 xl:w-3/4 mb-[-4rem] xl:mb-0
                      ${imgIndex === index ? 'block' : 'hidden'}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOpenRewardModal && (
        <div
          className={`fixed top-0 flex h-full w-full items-center justify-center bg-dark/90 transition-opacity duration-500 ${rewardModalFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <video
            src={videoSource} // Dynamically select the video based on currentUser.ownsNFT
            autoPlay
            loop={false}
            muted
            playsInline
            onEnded={closeRewardModal}
            onPlay={handleVideoPlay}
            className="absolute object-cover object-center w-full lg:w-auto h-auto lg:h-full"
          />

          <div
            className={`absolute text-[18vh] font-bold transition-all duration-1000 transform text-amber-500 tracking-normal
            ${showWord ? 'opacity-100 scale-150 pb-20 translate-x-0' : 'opacity-0 scale-0 pb-0 translate-x-6'}`}
            style={{
              WebkitTextStrokeWidth: '0.45vh',
              WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
            }}
          >
            +{currentUser.depletionReward}
          </div>

          <div
            className={`absolute text-[12vh] font-bold transition-all duration-1000 transform text-amber-500 tracking-normal
            ${showCongratulations ? 'opacity-100 scale-150 pb-20 translate-x-0' : 'opacity-0 scale-0 pb-0 translate-x-6'}`}
            style={{
              WebkitTextStrokeWidth: '0.45vh',
              WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
            }}
          >
            1.1X
            <p
              className="absolute text-[8vh] font-bold transition-all duration-1000 transform text-amber-500 tracking-normal"
              style={{
                WebkitTextStrokeWidth: '0.25vh',
                WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
              }}
            >
              
            </p>
          </div>
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
