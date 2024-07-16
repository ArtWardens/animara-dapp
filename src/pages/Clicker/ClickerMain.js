import ClickerView from "./ClickerView";
import { useEffect, useState } from "react";
import '../../styles/globals.css';
import { useAppDispatch } from "../../hooks/storeHooks";
import { getUser, useUserDetails } from "../../sagaStore/slices";
import { useNavigate } from "react-router-dom";
import backgroundImageClicker from '../../assets/images/clicker-character/clickerBg.png';

export default function ClickerMain() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useUserDetails();

  useEffect(() => {
    setTimeout(() => {
      dispatch(getUser());
    },1000);
  },[]);

  useEffect(() => {
    setTimeout(() => {
      if(!currentUser){
        // navigate('/login');
      }
    },1500)
  }, [currentUser])

  const [gameData, setGameData] = useState({});

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

      <ClickerView
        currentUser={currentUser}
        gameData={gameData}
        setGameData={setGameData}
      />

    </div>
  );
}
