import React, { useEffect, useState, useCallback } from 'react';
import { PropTypes } from "prop-types";
import MascotView from '../../components/MascotView';
import EarnGuide from '../../components/EarnGuide';
import EnergyRegeneration from '../../components/EnergyRegeneration';
import '../../styles/globals.css';
import { mascots } from '../../utils/local.db';
import { addToLocalStorage, getFromLocalStorage } from '../../utils/localStorage';
import { handleUpdateCoins, handleUpdateClickByLevel } from '../../firebase/clicker';
import { handleUpdateUserRechargableEnergy, handleUpdateUserRechargableInvite } from '../../firebase/user';
import { fetchRewardRate } from '../../firebase/rewardRates';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '../../hooks/storeHooks';
import { closeDailyPopup, updateDailyLogin, useIsOpenDailyPopup } from '../../sagaStore/slices';
import { dailyLogin } from '../../data/constants';

const ClickerView = ({ currentUser, gameData, setGameData, totalClicks, setTotalClicks }) => {
  const dispatch = useAppDispatch();
  const isOpenDailyPopup = useIsOpenDailyPopup();
  const [isOpenRewardModal, setIsOpenRewardModal] = useState(false);
  const [modalOpen, handleOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [currentMascot] = useState(mascots[1]);
  const [delay, setDelay] = useState(true);
  const [countdown] = useState(30);

  
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
  const [inviteRechargable, setInviteRechargable] = useState(0);
  const [rewardRate, setRewardRate] = useState(null);

  const updateFirebase = useCallback(() => {
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
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser && !currentUser?.loggedInToday) {
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

      const rewardRate = await fetchRewardRate();
      setRewardRate(rewardRate);

      if (currentUser && rewardRate) {
        setTimeout(() => {
          setGameData({
            mascot2: {
              numberOfClicks: 0,
              point: 0,
              quest: 0,
              energy: rewardRate.stamina,
              level: currentUser.level,
              clickByLevel: currentUser.clickByLevel,
              levelProgress: 0,
            },
            totalPoints: 0,
            currentScore: currentUser.coins,
          });
          setLoading(false);
        }, 1000);
      }

      if (currentUser?.energyRechargable) {
        setEnergyRechargable(currentUser.energyRechargable);
      }

      if (currentUser?.inviteRechargable) {
        setInviteRechargable(currentUser.inviteRechargable);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      updateFirebase();
    }, 10000);

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
      clearInterval(interval);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentUser, dispatch, updateFirebase]);

  const handleUpdateRechargableEnergy = () => {
    if (currentUser) {
      handleUpdateUserRechargableEnergy({
        userId: currentUser.userId,
        count: currentUser.energyRechargable - 1
      });
      setEnergyRechargable(prev => prev - 1);
      addToLocalStorage("LocalClickByLevel", 0);
      setGameData((prev) => ({
        ...prev,
        mascot2: {
          ...prev.mascot2,
          clickByLevel: 0,
        },
      }));
    }
  };

  const handleUpdateRechargableInvite = () => {
    if (currentUser) {
      handleUpdateUserRechargableInvite({
        userId: currentUser.userId,
        count: currentUser.inviteRechargable - 1
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
  };

  const handleClose = () => {
    dispatch(closeDailyPopup());
  };

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isOneTimeTaskOpen, setIsOneTimeTaskOpen] = useState(false);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <svg
            aria-hidden="true"
            className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-auto"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="text-white text-xl">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-full flex justify-center items-center relative">
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
              <div className="flex flex-col items-center p-6 sm:p-8">
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

ClickerView.propTypes = {
  currentUser: PropTypes.object,
  gameData: PropTypes.object,
  setGameData: PropTypes.func,
  totalClicks: PropTypes.number,
  setTotalClicks: PropTypes.func
};

export default ClickerView;
