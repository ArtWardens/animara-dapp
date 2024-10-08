import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { MoonLoader } from 'react-spinners';
import ProgressBar from './FancyProgressBar/ProgressBar.tsx';
import { useLocalStamina, useRechargeLoading, useUserDetails, useUserDetailsLoading } from '../sagaStore/slices';
import TaskList from '../components/TaskList.jsx';
import MintingWarningNotice from './MintingWarningNotice.jsx';
import LeaderBoardModal from './LeaderBoardModal.jsx';

function EnergyRegeneration({ isOneTimeTaskOpen, setIsOneTimeTaskOpen }) {
  const currentUser = useUserDetails();
  const localStamina = useLocalStamina();
  const rechargingStamina = useRechargeLoading();
  const userDetailsLoading = useUserDetailsLoading();
  const [profitPerHour, setProfitPerHour] = useState('');
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [showFirstDiv, setShowFirstDiv] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [showLeaderBoardOption, setShowLeaderBoardOption] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isLeaderBoardOpen, setIsLeaderBoardOpen] = useState(false);

  // Toggle notice component
  const handleLeaderBoardClick = () => {
    setIsLeaderBoardOpen(true); 
  };

  const closeLeaderBoard = () => {
    setIsLeaderBoardOpen(false); 
  };

  // Toggle notice component
  const handleInfoClick = () => {
    setIsNoticeOpen(true); 
  };

  const closeNotice = () => {
    setIsNoticeOpen(false); 
  };

  // intro anim
  useEffect(() => {
    const firstDivTimer = setTimeout(() => {
      setShowFirstDiv(true);
    }, 300);

    const progressBarTimer = setTimeout(() => {
      setShowProgressBar(true);
    }, 500);

    const showLeaderBoardOption = setTimeout(() => {
      setShowLeaderBoardOption(true);
    }, 700);

    return () => {
      clearTimeout(firstDivTimer);
      clearTimeout(progressBarTimer);
      clearTimeout(showLeaderBoardOption);
    };
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    // update profit per hour
    setProfitPerHour(
      !currentUser?.profitPerHour || currentUser?.profitPerHour === 0 ? '-' : `${currentUser?.profitPerHour}`,
    );

    // update energy
    const energyPercentage = (localStamina / currentUser?.maxStamina) * 100;
    setProgressBarWidth(Math.max(0, Math.min(energyPercentage, 100)));
  }, [currentUser, localStamina]);

  return (
    <>
      <div className="flex flex-col xl:grid grid-cols-3 gap-3 justify-center items-center w-full mt-[-3rem] xl:mt-[4rem] z-[50]">
        {/* explora point display */}
        <div
          className={`flex items-center justify-center transition-opacity duration-700 ${
            showFirstDiv ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <div
            className="flex flex-row gap-1 py-3 xl:py-5 px-4 xl:px-6 rounded-3xl"
            style={{
              background: '#002b4c',
              backgroundBlendMode: 'multiply',
              boxShadow: '3px 2px 0px 0px #60ACFF inset',
            }}
          >
            <img src="/assets/icons/explora-point.webp" alt="profit icon" className="w-10 xl:w-16 h-10 xl:h-16 my-auto mr-2" />
            {userDetailsLoading ? (
              <div className="h-18 w-16 flex justify-center items-center">
                <MoonLoader size={25} color={'#80E8FF'} />
              </div>
            ) : (
              <div className="flex flex-col mr-[1rem] my-auto">
                <div className="text-[#00E0FF] text-2xl font-LuckiestGuy font-normal tracking-wider">
                  {profitPerHour}
                </div>
                <div className="text-white text-sm font-outfit">Explora Points</div>
              </div>
            )}
            <img src="/assets/icons/info-blue.webp" alt="info icon" className="w-8 h-8 my-auto mr-2 hover:scale-105" onClick={handleInfoClick}/>
          </div>
        </div>

        {/* Stamina bar */}
        <div
          className={`w-full px-6 transition-opacity duration-700 ${
            showProgressBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        >
          {rechargingStamina || userDetailsLoading ? (
            <div className="h-18 flex justify-center items-center">
              <MoonLoader size={25} color={'#80E8FF'} />
            </div>
          ) : (
            <ProgressBar
              score={progressBarWidth}
              label={'Stamina'}
              progressColor="#80E8FF"
              primaryColor="#49DEFF"
              secondaryColor="#FAFF00"
              darkTheme
              className="text-center border-2 border-white border-solid rounded-tl-3xl rounded-tr-md rounded-br-3xl rounded-bl-md pt-1 pb-2"
            />
          )}
        </div>

        {/* Leaderboard button */}
        <div className={`flex items-center justify-center ${
            showLeaderBoardOption ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}>
          <img 
            src="/assets/icons/leaderboard.webp" 
            alt="leaderboard icon" 
            className="w-[15rem] xl:w-[25rem] h-auto transition-all duration-300 hover:scale-110 " 
            onClick={handleLeaderBoardClick}
          />
        </div>
      </div>

      {isOneTimeTaskOpen && <TaskList setIsOneTimeTaskOpen={setIsOneTimeTaskOpen} />}

      {/* Conditionally render the LeaderBoard component */}
      {isLeaderBoardOpen && <LeaderBoardModal handleCloseLeaderboard={closeLeaderBoard} />}

      {/* Conditionally render the MintingVipPass component */}
      {isNoticeOpen && <MintingWarningNotice onClose={closeNotice} />}
    </>
  );
}

EnergyRegeneration.propTypes = {
  setIsLeaderboardOpen: PropTypes.func,
  isOneTimeTaskOpen: PropTypes.bool,
  setIsOneTimeTaskOpen: PropTypes.func,
};

export default EnergyRegeneration;
