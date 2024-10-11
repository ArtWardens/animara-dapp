import React, { useEffect, useState, useRef } from 'react';
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
  const [showWord, setShowWord] = useState(false); // State to manage word display after 2.5 seconds
  const [showCongratulations, setShowCongratulations] = useState(false); // Manage "Congratulations" visibility
  const audioRef = useRef(null);
  const audioSource = `/sounds/${currentUser?.level || 1}-successHits.mp3`;

  // grant depletion rewards when local stamina is fully consumed
  useEffect(() => {
    if (!currentUser || localStamina !== 0 || isOpenRewardModal || !currentUser.canGetDepletionReward) return;

    dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));

    if (audioRef.current) {
      audioRef.current.play();
    }

    // setIsOpenRewardModal(true);
  }, [dispatch, localStamina, localCoins, currentUser, isOpenRewardModal]);

  // Handler for when the audio finishes playing
  const handleAudioEnded = () => {
    setIsOpenRewardModal(true);
  };

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

  // Reward modal close handler
  const closeRewardModal = () => {
    setRewardModalFading(true);
    setTimeout(() => {
      setIsOpenRewardModal(false);
      setRewardModalFading(false);
      setShowWord(false);
      setShowCongratulations(false);
    }, 500);
  };

  const handleVideoPlay = () => {
    setTimeout(() => {
      setShowWord(true);
      setTimeout(() => {
        setShowWord(false);
      }, 3000);
    }, 2500);

    if (currentUser?.ownsNFT) {
      setTimeout(() => {
        setShowCongratulations(true);
        setTimeout(() => {
          setShowCongratulations(false);
        }, 3300);
      }, 7750);
    }
  };

  const videoSource = currentUser?.ownsNFT ? '/assets/images/boxCoin_full.webm' : '/assets/images/boxCoin_normal.webm';

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
            <div className="fixed inset-0 backdrop-blur-xl rounded-xl flex justify-center items-center z-[200] overflow-hidden">
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
                  xs:top-[6rem]
                  md:top-[12rem] md:right-[4rem]
                  lg:top-[10rem] lg:right-[5rem] 
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
                  <Box className="overflow-y-auto py-3 px-3 w-full grid grid-cols-2 gap-3 custom-scrollbar
                    max-h-[400px] xs:max-h-[320px]
                    sm:max-h-[400px] sm:grid-cols-3 
                    md:max-h-[350px] md:grid-cols-5
                    lg:max-h-[300px] lg:grid-cols-7
                    xl:max-h-[250px]
                  ">
                    {dailyLoginRewards
                    .slice(0, currentUser?.ownsNFT ? 28 : 14)
                    .map((dayReward, index) => {
                      const isSelected = index < currentUser?.loginDays;
                      return (
                        <Box
                          className={`${isSelected ? 'bg-[#FFAA00]' : 'bg-[#3C3C3C]'} rounded-md py-1.5 flex transition-all duration-300 hover:scale-105 will-change-transform backface-hidden`}
                          key={index}
                        >
                          <div className={`flex flex-1 flex-col h-20 lg:h-24 items-center justify-center text-sm space-y-1 gap-1 ${isSelected ? 'text-white' : 'text-[#C5C5C5]'}`}>
                            <span className='font-outfit font-based'>Day {index + 1}</span>
                            <DynamicNumberDisplay
                              number={dayReward}
                              divClassName={"block"}
                              imgClassName={"w-8 h-8 m-auto"}
                              imgSrc={isSelected ? 'assets/images/coin.webp' : 'assets/images/coin-disable.webp'}
                              spanClassName={`${isSelected ? 'text-white' : 'text-[#C5C5C5]'} flex items-center justify-center`}
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

          <audio 
            ref={audioRef} 
            src={audioSource}  // Dynamic audio source based on user's level
            onEnded={handleAudioEnded}  // When the audio finishes playing, open the modal
            style={{ display: 'none' }}  // Hide the audio player element
          />

          <Modal
            open={isOpenRewardModal}
            className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
          > 
            <div
              className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90 transition-opacity duration-500
                ${rewardModalFading ? 'opacity-0' : 'opacity-100'}
              `}
              style={{
                zIndex: 100,
              }}
            >
              <video
                src={videoSource}
                autoPlay
                loop={false}
                playsInline
                onEnded={closeRewardModal}
                onPlay={handleVideoPlay}
                className="absolute object-cover object-center w-full lg:w-auto h-auto lg:h-full"
              />

              <div
                className={`absolute text-[18vh] font-bold transition-all duration-1000 transform text-amber-500 tracking-normal
                ${showWord ? 'opacity-100 scale-150 pb-20 translate-x-0' : 'opacity-0 scale-0 pb-0 translate-x-6'}`}
                style={{
                  WebkitTextStrokeWidth: '0.45vh',
                  WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                }}
              >
                +{currentUser?.depletionReward}
              </div>

              <div
                className={`absolute text-[18vh] font-bold justify-center transition-all duration-1000 transform text-amber-500 tracking-normal
                ${showCongratulations ? 'opacity-100 scale-150 pb-20 translate-x-0' : 'opacity-0 scale-0 pb-0 translate-x-6'}`}
                style={{
                  WebkitTextStrokeWidth: '0.45vh',
                  WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                }}
              >
                {currentUser?.randomMultiplier}x
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ClickerView;
