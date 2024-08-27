import React, { useEffect, useRef, useState, useCallback } from "react";
import { PropTypes } from "prop-types";
import useSound from "use-sound";
import { useAppDispatch } from "../hooks/storeHooks.js";
import { useUserDetails, useLocalStamina, useLocalCoins, useSettleTapSessionLoading, consumeStamina, settleTapSession } from "../sagaStore/slices";
import { getAllImagePaths } from "../utils/getImagePath";
import { mascots } from '../utils/constants';

const MascotView = ({
  openModal,
  setOpenModal
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const localCoins = useLocalCoins();
  const localStamina = useLocalStamina();
  const settlingTapSession = useSettleTapSessionLoading();
  const [isIinitialized, setIsIinitialized] = useState(false);
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
  
  // intro anim
  useEffect(() => {
    const slideTimer = setTimeout(() => {
      setStartSlide(true);
    }, 1000);

    const interactivityTimer = setTimeout(() => {
      setIsInteractive(true);
    }, 2000); // Adjust this delay to match the duration of your transitions

    return () => {
      clearTimeout(slideTimer);
      clearTimeout(interactivityTimer);
    };
  }, []);

  // initial setup
  useEffect(() => {
    //  skip init if already done once
    if (isIinitialized){ return; }

    // set mascot
    const mascotIndex = mascots.filter((mascot)=> (currentUser?.level || 0) <= mascot.maxLevel);
    setCurrentMascot(mascots[mascotIndex]);

    // preload images if enter on the first time
    setMascotImages(getAllImagePaths(currentUser));

    // set intial image
    setImgIndex(0);

    // Note: setup various conditions in which we attempt to
    // settle a tap session
    // we settle tap session by session to prevent backend overload
    // Condition 1: when user's moves away from browser
    const handleMouseLeave = (event) => {
      if (event.clientY <= 0) {
        if (!settlingTapSession && (currentUser.coins !== localCoins || currentUser.stamina !== localStamina)){
          dispatch(settleTapSession({
            newCointAmt: localCoins,
            newStamina: localStamina,
          }));
        }
      }
    };

    // Condition 2: when user closes browser
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        if (currentUser.coins !== localCoins || currentUser.stamina !== localStamina){
          dispatch(settleTapSession({
            newCointAmt: localCoins,
            newStamina: localStamina,
          }));
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);
 
    // remember that we have initialized
    setIsIinitialized(true);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dispatch, currentUser, localCoins, localStamina, isIinitialized, settlingTapSession]);

  // periodic tap session settler
  const setupSettler = useCallback(() =>{
    // skip setup settler if already present
    if (periodicSettlerTimerRef.current){ return; }

    // try to settle tap session if there are any changes
    if (!settlingTapSession && (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)){
      dispatch(settleTapSession({
        newCointAmt: localCoins,
        newStamina: localStamina,
      }));
    }

    // set a timer to repeat this set
    clearInterval(periodicSettlerTimerRef.current);
    periodicSettlerTimerRef.current = setInterval(() => {
      periodicSettlerTimerRef.current = null;
    }, tapSessionSettleInterval);
  }, [settlingTapSession, localCoins, localStamina, currentUser, dispatch]);

  // tap handlers
  const handleTap = useCallback(
    () => {
      // skip if not interactive
      if (!isInteractive) return;
  
      // skip if stamina too low
      if (localStamina === 0 && openModal !== 'boosts' && isOpenRewardModal === false){
        // skip and show boost modal if out of stamina
        setOpenModal("boosts");
        return;
      }
  
      // has stamina to click, change picture
      setImgIndex(((currentUser.maxStamina - localStamina) % 2) + 1);
      
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
          if (!settlingTapSession && !isOpenRewardModal && (currentUser?.coins !== localCoins || currentUser?.stamina !== localStamina)){
            dispatch(settleTapSession({
              newCointAmt: localCoins,
              newStamina: localStamina,
            }));
          }
        }, idleTimeoutDuration);
      };
      restartIdleTimer();
      if (!periodicSettlerTimerRef.current){
        setupSettler();
      }
  
      // proceed with click
      dispatch(consumeStamina({
        staminaToConsume: 1,
        coinToGain: 1
      }));
  
      // play sfx
      mascotSound();
  
      // show floating number
      const randomLeft = Math.random() * 70 + 15;
      const randomTop = Math.random() * 50 + 5; // Adjusted range to appear higher
      setPlusOneEffect({ show: false, left: randomLeft, top: randomTop });
  
      setTimeout(() => {
        setPlusOneEffect({ show: true, left: randomLeft, top: randomTop });
      }, 0);
  
      if (plusOneTimerRef.current) {
        clearTimeout(plusOneTimerRef.current);
      }
      plusOneTimerRef.current = setTimeout(() => {
        setPlusOneEffect({ show: false, left: 0, top: 0 });
      }, 500);
  },[dispatch, currentUser, settlingTapSession, isInteractive, isOpenRewardModal, localCoins, localStamina, mascotSound, openModal, setOpenModal, setupSettler]);
  
  const handleTapUp = () => { };

  // grant depletion rewards when local stamina is updated
  useEffect(() => {
    // skip if user not initialized yet
    if (!currentUser){ return; }

    // check if we should grant depletion reward
    const shouldGrantDepletionReward = localStamina === 0;
    if (!shouldGrantDepletionReward || isOpenRewardModal || !currentUser?.canGetDepletionReward) { return; }

    // settle tap session when stamina is depleted
    // Note: server side will auto grant depletion reward
    dispatch(settleTapSession({
      newCointAmt: localCoins,
      newStamina: localStamina,
    }));

    // show reward popup
    setIsOpenRewardModal(true);
  }, [dispatch, localStamina, localCoins, currentUser, isOpenRewardModal, setIsOpenRewardModal]);

  const closeRewardModal = () => {
    setRewardModalFading(true);
    setTimeout(() => {
      setIsOpenRewardModal(false);
      setRewardModalFading(false);
    }, 500);
  };

  return (
    <div
      className="flex justify-center items-end h-screen w-screen xl:pb-16"
    >
      <div
        onMouseDown={handleTap}
        onMouseUp={handleTapUp}
        onMouseLeave={handleTapUp}
        className={`cursor-pointer w-full xl:w-5/6 h-4/5 rounded-3xl p-3 `}
        style={{
          border: '2px solid var(--Color, #F4FBFF)',
          background: 'rgba(155, 231, 255, 0.58)',
          boxShadow: '0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <div 
          className="absolute flex w-full justify-between -top-9"
        >
          <img
            src={"/assets/images/clicker-character/ring01.png"}
            alt="ring"
            className="object-cover w-12 absolute left-2"
          />
          <img
            src={"/assets/images/clicker-character/ring01.png"}
            alt="ring"
            className="object-cover w-12 opacity-0"
          />
          <img
            src={"/assets/images/clicker-character/ring02.png"}
            alt="ring"
            className="object-cover w-12 absolute right-8"
          />
        </div>
        <div
          className="flex w-full h-full rounded-2xl"
          style={{
            backgroundImage: 'url("/assets/images/clicker-character/mascotBg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="flex justify-center items-center h-full w-full">
            {plusOneEffect.show && (
              <img
                src={"/assets/images/clicker-character/plusOne.png"}
                alt="+1"
                className="absolute w-40 h-40 animate-fadeInOut z-10"
                style={{ left: `${plusOneEffect.left}%`, top: `${plusOneEffect.top}%` }}
              />
            )}
            {imgIndex === 0 ?
              <img
                src={mascotImages[0]}
                alt="Game mascot"
                className={`absolute w-full xl:w-3/4 bottom-[12rem] xl:bottom-20 transition-transform duration-1000 overflow-visible ${
                  startSlide ? 'translate-y-0' : 'translate-y-full'
                }`}
              />
            : imgIndex === 1 ?
              <img
                src={mascotImages[1]}
                alt="Game mascot"
                className={`absolute w-full xl:w-3/4 bottom-[12rem] xl:bottom-20 transition-transform duration-1000 ${
                  startSlide ? 'translate-y-0' : 'translate-y-full'
                }`}
              />
            : 
              <img
                src={mascotImages[2]}
                alt="Game mascot"
                className={`absolute w-full xl:w-3/4 bottom-[12rem] xl:bottom-20 transition-transform duration-1000 ${
                  startSlide ? 'translate-y-0' : 'translate-y-full'
                }`}
              />
            }
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
            className={`absolute inset-0 object-cover w-full h-full`}
          />

        </div>
      )}

    </div>
  );
};

MascotView.propTypes = {
  openModal: PropTypes.string,
  setOpenModal: PropTypes.func
}

export default MascotView;
