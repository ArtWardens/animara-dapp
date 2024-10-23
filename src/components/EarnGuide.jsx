import React, { useEffect, useRef, useState } from 'react';
import { PropTypes } from 'prop-types';

function EarnGuide({ openModal, setOpenModal, setIsOneTimeTaskOpen }) {

  const trigger = useRef(null);
  const modal = useRef(null);
  const [guideSlideUp, setGuideSlideUp] = useState(false);
  const [showBoosts, setShowBoosts] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showLeaderBoardOption, setShowLeaderBoardOption] = useState(false);

  // Toggle leaderboard component
  const handleLeaderBoardClick = () => {
    setOpenModal('leaderboard');
  };

  const handleUserUpgrades = () => {
    setOpenModal('upgrades');
  };

  const handleUserRecharge = () => {
    setOpenModal('boosts');
  };

   // intro animation
  useEffect(() => {
    // intro animations
    const guideSlide = setTimeout(() => {
      setGuideSlideUp(true);
    }, 400);

    const boostsTimer = setTimeout(() => {
      setShowBoosts(true);
    }, 700);

    const upgradesTimer = setTimeout(() => {
      setShowUpgrades(true);
    }, 600);

    const tasksTimer = setTimeout(() => {
      setShowTasks(true);
    }, 700);

    const showLeaderBoardOption = setTimeout(() => {
      setShowLeaderBoardOption(true);
    }, 700);

    return () => {
      clearTimeout(guideSlide);

      clearTimeout(boostsTimer);
      clearTimeout(upgradesTimer);
      clearTimeout(tasksTimer);
      clearTimeout(showLeaderBoardOption);
    };
  }, []);

  // close modal when clicking outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!modal.current) return;
      if (openModal === '' || modal.current.contains(target) || trigger.current.contains(target)) return;
      setOpenModal('');
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close modal when key donw outside
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (openModal === '' || keyCode !== 27) return;
      setOpenModal('');
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <>
      <div className="w-full flex flex-row justify-center items-center mt-[-8rem] md:mt-[-4rem] lg:mt-[-4rem] z-[50]">
        <div className={`flex w-full p-[1rem] rounded-b-3xl transition-opacity duration-500 ${guideSlideUp ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: 'url("/assets/images/clicker-character/button-footerBg.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full flex lg:hidden items-center justify-center">
              {/* Leaderboard button */}
              <div className={`flex items-center justify-center ${
                  showLeaderBoardOption ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                }`}>
                <img 
                  src="/assets/icons/leaderboard-mobile.webp" 
                  alt="leaderboard icon" 
                  className="w-[20rem] lg:w-[25rem] h-auto transition-all duration-300 hover:scale-110 " 
                  onClick={handleLeaderBoardClick}
                />
              </div>
            </div>

            {/* Bottom Panel buttons */}
            <div className="w-full flex flex-row items-center justify-center space-x-[0.05rem] lg:space-x-[2rem] lg:mt-[4rem]">
              <div
                className={`w-full relative rounded-3xl lg:rounded-2xl lg:w-auto flex justify-center items-center transition-transform duration-500 ease-in-out ${
                  showBoosts ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                <button
                  onClick={handleUserRecharge}
                  className="min-w-[100px] flex flex-col lg:flex-row px-[0.5rem] lg:px-[2.5rem] py-[1rem] mb-5 tracking-wider bg-[#49DEFF] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-2xl lg:rounded-full border-orange-300 justify-center items-center lg:gap-2 hover:bg-[#80E8FF] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A]  hover:scale-105 transition-transform duration-200 text-sm lg:text-xl font-bold font-outfit lg:whitespace-nowrap"
                >
                  <img
                    src="/assets/images/clicker-character/boosts-icon.png"
                    className="h-auto w-12"
                    alt="boosts-icon"
                  />
                  Boosts
                </button>
              </div>

              <div
                className={`w-full relative rounded-3xl lg:rounded-2xl lg:w-auto flex justify-center items-center transition-transform duration-500 ease-in-out ${
                  showUpgrades ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                <button
                  className="amax-h-[100px] flex flex-col lg:flex-row lg:pr-[3.5rem] px-[0.5rem] lg:px-[2.5rem] py-[1rem] mb-5 bg-[#FFB23F] tracking-wide shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-2xl lg:rounded-full border-orange-300 justify-center items-center lg:gap-2 hover:bg-[#FFDC62] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] hover:scale-105 transition-transform duration-200 text-xs lg:text-xl font-bold font-outfit lg:whitespace-nowrap"
                  onClick={handleUserUpgrades}
                >
                  <img 
                    src="/assets/images/clicker-character/star-icon.png" 
                    className="h-auto w-20 lg:w-24 mb-[-0.5rem] mt-[-0.5rem] lg:mt-0" alt="star-icon" 
                  />
                  Upgrades & Explore Animara
                </button>
              </div>

              <div
                className={`w-full relative rounded-3xl lg:rounded-2xl lg:w-auto flex justify-center items-center transition-transform duration-500 ease-in-out ${
                  showTasks ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
              >
                <button
                  className="min-w-[100px] flex flex-col lg:flex-row px-[1rem] lg:px-[2.5rem] py-[1rem] mb-5 tracking-wider bg-[#49DEFF] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-2xl lg:rounded-full border-orange-300 justify-center items-center lg:gap-2 hover:bg-[#80E8FF] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A]  hover:scale-105 transition-transform duration-200 text-sm lg:text-xl font-bold font-outfit lg:whitespace-nowrap"
                  onClick={() => setIsOneTimeTaskOpen(true)}
                >
                  <img
                    src="/assets/images/clicker-character/tasks-icon.png"
                    className="h-auto w-12"
                    alt="tasks-icon"
                  />
                  Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

EarnGuide.propTypes = {
  openModal: PropTypes.string,
  setOpenModal: PropTypes.func,
  setIsOneTimeTaskOpen: PropTypes.func,
};

export default EarnGuide;
