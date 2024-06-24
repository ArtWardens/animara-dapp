import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleUpdateScore } from "../../firebase/clicker";

const ClickCounter = ({ gameData, currentMascot, totalClicks, setTotalClicks, userProgress }) => {
  const [showClicks, setShowClicks] = useState(false);
  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;

  useEffect(() => {
    let timer;
    if (numberOfClicks > 0) {
      setShowClicks(true);
      timer = setTimeout(() => {
        setShowClicks(false);
        setTotalClicks(prevTotal => {
          handleUpdateScore({
            score: prevTotal + numberOfClicks,
          });
          return prevTotal + numberOfClicks;
        });
        
      }, 3000); // Hide clicks after 3 seconds of inactivity
    }
    return () => clearTimeout(timer);
  }, [numberOfClicks]);

  useEffect(() => {
    if(gameData.currentScore !== undefined && gameData.currentScore !== null){
      console.log("Set current user score");
      setTotalClicks(gameData.currentScore);
    }
  },[gameData.currentScore])

  useEffect(() => {
    if (((numberOfClicks + totalClicks) >= userProgress.CoinsToLvlUp)) {
      toast.success("Level up!!!");
    }
  }, [numberOfClicks]);

  return (
    <div>

      <h5 className={`text-center flex items-center gap-5 text-7xl md:text-7xl lg:text-7xl xl:text-8xl font-bold transition-transform absolute top-52 -translate-x-1/2 z-10`}>
        <img
          src={"../assets/images/clicker-character/gem.png"}
          width={60}
          height={60}
          className="h-10 w-10"
          alt="hamar image"
        />
        {totalClicks} &nbsp;
      </h5>

      {showClicks && (
        <h3 className={`text-center text-7xl md:text-7xl lg:text-7xl xl:text-8xl font-bold transition-transform absolute top-100 -translate-x-1/2 number-shadow-text z-10`}>
          {numberOfClicks}
        </h3>
      )}
    </div>
  );
};

export default ClickCounter;
