import React, { useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import useSound from "use-sound";
import ClickCounter from "./ClickCounter";
import { getImagePath, getAllImagePaths } from "../utils/getImagePath";
import { preloadImages } from "../utils/preloadImages";
import { addToLocalStorage, getFromLocalStorage } from "../utils/localStorage";

const MascotView = ({
  userProgress,
  setGameData,
  currentMascot,
  setIdle,
  gameData,
  totalClicks,
  setTotalClicks,
  currentUser,
  isOpenRewardModal,
  setIsOpenRewardModal,
  rewardRate,
  handleOpenModal
}) => {

  const [showImage, setShowImage] = useState('');
  const [plusOneEffect, setPlusOneEffect] = useState({ show: false, left: 0, top: 0 });
  const timerRef = useRef(null);
  const plusOneTimerRef = useRef(null);
  const [mascotSound] = useSound(currentMascot?.sound);

  const [isVisible, setIsVisible] = useState(false);
  const [startSlide, setStartSlide] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 800);

    const slideTimer = setTimeout(() => {
      setStartSlide(true);
    }, 1000);

    const interactivityTimer = setTimeout(() => {
      setIsInteractive(true);
    }, 2000); // Adjust this delay to match the duration of your transitions

    return () => {
      clearTimeout(timer);
      clearTimeout(slideTimer);
      clearTimeout(interactivityTimer);
    };
  }, []);

  useEffect(() => {
    preloadImages(getAllImagePaths(userProgress));
  }, [userProgress]);

  useEffect(() => {
    const resetTimer = () => {
      if (isInteractive) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser));
        }, 3000);
      }
    };
    document.addEventListener("mousedown", resetTimer);
    return () => {
      document.removeEventListener("mousedown", resetTimer);
    };
  }, [isInteractive, currentMascot, currentUser, gameData, setIdle, userProgress]);

  useEffect(() => {
    setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser));
  }, [gameData, currentMascot, userProgress, currentUser]);

  const handleMouseDown = () => {
    if (!isInteractive) return;

    if (gameData?.mascot2?.energy > gameData?.mascot2?.clickByLevel) {
      const LocalClickByLevel = getFromLocalStorage("LocalClickByLevel");
      setGameData((pre) => {
        const totalClicksCount = pre[currentMascot.version]?.clickByLevel + rewardRate?.tapCount;

        addToLocalStorage("LocalClickByLevel", (parseInt(LocalClickByLevel) || 0) + pre[currentMascot.version]?.numberOfClicks);
        addToLocalStorage("TotalLocalClickByLevel", totalClicksCount);

        return {
          ...pre,
          [currentMascot.version]: {
            ...pre.mascot2,
            numberOfClicks: (pre[currentMascot.version]?.numberOfClicks || 0) + rewardRate?.tapCount,
            clickByLevel: totalClicksCount,
          }
        }
      });

      mascotSound();

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

    } else {
      handleOpenModal("boosts");
    }
  };

  const handleMouseUp = () => { };

  const closeRewardModal = () => {
    setIsOpenRewardModal(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="cursor-pointer flex justify-center items-end h-screen w-screen pb-16"
    >

      <ClickCounter
        gameData={gameData}
        currentMascot={currentMascot}
        totalClicks={totalClicks}
        setTotalClicks={setTotalClicks}
        rewardRate={rewardRate}
        setIsOpenRewardModal={setIsOpenRewardModal}
      />

      <div
        className={`w-5/6 h-4/5 rounded-3xl p-3 transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          border: '2px solid var(--Color, #F4FBFF)',
          background: 'rgba(155, 231, 255, 0.58)',
          boxShadow: '0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <div className="absolute flex w-full justify-between -top-9">
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
  userProgress: PropTypes.number,
  setGameData: PropTypes.func,
  currentMascot: PropTypes.object,
  setIdle: PropTypes.func,
  gameData: PropTypes.object,
  totalClicks: PropTypes.number,
  setTotalClicks: PropTypes.func,
  currentUser: PropTypes.object,
  isOpenRewardModal: PropTypes.bool,
  setIsOpenRewardModal: PropTypes.func,
  rewardRate: PropTypes.object,
  handleOpenModal: PropTypes.func
}

export default MascotView;
