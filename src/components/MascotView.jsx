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

  const timerRef = useRef(null);
  const [mascotSound] = useSound(currentMascot?.sound);

  const handleStart = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser));
    }, 3000);
  };

  const handleMouseDown = () => {
    if (gameData?.mascot2?.energy > gameData?.mascot2?.clickByLevel) {
      handleStart();
      const LocalClickByLevel = getFromLocalStorage("LocalClickByLevel");
      setGameData((pre) => {
        const totalClicksCount = pre[currentMascot.version]?.clickByLevel + rewardRate?.tapCount;

        addToLocalStorage("LocalClickByLevel", parseInt(LocalClickByLevel) || 0 + pre[currentMascot.version]?.numberOfClicks);
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

    } else {
      handleOpenModal("boosts");
    }
  };

  const handleMouseUp = () => {
  };

  const closeRewardModal = () => {
    setIsOpenRewardModal(false);
  };

  useEffect(() => {
    preloadImages(getAllImagePaths(userProgress));
  }, [userProgress]);

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser));
      }, 3000);
    };
    document.addEventListener("mousedown", resetTimer);
    return () => {
      document.removeEventListener("mousedown", resetTimer);
    };
  }, [currentMascot, currentUser, gameData, setIdle, userProgress]);

  useEffect(() => {
    setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser));
  }, [gameData, currentMascot, userProgress, currentUser]);


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
          className="w-5/6 h-4/5 rounded-3xl p-3"
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
            <img
              src={showImage}
              alt="Game mascot"
              className="absolute place-self-center object-fit w-3/4 bottom-12"
            />
          </div>
        </div>

      {isOpenRewardModal && (
        <div
          className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90 ${isOpenRewardModal ? "animate-modalOpen" : "animate-modalClose"}`}
          style={{
            zIndex: 100,
          }}
        >
          <button className="text-4xl mx-4" onClick={closeRewardModal}>&times;</button>

          <div className='flex flex-col justify-between items-center'>
            <p className={`text-8xl mt-16 ${isOpenRewardModal ? "animate-slideInFromBottom" : "animate-slideOutToBottom"}`}>
              {rewardRate?.depletionReward}
            </p>
            <img
              src="../assets/images/clicker-character/openBox.png"
              alt="Game mascot"
              className={`object-cover h-3/4 w-3/4 ${isOpenRewardModal ? "animate-slideInFromTop" : "animate-slideOutToTop"}`}
            />

          </div>

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
  rewardRate: PropTypes.number,
  handleOpenModal: PropTypes.func
}

export default MascotView;
