import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PropTypes } from 'prop-types';
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

const MascotView = ({ setOpenModal }) => {
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
  const [startSlide, setStartSlide] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const idleTimerRef = useRef(null);
  const periodicSettlerTimerRef = useRef(null);
  const tapSessionSettleInterval = 5000;
  const idleTimeoutDuration = 1500;
  const [plusOneEffects, setPlusOneEffects] = useState([]);

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

  useEffect(() => {
    if (isInitialized && !currentUser) return;

    const images = getAllImagePaths(currentUser);
    const preloadedImages = images.map((src) => {
      const img = new Image();
      img.src = src;
      return src;
    });

    setMascotImages(preloadedImages);
    setIsInitialized(true);
  }, [dispatch, currentUser, isInitialized]);

  useEffect(() => {
    if (localStamina > 0) {
      setOpenModal(''); // Reset the modal state so it can be retriggered
    }
  }, [localStamina, setOpenModal]);

  useEffect(() => {
    if (!currentUser) return;
    const handleMouseLeave = (event) => {
      if (
        event.clientY <= 0 &&
        !settlingTapSession &&
        (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)
      ) {
        // console.log("mouse leave dispatch");
        dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina, from: "mouseleave" }));
      }
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'hidden' &&
        (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)
      ) {
        // console.log("handleVisibilityChange dispatch");
        dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina, from: "handleVisibilityChange" }));
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    setIsInitialized(true);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, currentUser, localCoins, localStamina, settlingTapSession]);

  const setupSettler = useCallback(() => {
    if (!currentUser) return;
    if (periodicSettlerTimerRef.current) return;

    if (!settlingTapSession && (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)) {
      // console.log("setupSettler dispatch");
      // console.log("stamina: ", currentUser?.stamina);
      // console.log("localStamina stamina: ", localStamina);
      dispatch(
        settleTapSession({
          newCointAmt: localCoins,
          newStamina: localStamina,
          from: "setupSettler",
        }),
      );
    }

    clearInterval(periodicSettlerTimerRef.current);
    periodicSettlerTimerRef.current = setInterval(() => {
      periodicSettlerTimerRef.current = null;
    }, tapSessionSettleInterval);
  }, [settlingTapSession, localCoins, localStamina, currentUser, dispatch]);

  const restartIdleTimer = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setImgIndex(0);
      clearInterval(periodicSettlerTimerRef.current);
      periodicSettlerTimerRef.current = null;
      if (!settlingTapSession && (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)) {
        // console.log("restartIdleTimer dispatch");
        dispatch(
          settleTapSession({
            newCointAmt: localCoins,
            newStamina: localStamina,
            from: "restart",
          }),
        );
      }
    }, idleTimeoutDuration);
  };

  const handleTap = useCallback((event) => {
    if (!isInteractive) return;
    if (localStamina <= 0 && currentUser.stamina === 0 && !currentUser.canGetDepletionReward) {
      setOpenModal('boosts');
      console.log('open boost');
      return;
    }

    setImgIndex(prevIndex => (prevIndex + 1) % mascotImages.length);

    const clickLeft = event.clientX;
    const clickTop = event.clientY;
    
    const headerElement = document.getElementById("header-coins");
    const headerRect = headerElement?.getBoundingClientRect();

    const newEffectId = Date.now();

    setPlusOneEffects((prevEffects) => [
      ...prevEffects,
      { id: newEffectId, left: clickLeft, top: clickTop, fadeOut: false, targetLeft: headerRect.left - clickLeft, targetTop: headerRect.top - clickTop - 300 }
    ]);

    setTimeout(() => {
      setPlusOneEffects((prevEffects) =>
        prevEffects.map((effect) =>
          effect.id === newEffectId ? { ...effect, fadeOut: true } : effect
        )
      );
    }, 500);

    setTimeout(() => {
      setPlusOneEffects((prevEffects) =>
        prevEffects.filter((effect) => effect.id !== newEffectId)
      );
    }, 1500);

    restartIdleTimer();
    if (!periodicSettlerTimerRef.current) {
      setupSettler();
    }

    dispatch(consumeStamina({ staminaToConsume: 1, coinToGain: 1 }));

  }, [dispatch, isInteractive, localStamina, mascotImages.length, setupSettler]);

  useEffect(() => {
    if (!rechargingStamina) return;
    clearInterval(periodicSettlerTimerRef.current);
    periodicSettlerTimerRef.current = null;
  }, [rechargingStamina]);

  return (
    <div
      className={`flex justify-center items-start h-full w-screen transition-all duration-700 lg:mt-[-12rem]
      ${startSlide ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <div
        className="flex w-full h-full rounded-2xl z-100"
        onClick={handleTap}
      >
        {userDetailsLoading || dailyLoginLoading ? (
          <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full">
            <PropagateLoader color={'#FFB23F'} />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full place-content-center">
            {/* Plus One Effect */}
            {plusOneEffects.map((effect) => (
              <img
                key={effect.id}
                src={'/assets/images/clicker-character/plusOne.webp'}
                alt="+1"
                draggable="false"
                className="absolute z-10 w-28 h-28 lg:w-40 lg:h-40"
                style={{
                  left: `${effect.left}px`,
                  top: `${effect.top}px`,
                  transition: 'transform 0.3s ease, opacity 0.5s ease 0.1s',
                  opacity: effect.fadeOut ? 0 : 1,
                  transform: effect.fadeOut ? `translate(${effect.targetLeft}px, ${effect.targetTop}px) scale(.25)` : 'translate(-60%, -200%) scale(1)',
                }}
              />
            ))}

            {/* Preloaded Mascot Images */}
            {mascotImages.map((src, index) => (
              <div
                key={index}
                className={`transition-transform duration-1000 overflow-visible flex justify-center 
                  ${startSlide ? 'translate-y-0' : 'translate-y-full'}`}
              >
                <img
                  src={src}
                  draggable="false"
                  alt={`Game mascot ${index}`}
                  className={`transition-opacity lg:max-h-[60dvh] h-full w-full scale-[150%] md:scale-[100%] lg:scale-[125%] mt-[-1rem] xs:mt-[-5rem] lg:mt-[-8rem]
                    ${imgIndex === index ? 'block' : 'hidden'}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

MascotView.propTypes = {
  openModal: PropTypes.string.isRequired,
  setOpenModal: PropTypes.func.isRequired,
};

export default MascotView;
