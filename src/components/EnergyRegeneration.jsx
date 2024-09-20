import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { MoonLoader } from 'react-spinners';
import ProgressBar from './FancyProgressBar/ProgressBar.tsx';
import { getTimeRemaining } from '../utils/getTimeRemaining';
import { useLocalStamina, useRechargeLoading, useUserDetails, useUserDetailsLoading } from '../sagaStore/slices';
import TaskList from '../components/TaskList.jsx';
import LeaderBoardModal from '../components/LeaderBoardModal.jsx';

function EnergyRegeneration({ isLeaderboardOpen, setIsLeaderboardOpen, isOneTimeTaskOpen, setIsOneTimeTaskOpen }) {
  const currentUser = useUserDetails();
  const localStamina = useLocalStamina();
  const rechargingStamina = useRechargeLoading();
  const userDetailsLoading = useUserDetailsLoading();
  const [profitPerHour, setProfitPerHour] = useState('');
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
  const [showFirstDiv, setShowFirstDiv] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [countDownRemaining] = useState(0);

  // intro anim
  useEffect(() => {
    const firstDivTimer = setTimeout(() => {
      setShowFirstDiv(true);
    }, 300);

    const progressBarTimer = setTimeout(() => {
      setShowProgressBar(true);
    }, 500);

    return () => {
      clearTimeout(firstDivTimer);
      clearTimeout(progressBarTimer);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
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
      <div
        className="absolute flex flex-col xl:grid grid-cols-3 gap-3 justify-center items-center w-full mx-auto pt-8 xl:px-12 top-[8rem] xl:top-60 z-[99]"
      >
        {/* explora point display */}
        <div
          className={`items-center justify-center transition-opacity duration-700 ${
            showFirstDiv ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <div
            className="flex gap-1 py-5 px-6 rounded-3xl"
            style={{
              background: '#0764BA',
              backgroundBlendMode: 'multiply',
              boxShadow: '3px 2px 0px 0px #60ACFF inset',
            }}
          >
            <img src="/assets/icons/explora-point.webp" alt="profit icon" className="w-16 h-16 my-auto mr-2" />
            {userDetailsLoading ? (
              <div className="h-18 w-16 flex justify-center items-center">
                <MoonLoader size={25} color={'#80E8FF'} />
              </div>
            ) : (
              <div className="flex flex-col mr-[5rem] my-auto">
                <div className="text-[#00E0FF] text-2xl font-LuckiestGuy font-normal tracking-wider">
                  {profitPerHour}
                </div>
                <div className="text-white text-sm font-outfit">Explora Points</div>
              </div>
            )}
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
      </div>

      {isOneTimeTaskOpen && <TaskList setIsOneTimeTaskOpen={setIsOneTimeTaskOpen} />}

      {isLeaderboardOpen && (
        <div
          className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${
            isLeaderboardOpen ? 'block' : 'hidden'
          }`}
          style={{
            zIndex: 99,
          }}
        >
          <LeaderBoardModal
            timeRemaining={timeRemaining}
            countdown={countDownRemaining}
            setIsLeaderBoardOpen={setIsLeaderboardOpen}
          />
        </div>
      )}
    </>
  );
}

EnergyRegeneration.propTypes = {
  isLeaderboardOpen: PropTypes.bool,
  setIsLeaderboardOpen: PropTypes.func,
  isOneTimeTaskOpen: PropTypes.bool,
  setIsOneTimeTaskOpen: PropTypes.func,
};

export default EnergyRegeneration;
