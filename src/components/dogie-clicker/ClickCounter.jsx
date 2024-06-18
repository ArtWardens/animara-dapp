import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ClickCounter = ({ gameData, currentMascot, data }) => {
  const [showClicks, setShowClicks] = useState(false);
  const [totalClicks, setTotalClicks] = useState(0);
  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;
  const [levelUp, setLevelUp] = useState(true);

  useEffect(() => {
    let timer;
    if (numberOfClicks > 0) {
      setShowClicks(true);
      timer = setTimeout(() => {
        setShowClicks(false);
        setTotalClicks(prevTotal => prevTotal + numberOfClicks);
      }, 3000); // Hide clicks after 2 seconds of inactivity
    }
    return () => clearTimeout(timer);
  }, [numberOfClicks]);

  useEffect(() => {
    if (((numberOfClicks + totalClicks) >= data.CoinsToLevelUp.count) && levelUp) {
      toast.success("Level up!!!");
      setLevelUp(false);
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
