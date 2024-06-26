import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleUpdateScore } from "../../firebase/clicker";
import { addToLocalStorage, getFromLocalStorage } from "../../utils/localStorage";
import { useUserDetails } from "../../sagaStore/slices";

const ClickCounter = ({ gameData, currentMascot, totalClicks, setTotalClicks, userProgress }) => {
  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;
  const currentUser = useUserDetails();
  // console.log(gameData);
  useEffect(() => {
    if (numberOfClicks > 0) {
      const currentScore = getFromLocalStorage("currentScore");
      const totalScore = numberOfClicks + parseInt(currentScore);

      setTotalClicks(totalScore);
      addToLocalStorage("sessionPoints", totalScore)
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
