import React, { useEffect, useRef, useState } from 'react';
import MascotView from '../../components/dogie-clicker/MascotView';
import EnergyRegeneration from '../../components/dogie-clicker/EnergyRegeneration';
import { calculateTimeRemaining } from '../../utils/fuctions';
import { mascots } from '../../utils/local.db';
import { addToLocalStorage, getFromLocalStorage } from '../../utils/localStorage';
import { handleUpdateCoins, handleUpdateClickByLevel } from '../../firebase/clicker';
import { handleUpdateUserRechargableEnergy, handleUpdateUserRechargableInvite } from '../../firebase/user';
import { fetchRewardRate } from '../../firebase/rewardRates';
import { useAppDispatch } from '../../hooks/storeHooks';
import { closeDailyPopup, updateDailyLogin, useIsOpenDailyPopup } from '../../sagaStore/slices';
import { dailyLogin } from '../../data/constants';
import '../../styles/globals.css';

const ClickerView = ({ currentUser, gameData, setGameData }) => {

  const dispatch = useAppDispatch();
  const isOpenDailyPopup = useIsOpenDailyPopup();
  const [isOpenRewardModal, setIsOpenRewardModal] = useState(false);
  const [modalOpen, handleOpenModal] = useState(false);

  const [currentMascot] = useState(mascots[1]);
  const [idle, setIdle] = useState(false);
  const [delay, setDelay] = useState(true);
  const [countdown] = useState(30);

  
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());
  const [totalClicks, setTotalClicks] = useState(gameData.currentScore);
  const [userProgress] = useState({
    EarnPerTap: 1,
    CoinsToLvlUp: 25,
    Energy: 100,
    currentLevel: 1,
    LevelProgress: {
      prevCTL: 25,
    }
  });
  const [energyRechargable, setEnergyRechargable] = useState(0);

  const updateExitTime = () => {
    if(currentUser){
      handleUpdateUserLeaveTime({ 
        userId: currentUser.userId,
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateFirebase();
    }, 10000); // Update Firestore every 10 seconds
    updateExitTime();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // ! NOT WORKING
    const handleBeforeUnload = () => {
      console.log("Run before unload")
      updateFirebase(); // Ensure coins are updated before the tab is closed or refreshed
      updateExitTime();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentUser]);

  const [inviteRechargable, setInviteRechargable] = useState(0);

  const [rewardRate, setRewardRate] = useState(null);

  // Daily Reward Popup
  useEffect(() => {
    if(currentUser && !currentUser?.loggedInToday){
      const currentLoginDay = currentUser?.loginDays;
      const loginRewardCoins = dailyLogin[currentLoginDay].coins;
      dispatch(updateDailyLogin({
        data: {
          userId: currentUser?.userId, 
          coins: loginRewardCoins
        } 
      }));
      setTotalClicks(prev => prev + loginRewardCoins);
    }
  },[currentUser]);

  useEffect(() => {
    fetchRewardRate().then(results => {
      setRewardRate(results)
    });
  },[])

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

  // Task to recharge energy
  useEffect(() => {
    if(currentUser?.energyRechargable){
        setEnergyRechargable(currentUser?.energyRechargable)
    }
  },[currentUser?.energyRechargable]);

  useEffect(() => {
    if(currentUser?.inviteRechargable){
        setInviteRechargable(currentUser?.inviteRechargable)
    }
  },[currentUser?.inviteRechargable]);

  const handleUpdateRechargableInvite = () => {
    if(currentUser){
      handleUpdateUserRechargableInvite({
        userId: currentUser.userId,
        count: currentUser?.inviteRechargable - 1
      });
      setInviteRechargable(prev => prev - 1);
      addToLocalStorage("LocalClickByLevel", 0);
      setGameData((prev) => ({
        ...prev,
        mascot2: {
          ...prev.mascot2, 
          clickByLevel: 0,
        },
      }));
    }
  }

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

      addToLocalStorage("lastEnergy", maxEnergy);
      addToLocalStorage("energyGenerateTime", new Date());
      
      setGameData((prev) => ({
        ...prev,
        mascot2: {
          ...prev.mascot2, 
          energy: maxEnergy,
        },
      }));

    }
  }

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
    if(currentUser && rewardRate){
      setTimeout(() => {
        setGameData({
          mascot2: {
            numberOfClicks: 0,
            point: 0,
            quest: 0,
            energy: generateEnergyOnload(energyGenerateTime, lastEnergy),
            levelProgress: 0,
          },
          totalPoints: 0,
          currentScore: currentUser.coins,
        });
      }, 1000);
    }
  }, [currentUser, rewardRate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //Reset counter and save data in data base on satate of being idle
  useEffect(() => {
    const saveData = async () => {
      if (idle) {
        if (totalCount?.[currentMascot?.version] < gameData?.[currentMascot?.version]?.numberOfClicks) {
        }
      }
    }
  }, []);

  const handleClose = () => {
    dispatch(closeDailyPopup());
  };

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isOneTimeTaskOpen, setIsOneTimeTaskOpen] = useState(false);
  const triggerLeaderBoard = useRef(null);
  const triggerOneTimeTask = useRef(null);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2024-06-30T00:00:00Z').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });

      if (distance < 0) {
        clearInterval(timerInterval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timerInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    const generateEnergy = () => {
      setGameData((prev) => {
        if (prev?.mascot2?.energy < userProgress.Energy) {
          addToLocalStorage("lastEnergy", prev.mascot2.energy + 1);
          addToLocalStorage("energyGenerateTime", new Date());
          return {
            ...prev,
            mascot2: {
              ...prev.mascot2,
              energy: prev.mascot2.energy + 1,
            },
          };
        } else {
          return prev;
        }
      });
    };

    const threeSecondInterval = setInterval(generateEnergy, 3000);

    return () => clearInterval(threeSecondInterval);
  }, [userProgress.Energy]);

  // Countdown logic based on energy regeneration
  useEffect(() => {
    const currentEnergy = gameData?.mascot2?.energy || 0;
    const maxEnergy = calculateEnergy(calculateLevel(totalClicks));

    // Calculate the total remaining time in seconds
    var totalRemainingTime = (maxEnergy - currentEnergy) * 3;

    // Function to update the countdown
    const updateEnergyCountdown = () => {
      setCountdown(totalRemainingTime > 0 ? totalRemainingTime : 0);
    };

    // Initial countdown update
    updateEnergyCountdown();

    // Update the countdown every second
    const countdownInterval = setInterval(() => {
      totalRemainingTime -= 1;
      updateEnergyCountdown();
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(countdownInterval);
  }, [gameData?.mascot2?.energy]);


  return (
    <>
      <div className="max-w-full flex justify-center items-center gap-2 relative">

        {/* <LevelProgress
          userProgress={userProgress}
          totalClicks={totalClicks}
        /> */}

        <EnergyRegeneration
          currentUser={currentUser}
          gameData={gameData}
          setGameData={setGameData}
          countdown={countdown}
          totalClicks={totalClicks}
          setTotalClicks={setTotalClicks}
          isLeaderboardOpen={isLeaderboardOpen}
          setIsLeaderboardOpen={setIsLeaderboardOpen}
          isOneTimeTaskOpen={isOneTimeTaskOpen}
          setIsOneTimeTaskOpen={setIsOneTimeTaskOpen}
        />

        <MascotView
          userProgress={userProgress}
          setGameData={setGameData}
          currentMascot={currentMascot}
          setIdle={setIdle}
          delay={delay}
          setDelay={setDelay}
          gameData={gameData}
          totalClicks={totalClicks}
          setTotalClicks={setTotalClicks}
          currentUser={currentUser}
          isOpenRewardModal={isOpenRewardModal}
          setIsOpenRewardModal={setIsOpenRewardModal}
          rewardRate={rewardRate}
          handleOpenModal={handleOpenModal}
        />

        <EarnGuide
          energyRechargable={energyRechargable} 
          handleUpdateRechargableEnergy={handleUpdateRechargableEnergy}
          inviteRechargable={inviteRechargable}
          handleUpdateRechargableInvite={handleUpdateRechargableInvite}
          modalOpen={modalOpen}
          handleOpenModal={handleOpenModal}
          rewardRate={rewardRate}
          gameData={gameData}
          isLeaderboardOpen={isLeaderboardOpen}
          setIsLeaderboardOpen={setIsLeaderboardOpen}
          isOneTimeTaskOpen={isOneTimeTaskOpen}
          setIsOneTimeTaskOpen={setIsOneTimeTaskOpen}
        />

        <Modal
          open={isOpenDailyPopup}
          className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
        >
          <div className="flex flex-1 px-4 py-4 justify-center items-center h-full w-full">
            <div className="bg-black max-w-80 flex flex-1 relative rounded-lg shadow-lg h-fit">
              <button
                className="absolute right-2 top-2 sm:-right-3 sm:-top-3 bg-pink-500 rounded-full p-2.5 z-50"
                onClick={handleClose}
              >
                <img className="w-3 h-3" src="assets/icons/x.svg" alt="Close" />
              </button>
              <div className="flex flex-col items-center p-6 sm:p-8 ">
                <Box className="pb-5">
                  <img className="w-20 h-20" src="assets/images/activeDog.png" alt="Active Dog" />
                </Box>
                <div className="space-y-1 flex flex-col items-center">
                  <p className="text-white text-4xl font-base text-center">Daily reward</p>
                  <span className="text-white text-sm font-extralight text-center">
                    Accrue coins for logging into the game daily without skipping
                  </span>
                </div>
                <Box className="pt-8 pb-4 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {dailyLogin.map((item, index) => {
                    const isSelected = index < currentUser?.loginDays;
                    return (
                      <Box
                        className={`${isSelected ? 'bg-green-500' : 'bg-zinc-500'} rounded-md py-1.5 flex`}
                        key={index}
                      >
                        <p className="flex flex-1 flex-col items-center justify-center text-xs space-y-1">
                          <span>Day {item.day}</span>
                          <img className="w-5 h-5" src="assets/images/gem2.png" alt="Star" />
                          <span>{item.coins}</span>
                        </p>
                      </Box>
                    );
                  })}
                </Box>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ClickerView;
