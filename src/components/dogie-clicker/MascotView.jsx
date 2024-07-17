import React, { useEffect, useRef, useState } from "react";
import useSound from "use-sound";
import ClickCounter from "./ClickCounter";
import { getImagePath, getAllImagePaths } from "../../utils/getImagePath";
import { preloadImages } from "../../utils/preloadImages";
import { addToLocalStorage, getFromLocalStorage } from "../../utils/localStorage";

const MascotView = ({
  userProgress,
  setGameData,
  currentMascot,
  setIdle,
  delay,
  setDelay,
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
    setIdle(false); // Reset idle state when the user interacts
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIdle(true); // Set idle state to true after 3 seconds of inactivity
      setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser)); // Reset to initial image after idle
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
      // handleError(); // Open the modal instead of showing toast error
    }
  };

  const handleMouseUp = () => {
    // Optionally, you can handle the mouse up event if needed
  };

  const closeRewardModal = () => {
    setIsOpenRewardModal(false);
  };

  useEffect(() => {
    setTimeout(() => setDelay(false), 2000);
  }, [currentMascot?.version]);

  useEffect(() => {
    preloadImages(getAllImagePaths(userProgress));
  }, [userProgress]);

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIdle(true); // Set idle state to true when the user is idle for 3 seconds
        setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser)); // Reset to initial image after idle
      }, 3000);
    };
    document.addEventListener("mousedown", resetTimer); // Listen for mouse button press
    return () => {
      document.removeEventListener("mousedown", resetTimer);
    };
  }, []);

  useEffect(() => {
    setShowImage(getImagePath(userProgress, gameData, currentMascot, currentUser));
  }, [gameData, currentMascot, userProgress]);


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

      {delay ? (
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
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
              className="absolute place-self-center object-fit w-3/4 bottom-20"
            />
          </div>
        </div>
      )}

      {isOpenRewardModal && (
        <div
          className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90 ${isOpenRewardModal ? "animate-modalOpen" : "animate-modalClose"}`}
          style={{
            zIndex: 100,
          }}
        >

          <a className="text-4xl mx-4" type="button" onClick={closeRewardModal}>&times;</a>

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

export default MascotView;
