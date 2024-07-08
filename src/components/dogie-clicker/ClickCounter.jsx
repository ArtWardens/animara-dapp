import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleUpdateCoins } from "../../firebase/clicker";
import { useUserDetails } from "../../sagaStore/slices";
import { addToLocalStorage, getFromLocalStorage } from "../../utils/localStorage"
import { useNavigate } from "react-router-dom";
// import backgroundImageClicker from '../../assets/images/clicker-character/clickerBg.png';


const ClickCounter = ({ gameData, currentMascot, totalClicks, setTotalClicks, userProgress }) => {

  const navigate = useNavigate();
  const currentUser = useUserDetails();
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount(prevCount => prevCount + 1);
  };

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

  const numberOfClicks = gameData?.[currentMascot?.version]?.numberOfClicks;

  useEffect(() => {
    if (numberOfClicks > 0) {
      const localCoins = getFromLocalStorage("localCoins");
      setTotalClicks(prevTotal => {
        const totalLocalCoins = parseInt(localCoins) || 0 + numberOfClicks;
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

  return (
    <div 
      className="flex flex-col gap-2 absolute top-8 z-10 left-4 md:left-20 lg:left-20 xl:left-52 2xl:left-64 bg-cyan-950 p-4 rounded-2xl"
      // style={{ 
      //   backgroundImage: `url(${backgroundImageClicker})`,
      //   backgroundSize: 'cover',
      //   backgroundRepeat: 'no-repeat',
      //   backgroundPosition: 'center',
      //   zIndex: 999,
      // }}
    >
      <div className="text-lg md:text-lg lg:text-lg xl:text-xl flex gap-5 font-outfit uppercase">
        {currentUser?.first_name}{" "}{currentUser?.last_name}
      </div>
      <div
        className="text-2xl md:text-2xl lg:text-2xl xl:text-3xl text-amber-500 flex items-center gap-2"
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
          width={50}
          height={50}
          className="h-6 w-6"
          alt="gem"
        />
        <span>{totalClicks}</span>
      </div>
    </div>
  );
};

export default ClickCounter;