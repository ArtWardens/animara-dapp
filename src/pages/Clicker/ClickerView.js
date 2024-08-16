import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '../../hooks/storeHooks';
import { useUserDetails, useUserDetailsLoading, closeDailyPopup, updateDailyLogin, useIsOpenDailyPopup } from '../../sagaStore/slices';
import MascotView from '../../components/MascotView';
import EarnGuide from '../../components/EarnGuide';
import EnergyRegeneration from '../../components/EnergyRegeneration';
import { mascots } from '../../utils/local.db';
import { dailyLogin } from '../../data/constants';
import ClickerUpgrades from './ClickerUpgrades';
import '../../styles/globals.css';

const ClickerView = () => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const userDetailsLoading = useUserDetailsLoading();
  const isOpenDailyPopup = useIsOpenDailyPopup();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isOneTimeTaskOpen, setIsOneTimeTaskOpen] = useState(false);
  const [openModal, setOpenModal] = useState("");
  const [currentMascot, setCurrentMascot] = useState(mascots[0]);

  // fetch user data
  useEffect(() => {
    // set mascot
    setCurrentMascot(mascots[currentUser?.level]);

    // check and popup daily login
    if (currentUser && !currentUser?.loggedInToday) {
      dispatch(updateDailyLogin());
    }
  }, [currentUser, dispatch]);

  const handleClose = () => {
    dispatch(closeDailyPopup());
  };

  if (userDetailsLoading) {
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
          isLeaderboardOpen={isLeaderboardOpen}
          setIsLeaderboardOpen={setIsLeaderboardOpen}
          isOneTimeTaskOpen={isOneTimeTaskOpen}
          setIsOneTimeTaskOpen={setIsOneTimeTaskOpen}
        />

        <MascotView
          currentMascot={currentMascot}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />

        <EarnGuide
          openModal={openModal}
          setOpenModal={setOpenModal}
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

        {openModal === 'upgrades' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <ClickerUpgrades
              onClose={() => handleOpenModal(false)} // Close modal when done
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ClickerView;
