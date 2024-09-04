import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { PropagateLoader } from "react-spinners";
import { useAppDispatch } from '../../hooks/storeHooks';
import { useUserDetails, useUserDetailsLoading, closeDailyPopup, updateDailyLogin, useDailyLoginLoading, useIsOpenDailyPopup } from '../../sagaStore/slices';
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
  const updateLoading = useDailyLoginLoading();
  const isOpenDailyPopup = useIsOpenDailyPopup();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isOneTimeTaskOpen, setIsOneTimeTaskOpen] = useState(false);
  const [openModal, setOpenModal] = useState("");

  // Initialize
  useEffect(() => {
    // check and popup daily login
    if (currentUser && !currentUser?.loggedInToday) {
      dispatch(updateDailyLogin());
    }
  }, [currentUser, dispatch]);

  const handleClose = () => {
    dispatch(closeDailyPopup());
  };

  if (userDetailsLoading || updateLoading) {
    return (
      <>
        <Header />

        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
          <PropagateLoader color={"#FFB23F"} />
        </div>
      </>
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

        {/* Login Reward Panel */}
        <Modal
          open={isOpenDailyPopup}
          className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
        >
          <div className="fixed inset-0 bg-transparent backdrop-blur-xl rounded-xl flex justify-center items-center z-[200] overflow-hidden">
            <div className="min-h-[800px] md:min-h-[unset] daily-reward-bg relative rounded-xl w-[100%] lg:w-[90%] lg:max-w-[800px] bg-no-repeat bg-cover md:bg-contain"
              style={{
                backgroundImage: `url("/assets/images/clicker-character/upgrades-details-bg.webp")`,
                backgroundPosition: "center",
              }}
            >
              {/* Close Button */}
              <button
                className="absolute top-[4rem] md:top-[12rem] lg:top-[8rem] right-[5rem] text-white text-4xl hover:brightness-75"
                onClick={handleClose}
              >
                &times;
              </button>

              {/* Reward Content */}
              <div className="flex flex-col items-center 
                px-[2rem] pt-[4rem] pb-[6rem] 
                md:px-[4rem] md:pt-[13rem] md:pb-[14rem] 
                lg:pt-[8rem] lg:pb-[10rem]">
                <Box>
                  <img className="max-w-[8rem] lg:max-w-[10rem]" src="assets/images/DailyRewards1.webp" alt="Daily Rewards" />
                </Box>
                <div className="space-y-1 flex flex-col items-center pb-3">
                  <p className="text-[#FFAA00] text-[3rem] lg:text-[3.75rem] font-base text-center">Daily reward</p>
                  <span className="text-white font-outfit text-center font-">
                    Accure Coins For Loggin Into The Game Daily Without Skipping
                  </span>
                </div>
                <Box className="max-h-[450px] md:max-h-[150px] overflow-y-scroll py-3 pr-2 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2 custom-scrollbar">
                  {dailyLoginRewards.map((dayReward, index) => {
                    const isSelected = index < currentUser?.loginDays;
                    return (
                      <Box
                        className={`${isSelected ? 'bg-[#FFAA00]' : 'bg-[#3C3C3C]'} rounded-md py-1.5 flex`}
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

        {/* Upgrade panel */}
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
