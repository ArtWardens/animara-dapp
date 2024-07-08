import React, { useEffect, useState } from 'react';
import MascotView from '../../components/dogie-clicker/MascotView';
import EarnGuide from '../../components/dogie-clicker/EarnGuide';
import EnergyRegeneration from '../../components/dogie-clicker/EnergyRegeneration';
import LevelProgress from '../../components/dogie-clicker/LevelProgress';
import TasksCheck from '../../components/dogie-clicker/TasksCheck';
import { useGlobalContext } from '../../context/ContextProvider';
import '../../styles/globals.css';
import { calculateTimeRemaining } from '../../utils/fuctions';
import { mascots } from '../../utils/local.db';
import { gameConfig } from '../../data/constants';
import { addToLocalStorage, getFromLocalStorage } from '../../utils/localStorage';
import { handleUpdateCoins, handleUpdateClickByLevel, handleUpdateLevelUp } from '../../firebase/clicker';
import { handleUpdateUserLeaveTime, handleUpdateUserRechargableEnergy } from '../../firebase/user';

const ClickerView = ({ currentUser, gameData, setGameData }) => {

  const [currentMascot, setCurrentMascot] = useState(mascots[1]);
  const [leaderBoardData, setLeaderBoardData] = useState({});
  const [idle, setIdle] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [delay, setDelay] = useState(true);
  const [isLeaderBoardOpen, setIsLeaderBoardOpen] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [totalCount, setTotalCount] = useState({
    mascot1: 0,
    mascot2: 0,
    mascot3: 0,
  });
  
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const [totalClicks, setTotalClicks] = useState(gameData.currentScore);
  const [userProgress, setUserProgress] = useState({
    EarnPerTap: 1,
    CoinsToLvlUp: 25,
    Energy: 100,
    currentLevel: 1,
    LevelProgress: {
      prevCTL: 25,
    }
  });
  const [energyRechargable, setEnergyRechargable] = useState(0);

  const updateFirebase = () => {
    const localCoins = getFromLocalStorage("localCoins");
    const totalLocalCoins = getFromLocalStorage("totalLocalCoins");
    if (currentUser && parseInt(localCoins) > 0) {
      console.log("Coins Updated!");
      addToLocalStorage("localCoins", 0);
      handleUpdateCoins({
        userId: currentUser.userId,
        coins: parseInt(totalLocalCoins),
      });
    }

    const LocalClickByLevel = getFromLocalStorage("LocalClickByLevel");
    const TotalLocalClickByLevel = getFromLocalStorage("TotalLocalClickByLevel");
    if (currentUser && parseInt(LocalClickByLevel) > 0) {
      console.log("ClickByLevel Updated!");
      addToLocalStorage("LocalClickByLevel", 0);
      handleUpdateClickByLevel({
        userId: currentUser.userId,
        clickByLevel: parseInt(TotalLocalClickByLevel),
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateFirebase();
    }, 10000); // Update Firestore every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // ! NOT WORKING
    const handleBeforeUnload = () => {
      console.log("Run before unload");
      updateFirebase(); // Ensure coins are updated before the tab is closed or refreshed
      // updateExitTime();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser]);

  useEffect(() => {
    const handleMouseLeave = (event) => {
      if (event.clientY <= 0) {
        updateFirebase();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        updateFirebase();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const calculateLevel = (clicks) => {
    const { start, increaseAmount } = gameConfig.CoinsToLevelUp;
    let currentAmount = start;
    let level = 1;
    
    while (clicks >= currentAmount) {
      currentAmount += Math.ceil(currentAmount * increaseAmount);
      level += 1;
    };

    return level;
  };

  const calculateCTL = (clicks) => {
    const { start, increaseAmount } = gameConfig.CoinsToLevelUp;
    let currentAmount = start;
    
    while (clicks >= currentAmount) {
      currentAmount += Math.ceil(currentAmount * increaseAmount);
    };

    return currentAmount;
  };

  const calculateEPC = (currentLevel) => {
    const { start, increaseAmount, levelInterval } = gameConfig.EarnPerTap;
    
    const increaseSteps = Math.floor((currentLevel - 1) / levelInterval);
    
    let currentEPC = start + increaseSteps * increaseAmount;
    return currentEPC;
  };

  const calculateEnergy = (currentLevel) => {
    const { start, increaseAmount, levelInterval } = gameConfig.Energy;
    
    const increaseSteps = Math.floor((currentLevel - 1) / levelInterval);
  
    let currentEnergy = start + increaseSteps * increaseAmount;
    return currentEnergy;
  };

  const calculatePrevCTL = (clicks) => {
    const { start, increaseAmount } = gameConfig.CoinsToLevelUp;
    let currentAmount = start;
    let previousAmount = currentAmount;
    
    while (clicks >= currentAmount) {
      previousAmount = currentAmount;
      currentAmount += Math.ceil(currentAmount * increaseAmount);
    };

    return previousAmount;
  };

  // Handle update level up
  useEffect(() => {
    const currentMaxEnergy = gameData?.mascot2?.energy;;

    if(gameData?.mascot2?.clickByLevel){
      const totalLocalCoins = getFromLocalStorage("totalLocalCoins");
      const TotalLocalClickByLevel = getFromLocalStorage("TotalLocalClickByLevel");

      if(currentMaxEnergy === gameData?.mascot2?.clickByLevel && !currentUser?.isLevelUp){
        addToLocalStorage("localCoins", 0);
        addToLocalStorage("LocalClickByLevel", 0);
        handleUpdateLevelUp({
          userId: currentUser.userId,
          coins: parseInt(totalLocalCoins),
          level: currentUser?.level + 1,
          clickToLvlUp: currentUser?.clickToLvlUp + 50,
          clickByLevel: parseInt(TotalLocalClickByLevel) + 50,
        });
        setGameData((prev) => ({
          ...prev,
          mascot2: {
            ...prev.mascot2, 
            clickByLevel: parseInt(TotalLocalClickByLevel) + 50,
            energy: currentUser?.clickToLvlUp + 50,
            level: currentUser?.level + 1
          },
        }));
      }
    };

  },[gameData?.mascot2?.clickByLevel])

  // Task to recharge energy
  useEffect(() => {
    if(currentUser?.energyRechargable){
        setEnergyRechargable(currentUser?.energyRechargable)
    }
  },[currentUser?.energyRechargable]);

  const handleUpdateRechargableEnergy = () => {
    if(currentUser){
      const maxEnergy = calculateEnergy(calculateLevel(totalClicks));

      handleUpdateUserRechargableEnergy({
        userId: currentUser.userId,
        count: currentUser?.energyRechargable - 1
      });
      setEnergyRechargable(prev => prev - 1);
      addToLocalStorage("LocalClickByLevel", 0);
      // addToLocalStorage("lastEnergy", maxEnergy);
      // addToLocalStorage("energyGenerateTime", new Date());
      setGameData((prev) => ({
        ...prev,
        mascot2: {
          ...prev.mascot2, 
          clickByLevel: 0,
        },
      }));
    }
  }

  // Setup current user progress based on total click and gameconfig
  // useEffect(() => {
  //   setUserProgress({
  //     EarnPerTap: calculateEPC(calculateLevel(totalClicks)),
  //     CoinsToLvlUp: calculateCTL(totalClicks),
  //     Energy: calculateCTL(totalClicks),
  //     currentLevel: calculateLevel(totalClicks),
  //     LevelProgress: {
  //       prevCTL: calculatePrevCTL(totalClicks)
  //     }
  //   });
  // },[totalClicks]);

  const generateEnergyOnload = (energyGenerateTime, lastEnergy) => {
    const currentTime = new Date();
    const maxEnergy = calculateEnergy(calculateLevel(totalClicks));
    const energyPerSecond = 1 / 3;

    if(energyGenerateTime && lastEnergy){
      // Calculate the difference in milliseconds
      const diffInMs = currentTime - new Date(energyGenerateTime);
  
      // Convert the difference in milliseconds to seconds
      const diffInSeconds = Math.floor(diffInMs / 1000);
  
      // Calculate the energy gained based on the time difference
      const gainedEnergy = Math.floor(diffInSeconds * energyPerSecond);
      // Calculate the new energy, ensuring it doesn't exceed maxEnergy
      const newEnergy = Math.min(maxEnergy, parseInt(lastEnergy) + gainedEnergy);
      
      return newEnergy;
    }else{
      return maxEnergy;
    }
  };

  //Fetch the user data on inital load
  useEffect(() => {
    if(currentUser){
      setTimeout(() => {
        setGameData({
          mascot2: {
            numberOfClicks: 0,
            point: 0,
            quest: 0,
            energy: currentUser.clickToLvlUp,
            level: currentUser.level,
            clickByLevel: currentUser.clickByLevel,
            levelProgress: 0,
          },
          totalPoints: 0,
          currentScore: currentUser.coins,
        });
      }, 1000);
    }
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //Reset counter and save data in data base on satate of being idle
  // useEffect(() => {
  //   const saveData = async () => {
  //     if (idle) {
  //       if (totalCount?.[currentMascot?.version] < gameData?.[currentMascot?.version]?.numberOfClicks) {

  //         setTotalCount((pre) => ({
  //           // ...pre,
  //           [currentMascot?.version]: gameData?.[currentMascot?.version]?.numberOfClicks,
  //         }));
  //       }

  //       setGameData((pre) => ({
  //         mascot2: {
  //           numberOfClicks: 0,
  //           point: pre?.mascot2?.point,
  //           quest: pre?.mascot2?.quest,
  //           energy: pre?.mascot2?.energy,
  //           levelProgress: pre?.mascot2?.levelProgress,
  //         },
  //         totalPoints: pre.totalPoints,
  //       }));
  //     }
  //   };
  //   saveData();
  // }, [idle]);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // useEffect(() => {
  //   const targetDate = new Date('2024-06-30T00:00:00Z').getTime();

  //   const updateCountdown = () => {
  //     const now = new Date().getTime();
  //     const distance = targetDate - now;

  //     const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //     const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  //     setTimeLeft({ hours, minutes, seconds });

  //     if (distance < 0) {
  //       clearInterval(timerInterval);
  //       setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
  //     }
  //   };

  //   const timerInterval = setInterval(updateCountdown, 1000);

  //   return () => clearInterval(timerInterval);
  // }, []);

  // useEffect(() => {
  //   const generateEnergy = () => {
  //     setGameData((prev) => {
  //       if (prev?.mascot2?.energy < userProgress.Energy) {
  //         addToLocalStorage("lastEnergy", prev.mascot2.energy + 1);
  //         addToLocalStorage("energyGenerateTime", new Date());
  //         return {
  //           ...prev,
  //           mascot2: {
  //             ...prev.mascot2,
  //             energy: prev.mascot2.energy + 1,
  //           },
  //         };
  //       } else {
  //         return prev;
  //       }
  //     });
  //   };

  //   const threeSecondInterval = setInterval(generateEnergy, 50000);

  //   return () => clearInterval(threeSecondInterval);
  // }, [userProgress.Energy]);

  // Countdown logic based on energy regeneration
  // useEffect(() => {
  //   const currentEnergy = gameData?.mascot2?.energy || 0;
  //   const maxEnergy = calculateEnergy(calculateLevel(totalClicks));

  //   // Calculate the total remaining time in seconds
  //   var totalRemainingTime = (maxEnergy - currentEnergy) * 3;

  //   // Function to update the countdown
  //   const updateEnergyCountdown = () => {
  //     setCountdown(totalRemainingTime > 0 ? totalRemainingTime : 0);
  //   };

  //   // Initial countdown update
  //   updateEnergyCountdown();

  //   // Update the countdown every second
  //   const countdownInterval = setInterval(() => {
  //     totalRemainingTime -= 1;
  //     updateEnergyCountdown();
  //   }, 1000);

  //   // Clean up interval on component unmount
  //   return () => clearInterval(countdownInterval);
  // }, [gameData?.mascot2?.energy]);

  return (
    <>
      <div className="max-w-full flex justify-center items-center gap-2 relative">

        <EarnGuide
          userProgress={userProgress}
          gameData={gameData}
          currentUser={currentUser}
          energyRechargable={energyRechargable} 
          handleUpdateRechargableEnergy={handleUpdateRechargableEnergy}
        />

        <LevelProgress
          userProgress={userProgress}
          gameData={gameData}
          totalClicks={totalClicks}
        />

        <EnergyRegeneration
          currentUser={currentUser}
          userProgress={userProgress}
          gameData={gameData}
          setGameData={setGameData}
          // timeLeft={timeLeft} 
          countdown={countdown}
        />

        <TasksCheck
          currentUser={currentUser}
          energyRechargable={energyRechargable} 
          handleUpdateRechargableEnergy={handleUpdateRechargableEnergy}
          setGameData={setGameData}
        />

        <MascotView
          currentUser={currentUser}
          userProgress={userProgress}
          timeRemaining={timeRemaining}
          gameData={gameData}
          setGameData={setGameData}
          currentMascot={currentMascot}
          setIdle={setIdle}
          totalCount={totalCount}
          setTotalCount={setTotalCount}
          delay={delay}
          setDelay={setDelay}
          setTotalPoints={setTotalPoints}
          totalPoints={totalPoints}
          totalClicks={totalClicks}
          setTotalClicks={setTotalClicks}
        />

      </div>
    </>
  );
};

export default ClickerView;
