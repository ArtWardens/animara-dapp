import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '../../hooks/storeHooks';
import { useUserDetails, closeDailyPopup, updateDailyLogin, useIsOpenDailyPopup } from '../../sagaStore/slices';
import MascotView from '../../components/MascotView';
import EarnGuide from '../../components/EarnGuide';
import EnergyRegeneration from '../../components/EnergyRegeneration';
import ClickerUpgrades from './ClickerUpgrades';
import { dailyLoginRewards } from '../../utils/constants';

const ClickerView = () => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const isOpenDailyPopup = useIsOpenDailyPopup();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isOneTimeTaskOpen, setIsOneTimeTaskOpen] = useState(false);
  const [openModal, setOpenModal] = useState("");
  const [showPanel, setShowPanel] = useState(false);

  // Initialize
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    // check and popup daily login
    if (!currentUser?.loggedInToday) {
      dispatch(updateDailyLogin());
    }
  }, [currentUser, dispatch]);

  // intro anim
  useEffect(() => {
    if (isOpenDailyPopup) {
      const timerPanel = setTimeout(() => {
        setShowPanel(true);
      }, 500);
  
      return () => {
        clearTimeout(timerPanel);
      };
    }
  }, [isOpenDailyPopup]);

  const handleClose = () => {
    setShowPanel(false);
    const timerPanel = setTimeout(() => {
      dispatch(closeDailyPopup());
    }, 500);

    return () => {
      clearTimeout(timerPanel);
    };
  };

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
            <div className={`min-h-[800px] md:min-h-[unset] daily-reward-bg relative rounded-xl w-[100%] lg:max-w-[1100px] bg-no-repeat bg-cover md:bg-[length:100%_70%] lg:bg-contain 
            transition-all ease-in-out duration-500
            ${showPanel ? `scale-100` : `scale-0`}`}
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
                    src="https://storage.animara.world/daily-login-reward.webm"
                    autoPlay
                    loop={true}
                    className="max-w-[8rem] lg:max-w-[9rem] pt-1"
                  />
                </Box>
                <div className="space-y-1 flex flex-col items-center pb-3">
                  <p className="text-[#FFAA00] text-sm xs:text-[3rem] lg:text-[3.75rem] font-base text-center">Daily reward</p>
                  <span className="text-white text-sm xs:text-base font-outfit text-center font-normal">
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

        {/* Upgrade panel */}
        {openModal === 'upgrades' && (
          <ClickerUpgrades
            onClose={() => setOpenModal('')} // Close modal when done
          />
        )}
      </div>
    </>
  );
};

export default ClickerView;
