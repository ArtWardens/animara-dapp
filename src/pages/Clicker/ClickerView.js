import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '../../hooks/storeHooks';
import { useUserDetails, useUserDetailsLoading, closeDailyPopup, updateDailyLogin, useUpdatePopupLoading, useIsOpenDailyPopup } from '../../sagaStore/slices';
import Header from "../../components/Header.jsx";
import MascotView from '../../components/MascotView';
import EarnGuide from '../../components/EarnGuide';
import EnergyRegeneration from '../../components/EnergyRegeneration';
import ClickerUpgrades from './ClickerUpgrades';
import { dailyLoginRewards } from '../../utils/constants';

const ClickerView = () => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const userDetailsLoading = useUserDetailsLoading();
  const updateLoading = useUpdatePopupLoading();
  const isOpenDailyPopup = useIsOpenDailyPopup();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isOneTimeTaskOpen, setIsOneTimeTaskOpen] = useState(false);
  const [openModal, setOpenModal] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  // Initialize
  useEffect(() => {
    // check and popup daily login
    if (currentUser && !currentUser?.loggedInToday) {
      dispatch(updateDailyLogin());
    }
  }, [currentUser, dispatch]);

  // intro anim
  useEffect(() => {
    if (isOpenDailyPopup) {
      const timerPanel = setTimeout(() => {
        setShowPanel(true);
        console.log("Panel shown:", true);
      }, 1000);
  
      return () => {
        clearTimeout(timerPanel);
      };
    }
  }, [isOpenDailyPopup]);

  const handleClose = () => {
    dispatch(closeDailyPopup());
  };

  if (userDetailsLoading || updateLoading) {
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
    
      <Header />

      <div className="max-w-full flex justify-center items-center relative">
        <EnergyRegeneration 
          isLeaderboardOpen={isLeaderboardOpen}
          setIsLeaderboardOpen={setIsLeaderboardOpen}
          isOneTimeTaskOpen={isOneTimeTaskOpen}
          setIsOneTimeTaskOpen={setIsOneTimeTaskOpen}
        />

        <MascotView
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
          <div className="fixed inset-0 bg-transparent backdrop-blur-xl rounded-xl flex justify-center items-center z-[200] overflow-hidden">
            <div className={`min-h-[800px] md:min-h-[unset] daily-reward-bg relative rounded-xl w-[100%] lg:max-w-[1100px] bg-no-repeat bg-cover md:bg-[length:100%_70%] lg:bg-contain transition-all duration-1000
            ${showPanel ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}
              style={{
                backgroundImage: `url("/assets/images/clicker-character/upgrades-details-bg.webp")`,
                backgroundPosition: "center",
              }}
            >
              {/* Close Button */}
              <button
                className="absolute top-[4rem] md:top-[13rem] lg:top-[10rem] xl:top-[8rem] right-[2.5rem] md:right-[5rem] text-white text-4xl hover:brightness-75"
                onClick={handleClose}
              >
                &times;
              </button>

              {/* Reward Content */}
              <div className="flex flex-col items-center 
                px-[2rem] pt-[4rem] pb-[6rem] 
                md:px-[3rem] md:pt-[14rem] md:pb-[15rem] 
                lg:px-[4rem] lg:pt-[8rem] lg:pb-[10rem]">
                <Box>
                  <video
                    src="/assets/videos/Daily_Reward_Anim.webm"
                    autoPlay
                    loop={true}
                    className="max-w-[8rem] lg:max-w-[9rem] pt-1"
                  />
                </Box>
                <div className="space-y-1 flex flex-col items-center pb-3">
                  <p className="text-[#FFAA00] text-[3rem] lg:text-[3.75rem] font-base text-center">Daily reward</p>
                  <span className="text-white font-outfit text-center font-">
                    Accure Coins For Loggin Into The Game Daily Without Skipping
                  </span>
                </div>
                <Box className="max-h-[450px] md:max-h-[250px] lg:max-h-[unset] overflow-y-auto py-3 pl-2 pr-4 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 custom-scrollbar">
                  {dailyLoginRewards.map((dayReward, index) => {
                    const isSelected = index < currentUser?.loginDays;
                    return (
                      <Box
                        className={`${isSelected ? 'bg-[#FFAA00]' : 'bg-[#3C3C3C]'} rounded-md py-1.5 flex transition-all duration-300 hover:scale-105 will-change-transform backface-hidden`}
                        key={index}
                      >
                        <p className={`flex flex-1 flex-col items-center justify-center text-xs space-y-1 ${isSelected ? 'text-white' : 'text-[#C5C5C5]'}`}>
                          <span className='font-outfit font-normal'>Day {index + 1}</span>
                          <img className="w-5 h-5" src={isSelected ? 'assets/images/coin.webp' : 'assets/images/coin-disable.webp'} alt="Star" />
                          <span>{dayReward}</span>
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
              onClose={() => setOpenModal('')} // Close modal when done
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ClickerView;
