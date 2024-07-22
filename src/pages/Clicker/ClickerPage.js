import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/storeHooks";
import { getUser, useUserDetails } from "../../sagaStore/slices";
import { useNavigate } from "react-router-dom";
import ClickerView from "./ClickerView";
import backgroundImageClicker from '../../assets/images/clicker-character/clickerBg.png';
import '../../styles/globals.css';

export default function ClickerPage({
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
