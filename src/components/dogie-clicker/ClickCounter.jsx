import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleUpdateCoins } from "../../firebase/clicker";
import { useUserDetails } from "../../sagaStore/slices";
import { addToLocalStorage, getFromLocalStorage } from "../../utils/localStorage"

const ClickCounter = ({ gameData, currentMascot, totalClicks, setTotalClicks, userProgress }) => {
  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;

  useEffect(() => {
    if (numberOfClicks > 0) {
      const localCoins = getFromLocalStorage("localCoins");
      setTotalClicks(prevTotal => {
        const totalLocalCoins = parseInt(localCoins) + numberOfClicks;
        addToLocalStorage("localCoins", totalLocalCoins);
        addToLocalStorage("totalLocalCoins", prevTotal + userProgress?.EarnPerTap);
        return prevTotal + userProgress?.EarnPerTap;
      });
    };
  }, [numberOfClicks]);

  useEffect(() => {
    if (gameData.currentScore !== undefined && gameData.currentScore !== null) {
      // console.log("Set current user score");
      setTotalClicks(gameData.currentScore);
    }
  }, [gameData.currentScore]);

  useEffect(() => {
    if (totalClicks >= userProgress.CoinsToLvlUp) {
      toast.success("Level up!!!");
    }
  }, [totalClicks, userProgress.CoinsToLvlUp]);

  return (
    <div>
      <h5 className="text-center flex items-center gap-5 text-7xl md:text-7xl lg:text-7xl xl:text-8xl font-bold transition-transform absolute top-52 -translate-x-1/2 z-10">
        <img
          src={"../assets/images/clicker-character/gem.png"}
          width={60}
          height={60}
          className="h-10 w-10"
          alt="gem"
        />
        {totalClicks} &nbsp;
      </h5>
    </div>
  );
};

export default ClickCounter;
