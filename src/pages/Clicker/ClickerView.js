import React, { useEffect, useState, useRef } from 'react';
import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useAppDispatch } from '../../hooks/storeHooks';
import { useUserDetails, closeDailyPopup, updateDailyLogin, useIsOpenDailyPopup, useSettleTapSessionLoading, useSettleTapSessionLoadSuccess, settleTapSession, useLocalStamina, useLocalCoins, getUser } from '../../sagaStore/slices';
import MascotView from '../../components/MascotView';
import EarnGuide from '../../components/EarnGuide';
import EnergyRegeneration from '../../components/EnergyRegeneration';
import ClickerUpgrades from './ClickerUpgrades';
import { dailyLoginRewards } from '../../utils/constants';
import DynamicNumberDisplay from '../../components/DynamicNumberDisplay';
import LeaderBoardModal from '../../components/LeaderBoardModal';
import RechargeModal from '../../components/RechargeModal';

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
  const settlingTapSession = useSettleTapSessionLoading();
  const settlingTapSessionLoaded = useSettleTapSessionLoadSuccess();
  const effectiveLevel = (currentUser?.level - 1) % 20 + 1;
  const audioRef = useRef(null);
  const audioSource = `https://storage.animara.world/${effectiveLevel || 1}-successHits.mp3`;
  
  // grant depletion rewards when local stamina is fully consumed
  useEffect(() => {
    if (!currentUser || localStamina !== 0 || isOpenRewardModal || !currentUser.canGetDepletionReward) return;
    dispatch(settleTapSession({ newCointAmt: localCoins, newStamina: localStamina }));
    // console.log("clicker view dispatching");
    // console.log(currentUser?.coins, " vs", localCoins);
    // console.log(currentUser?.stamina, " vs", localStamina);
    // Dispatch might be slow due to internet speed or cpu slow
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [dispatch, localStamina, localCoins, currentUser, isOpenRewardModal]);

  // Handler for when the audio finishes playing
  const handleAudioEnded = () => {
    setIsOpenRewardModal(true);
  };

  // Initialize
  useEffect(() => {
    if (!currentUser) return;
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
      dispatch(getUser());
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

  const videoSource = currentUser?.ownsNFT ? 'https://storage.animara.world/boxCoin_full.webm' : 'https://storage.animara.world/boxCoin_normal.webm';

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

          {/* Boosts panel */}
          <Modal
            open={openModal === 'boosts'}
            className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
          >
            <div>
              <RechargeModal onClose={() => setOpenModal('')} />  
            </div>
          </Modal>

          {/* Upgrade panel */}
          <Modal
            open={openModal === 'upgrades'}
            className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
          >
            <div>
              <ClickerUpgrades onClose={() => setOpenModal('')} />
            </div>
          </Modal>

          <Modal
            open={openModal === 'leaderboard'}
            className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
          >
            <div>
              <LeaderBoardModal onClose={() => setOpenModal('')} />
            </div>
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
          {settlingTapSession && !settlingTapSessionLoaded ? (
            // loader
            <div
                className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90 transition-opacity duration-500 scale-150 lg:scale-100
                  ${rewardModalFading ? 'opacity-0' : 'opacity-100'}
                `}
                style={{
                  zIndex: 100,
                }}
              >
                <div className="w-full pt-4 flex align-middle justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-Fuchsia-200 animate-spin dark:text-Fuchsia-200 fill-yellow-600"
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
                </div>
              </div>
              ) : (
              <div
                className={`fixed top-0 flex flex-col h-full w-full items-center justify-center bg-dark/90 transition-opacity duration-500 scale-150 lg:scale-100
                  ${rewardModalFading ? 'opacity-0' : 'opacity-100'}
                `}
                style={{
                  zIndex: 100,
                }}
              >
                <video
                  autoPlay
                  loop={false}
                  playsInline
                  onEnded={closeRewardModal}
                  onPlay={handleVideoPlay}
                  className="absolute object-cover object-center w-full lg:w-auto h-auto lg:h-full"
                >
                  <source src={videoSource} type="video/webm" />
                </video>

                <div
                  className={`absolute text-[12vh] lg:text-[18vh] font-bold justify-center transition-all duration-1000 transform text-amber-500 tracking-normal
                  ${showWord ? 'opacity-100 scale-150 pb-8 lg:pb-20 translate-x-0' : 'opacity-0 scale-0 pb-0 translate-x-6'}`}
                  style={{
                    WebkitTextStrokeWidth: '0.45vh',
                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                  }}
                >
                  {currentUser?.ownsNFT 
                      ? `${currentUser?.randomMultiplier ?? 1.1}x`
                      : `+${currentUser?.depletionReward ?? 0}`
                  }
                </div>

                <div
                  className={`absolute text-[12vh] lg:text-[18vh] font-bold justify-center transition-all duration-1000 transform text-amber-500 tracking-normal
                  ${showCongratulations ? 'opacity-100 scale-150 pb-8 lg:pb-20 translate-x-0' : 'opacity-0 scale-0 pb-0 translate-x-6'}`}
                  style={{
                    WebkitTextStrokeWidth: '0.45vh',
                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                  }}
                >
                    +{currentUser?.randomMultiplier * currentUser?.depletionReward}
                </div>
              </div>
              )}
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ClickerView;
