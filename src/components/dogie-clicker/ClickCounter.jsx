import React, { useEffect, useState, useRef } from "react";
import { useUserDetails } from "../../sagaStore/slices";
import { addToLocalStorage, getFromLocalStorage } from "../../utils/localStorage"
import { useNavigate } from "react-router-dom";

const ClickCounter = ({ gameData, currentMascot, totalClicks, setTotalClicks, rewardRate, setIsOpenRewardModal }) => {

  const navigate = useNavigate();
  const currentUser = useUserDetails();
  const [clickCount, setClickCount] = useState(0);
  
  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;
  const clickByLevel = gameData?.mascot2?.clickByLevel;
  const maxEnergy = gameData?.mascot2?.energy;

  useEffect(() => {
    if (clickCount > 0) {

      // console.log(clickCount);

      const timer = setTimeout(() => {
        setClickCount(0);
      }, 3000);

      return () => clearTimeout(timer); // Cleanup the timer on component unmount or when clickCount changes
    }
  }, [clickCount]);

  useEffect(() => {
    setTimeout(() => {
      if (!currentUser) {
        navigate('/login');
      }
    }, 1500)
  }, [currentUser])

  useEffect(() => {
    if (numberOfClicks > 0) {
      const shouldGainRewards = clickByLevel === maxEnergy;
      const extraRewards = shouldGainRewards ? rewardRate?.depletionReward : 0;

      const localCoins = getFromLocalStorage("localCoins");
      setTotalClicks(prevTotal => {
        const totalLocalCoins = parseInt(localCoins) || 0 + numberOfClicks + extraRewards;
        addToLocalStorage("localCoins", totalLocalCoins);
        addToLocalStorage("totalLocalCoins", prevTotal + rewardRate?.tapCount + extraRewards);
        return prevTotal + rewardRate?.tapCount + extraRewards;
      });

      if (shouldGainRewards) {
        console.log("Completed! Popup reward modal")
        setIsOpenRewardModal(true);
      }
    };
  }, [numberOfClicks]);

  useEffect(() => {
    if (gameData.currentScore !== undefined && gameData.currentScore !== null) {
      // console.log("Set current user score");
      setTotalClicks(gameData.currentScore);
    }
  }, [gameData.currentScore]);

  return (
    <div
      className="flex flex-row absolute top-8 z-10 p-5"
      style={{
        border: '2px solid #F4FBFF',
        borderRadius: '500px 20px 20px 500px',
        background: 'var(--0163BE, #0163BE)',
        boxShadow: '3px 2px 0px 0px #517296 inset',
      }}
    >

      <div className="place-content-center p-2 w-20 h-20">
        <img
          src={"../assets/images/clicker-character/gem.png"}
          alt="gem"
        />
      </div>

      <div className="flex flex-col gap-2">

        <div className="font-outfit text-md">
          {currentUser?.name}
        </div>

        <div
          className="text-3xl md:text-3xl lg:text-3xl xl:text-4xl text-amber-500 flex items-center gap-2"
          style={{
            WebkitTextStrokeWidth: '1px',
            WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
            fontWeight: '600',
            lineHeight: '0.9',
            letterSpacing: '1.2px',
          }}
        >
          <img
            src={"../assets/images/clicker-character/gem.png"}
            alt="gem"
          />
          <span>{totalClicks}</span>
        </div>

      </div>
    </div>
  );
};

export default ClickCounter;