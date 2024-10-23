import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { MoonLoader } from 'react-spinners';
import Modal from '@mui/material/Modal';
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

  // Toggle leaderboard component
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
      <div className="flex flex-col lg:grid grid-cols-3 justify-center items-center w-full mt-[-1.25rem] lg:mt-[3rem] z-[50]">
        {/* explora point display */}
        <div
          className={`flex items-center justify-center transition-opacity duration-700 mx-20 ${showFirstDiv ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <div
            className="flex flex-row gap-1 py-2 lg:py-5 px-4 lg:px-6 rounded-full lg:rounded-3xl items-center w-[46vh] lg:w-auto"
            style={{
              background: '#002b4c',
              backgroundBlendMode: 'multiply',
              boxShadow: '3px 2px 0px 0px #60ACFF inset',
            }}
          >
            <img
              src="/assets/icons/explora-point.webp"
              alt="profit icon"
              className="w-8 lg:w-16 h-8 lg:h-16 mr-2"
            />
            {userDetailsLoading ? (
              <div className="h-16 w-16 lg:h-18 lg:w-16 flex items-center">
                <MoonLoader size={24} color={'#80E8FF'} />
              </div>
            ) : (
              <div className="flex flex-row lg:flex-col w-full lg:w-none items-center lg:items-start mr-[1rem] gap-8 lg:gap-0 p-0 m-0 justify-between">
                <div className="text-[#00E0FF] text-xl lg:text-2xl font-LuckiestGuy font-normal tracking-wider lg:mr-0 pt-1 lg:pt-0">
                  {profitPerHour}
                </div>
                <div className="text-white text-xs lg:text-sm font-outfit">
                  Explora Points
                </div>
              </div>
            )}
            <img
              src="/assets/icons/info-blue.webp"
              alt="info icon"
              className="w-5 h-5 lg:w-8 lg:h-8 lg:mr-2 hover:scale-105"
              onClick={handleInfoClick}
            />
          </div>


        </div>

        {/* Stamina bar */}
        <div
          className={`w-full scale-[65%] lg:scale-100 px-0 transition-opacity duration-700 ${showProgressBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
          {rechargingStamina || userDetailsLoading ? (
            <div className="h-18 flex justify-center items-center">
              <MoonLoader size={25} color={'#80E8FF'} />
            </div>
          ) : (
            <>
              <ProgressBar
                score={progressBarWidth}
                label={'Stamina'}
                progressColor="#80E8FF"
                primaryColor="#49DEFF"
                secondaryColor="#FAFF00"
                darkTheme
                className="text-center text-md lg:text-lg border-2 border-white border-solid rounded-tl-3xl backdrop-blur-md bg-white/20 rounded-tr-md rounded-br-3xl rounded-bl-md pt-1 pb-3"
                style={{ textShadow: '3px 3px 6px rgba(0, 0, 0, 0.25)' }}
              />
              <div
                className="text-white text-lg lg:text-xl font-outfit font-based mt-2 tracking-wide"
                style={{ textShadow: '3px 3px 6px rgba(0, 0, 0, 0.35)' }}
              >
                <span className='text-amber-500 font-extrabold'>12 Hour </span> Energy cooldown
              </div>
            </>
          )}
        </div>

        {/* Leaderboard button */}
        <div className={`hidden lg:flex items-center justify-center ${showLeaderBoardOption ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}>
          <img
            src="/assets/icons/leaderboard.webp"
            alt="leaderboard icon"
            className="w-[15rem] lg:w-[25rem] h-auto transition-all duration-300 hover:scale-110 "
            onClick={handleLeaderBoardClick}
          />
        </div>
      </div>

      {/* Conditionally render the TaskList component */}
      <Modal
        open={isOneTimeTaskOpen}
        className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
      >
        <div>
          <TaskList setIsOneTimeTaskOpen={setIsOneTimeTaskOpen} />
        </div>
      </Modal>

      {/* Conditionally render the LeaderBoard component */}
      <Modal
        open={isLeaderBoardOpen}
        className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
      >
        <div>
          <LeaderBoardModal onClose={closeLeaderBoard} />
        </div>
      </Modal>

      {/* Conditionally render the MintingVipPass component */}
      <Modal
        open={isNoticeOpen}
        className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
      >
        <div>
          <MintingWarningNotice onClose={closeNotice} />
        </div>
      </Modal>
    </>
  );
}

EnergyRegeneration.propTypes = {
  setIsLeaderboardOpen: PropTypes.func,
  isOneTimeTaskOpen: PropTypes.bool,
  setIsOneTimeTaskOpen: PropTypes.func,
};

export default EnergyRegeneration;
