
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../hooks/storeHooks";
import { getUser, useUserDetails, logOut } from "../../sagaStore/slices";
import ClickerView from "./ClickerView";
import backgroundImageClicker from '../../assets/images/clicker-character/clickerBg.png';
import '../../styles/globals.css';
import { useNavigate } from "react-router-dom";

export default function ClickerMain() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useUserDetails();
  const [gameData, setGameData] = useState({});

  useEffect(() => {
    setTimeout(() => {
      dispatch(getUser());
    },1000);
  },[dispatch]);

  useEffect(() => {
    if(!currentUser){
      navigate('/login');
    }
  }, [currentUser, navigate])

  const handleSignout = () =>{
    dispatch(logOut());
  }

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
      <div className=" flex justify-between absolute right-0 mt-6">
        <div className="bg-count2 h-[50px] min-w-[200px] w-full bg-no-repeat bg-contain grid items-center justify-start pl-12 text-white text-sm">
          {gameData?.totalPoints}
        </div>
      </div>

      <button className=" flex justify-between absolute right-0 mr-6 hover:pb-2" onClick={handleSignout}>sign out</button>

      <ClickerView
        currentUser={currentUser}
        gameData={gameData}
        setGameData={setGameData}
      />

    </div>
  );
}
