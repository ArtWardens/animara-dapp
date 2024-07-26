import React from "react";
import { PropTypes } from "prop-types";
import ClickerView from "./ClickerView";
import backgroundImageClicker from '../../assets/images/clicker-character/clickerBg.png';
import '../../styles/globals.css';

function ClickerPage({
  currentUser,
  gameData,
  setGameData,
  totalClicks,
  setTotalClicks
}) {
  return (
    <div
      className="w-full mx-auto bg-clicker-game bg-no-repeat bg-cover h-screen relative cursor-pointer -z-99"
      style={{
        backgroundImage: `url(${backgroundImageClicker})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex items-center justify-center h-full gap-4">
        
        <ClickerView
          currentUser={currentUser}
          gameData={gameData}
          setGameData={setGameData}
          totalClicks={totalClicks}
          setTotalClicks={setTotalClicks}
        />

      </div>
    </div>
  );
}

ClickerPage.propTypes = {
  currentUser: PropTypes.object,
  gameData: PropTypes.object,
  setGameData: PropTypes.func,
  totalClicks: PropTypes.number,
  setTotalClicks: PropTypes.func
}

export default ClickerPage;
