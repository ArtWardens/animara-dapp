import React from "react";

const ClickCounter = ({ gameData, currentMascot }) => {
  return (
    <div>
      <h3
        className={`text-center text-yellow-number text-9xl font-bold z-10 transition-transform absolute xl:top-[20px] 2xl:top-[120px] -translate-x-1/2 top-[20px] number-shadow-text`}
      >
        {gameData?.[currentMascot?.version]?.numberOfClicks}
      </h3>
    </div>
  );
};

export default ClickCounter;
