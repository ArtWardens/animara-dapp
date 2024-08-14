import React, { useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import useSound from "use-sound";
import { useAppDispatch } from "../hooks/storeHooks.js";
import { useUserDetails, useLocalStamina, consumeStamina } from "../sagaStore/slices";
import { getImagePath, getAllImagePaths } from "../utils/getImagePath";
import { preloadImages } from "../utils/preloadImages";
import Header from "./Header.jsx";

const MascotView = ({
  currentMascot,
  isOpenRewardModal,
  setIsOpenRewardModal,
  handleOpenModal
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const localStamina = useLocalStamina();
  const [preloadedImage, setPreloadedImage] = useState(false);
  const [showImage, setShowImage] = useState('');
  const [plusOneEffect, setPlusOneEffect] = useState({ show: false, left: 0, top: 0 });
  const timerRef = useRef(null);
  const plusOneTimerRef = useRef(null);
  const [mascotSound] = useSound(currentMascot?.sound);

  const [startSlide, setStartSlide] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

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
    // preload images if enter on the first time
    if (!preloadedImage){
      preloadImages(getAllImagePaths(currentUser));
      setPreloadedImage(true);
    }

    // set image
    setShowImage(getImagePath(currentUser));

    const resetTimer = () => {
      if (isInteractive && currentUser) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setShowImage(getImagePath(currentUser));
        }, 3000);
      }
    };
    document.addEventListener("mousedown", resetTimer);
    return () => {
      document.removeEventListener("mousedown", resetTimer);
    };
  }, [isInteractive, currentUser, preloadedImage]);

  // tap handlers
  const handleMouseDown = () => {
    // skip if not interactive
    if (!isInteractive) return;

    // skip and show boost modal if out of stamina
    if (localStamina <= 0){
      handleOpenModal("boosts");
      return;
    }

    // has stamina to click
    const restartIdleTimer = () => {
      // reset timer whenever we call this
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // set a timer to reset mascot after no action for a duration
      timerRef.current = setTimeout(() => {
        setShowImage(getImagePath(currentUser));
      }, 3000);
    };
    restartIdleTimer();

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
    }, 1000);
  };
  const handleMouseUp = () => { };

  const closeRewardModal = () => {
    setIsOpenRewardModal(false);
  };

  return (
    <div
      className="flex justify-center items-end h-screen w-screen pb-16"
    >

      <Header />

      <div
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`cursor-pointer w-5/6 h-4/5 rounded-3xl p-3`}
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
            src={"../assets/images/clicker-character/ring01.png"}
            alt="ring"
            className="object-cover w-12 absolute left-2"
          />
          <img
            src={"../assets/images/clicker-character/ring01.png"}
            alt="ring"
            className="object-cover w-12 opacity-0"
          />
          <img
            src={"../assets/images/clicker-character/ring02.png"}
            alt="ring"
            className="object-cover w-12 absolute right-8"
          />
        </div>
        <div
          className="grid w-full h-full rounded-2xl"
          style={{
            backgroundImage: 'url("../assets/images/clicker-character/mascotBg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="relative flex justify-center items-center h-full w-full">
            {plusOneEffect.show && (
              <img
                src={"../assets/images/clicker-character/plusOne.png"}
                alt="+1"
                className="absolute w-40 h-40 animate-fadeInOut z-10"
                style={{ left: `${plusOneEffect.left}%`, top: `${plusOneEffect.top}%` }}
              />
            )}
            <img
              src={showImage}
              alt="Game mascot"
              className={`absolute w-3/4 bottom-20 transition-transform duration-1000 ${
                startSlide ? 'translate-y-0' : 'translate-y-full'
              }`}
            />
          </div>
        </div>
      </div>

      {isOpenRewardModal && (
        <div
          className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90`}
          style={{
            zIndex: 100,
          }}
        >
          <video
            src="../assets/images/clicker-character/depletion-rewardBox.webm"
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
  currentMascot: PropTypes.object,
  isOpenRewardModal: PropTypes.bool,
  setIsOpenRewardModal: PropTypes.func,
  handleOpenModal: PropTypes.func
}

export default MascotView;
