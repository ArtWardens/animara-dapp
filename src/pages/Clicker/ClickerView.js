import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '../../hooks/storeHooks';
import { useUserDetails, closeDailyPopup, updateDailyLogin, useIsOpenDailyPopup, settleTapSession, useLocalStamina, useLocalCoins, } from '../../sagaStore/slices';
import MascotView from '../../components/MascotView';
import EarnGuide from '../../components/EarnGuide';
import EnergyRegeneration from '../../components/EnergyRegeneration';
import ClickerUpgrades from './ClickerUpgrades';
import { dailyLoginRewards } from '../../utils/constants';
import DynamicNumberDisplay from '../../components/DynamicNumberDisplay';

const ClickerView = () => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const localCoins = useLocalCoins();
  const localStamina = useLocalStamina();
  const isOpenDailyPopup = useIsOpenDailyPopup();
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isOneTimeTaskOpen, setIsOneTimeTaskOpen] = useState(false);
  const [openModal, setOpenModal] = useState("");
  const [showPanel, setShowPanel] = useState(false);
  const [isOpenRewardModal, setIsOpenRewardModal] = useState(false);  
  const [rewardModalFading, setRewardModalFading] = useState(false);

  // grant depletion rewards when local stamina is fully consumed
  useEffect(() => {
    if (!currentUser || localStamina !== 0 || isOpenRewardModal || !currentUser.canGetDepletionReward) return;

    dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
    setIsOpenRewardModal(true);
  }, [dispatch, localStamina, localCoins, currentUser, isOpenRewardModal]);

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

  const closeRewardModal = () => {
    setRewardModalFading(true);
    setTimeout(() => {
      setIsOpenRewardModal(false);
      setRewardModalFading(false);
    }, 500);
  };

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
    <div className="w-full min-w-[450px] max-w-[90dvw] xs:min-h-[800px] flex justify-center mt-[-1rem] lg:mt-0">
      <div 
        className="relative w-full min-h-[800px] max-h-[90dvh] h-auto rounded-3xl p-3 transition-all duration-300"
        style={{
          border: '2px solid var(--Color, #F4FBFF)',
          background: 'rgba(155, 231, 255, 0.58)',
          boxShadow: '0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)',
          backdropFilter: 'blur(15px)',
        }}
      >
        <div className="absolute flex w-full justify-between -top-9 z-[50]">
          <img
            src={"/assets/images/clicker-character/ring01.webp"}
            alt="ring"
            className="object-cover w-12 absolute left-2"
          />
          <img
            src={"/assets/images/clicker-character/ring02.webp"}
            alt="ring"
            className="object-cover w-12 absolute right-8"
          />
        </div>

        <div className="w-full min-h-[800px] xl:min-h-[80dvh] h-full flex flex-col justify-start items-center rounded-3xl"
          style={{
            backgroundImage: 'url("/assets/images/clicker-character/mascotBg.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <EnergyRegeneration 
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
            <div className="fixed inset-0  backdrop-blur-xl rounded-xl flex justify-center items-center z-[200] overflow-hidden">
              <div className={`min-h-[800px] w-[100%] relative rounded-xl 
              daily-reward-bg bg-no-repeat bg-cover
              md:min-h-[unset] md:bg-[length:100%_70%] 
              lg:max-w-[1100px] lg:bg-contain 
              transition-all ease-in-out duration-500
              ${showPanel ? `scale-100` : `scale-0`}`}
                style={{
                  backgroundImage: `url("/assets/images/clicker-character/upgrades-details-bg.webp")`,
                  backgroundPosition: "center",
                }}
              >
                {/* Close Button */}
                <button
                  className="absolute top-[6rem] right-[2.5rem] text-white text-4xl hover:brightness-75
                  xs:top-[4rem]
                  md:top-[13rem] md:right-[5rem]
                  lg:top-[10rem] lg:right-[6rem] 
                  xl:top-[8rem]" 
                  onClick={handleClose}
                >
                  &times;
                </button>

                {/* Reward Content */}
                <div className="flex flex-col items-center 
                  px-[2rem] pt-[8rem] pb-[4rem] 
                  xs:pt-[4rem] xs:pb-[6rem] 
                  md:px-[3rem] md:pt-[14rem] md:pb-[15rem] 
                  lg:px-[4rem] lg:pt-[8rem] lg:pb-[10rem]">
                  <Box>
                    <video
                      src="https://storage.animara.world/daily-login-reward.webm"
                      autoPlay
                      playsInline
                      loop={true}
                      className="max-w-[8rem] lg:max-w-[9rem] pt-1"
                    />
                  </Box>
                  <div className="space-y-1 flex flex-col items-center py-3">
                    <p className="text-[#FFAA00] text-[1.5rem] xs:text-[3rem] lg:text-[3.75rem] font-base text-center pb-3">Daily reward</p>
                    <span className="text-white text-sm xs:text-base font-outfit text-center font-normal">
                      Accure Coins For Loggin Into The Game Daily Without Skipping
                    </span>
                  </div>
                  <Box className="max-h-[300px] overflow-y-auto py-3 pl-2 pr-4 w-full grid grid-cols-2 gap-2 custom-scrollbar
                    xs:max-h-[400px]
                    sm:max-h-[450px] sm:grid-cols-3 
                    md:max-h-[250px] md:grid-cols-5
                    lg:max-h-[unset] lg:grid-cols-7">
                    {dailyLoginRewards.map((dayReward, index) => {
                      const isSelected = index < currentUser?.loginDays;
                      return (
                        <Box
                          className={`${isSelected ? 'bg-[#FFAA00]' : 'bg-[#3C3C3C]'} rounded-md py-1.5 flex transition-all duration-300 hover:scale-105 will-change-transform backface-hidden`}
                          key={index}
                        >
                          <div className={`flex flex-1 flex-col items-center justify-center text-xs space-y-1 ${isSelected ? 'text-white' : 'text-[#C5C5C5]'}`}>
                            <span className='font-outfit font-normal'>Day {index + 1}</span>
                            <DynamicNumberDisplay 
                              number={dayReward}
                              divClassName={"block"}
                              imgClassName={"w-5 h-5 m-auto"}
                              imgSrc={isSelected ? 'assets/images/coin.webp' : 'assets/images/coin-disable.webp'}
                              spanClassName={isSelected ? 'text-white' : 'text-[#C5C5C5]'}
                            />
                          </div>
                        </Box>
                      );
                    })}
                  </Box>
                </div>
              </div>
            </div>
          </Modal>

          {/* Upgrade panel */}
          <Modal
            open={openModal === 'upgrades'}
            className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
          >
            <ClickerUpgrades
              onClose={() => setOpenModal('')} // Close modal when done
            />
          </Modal>

          <Modal
            open={isOpenRewardModal}
            className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
          > 
            <div
              className={`fixed inset-0 flex bg-dark bg-opacity-75 justify-center items-center z-[999] transition-opacity duration-500 ${rewardModalFading ? 'opacity-0' : 'opacity-100'}`}
            >
              <video
                src="https://storage.animara.world/depletion-reward-w-number.webm"
                autoPlay
                loop={false}
                muted
                playsInline
                onEnded={closeRewardModal}
                className="object-cover w-full h-full"
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ClickerView;
