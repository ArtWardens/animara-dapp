import React, { useEffect, useRef, useState } from 'react';
import { PropTypes } from 'prop-types';
import { useUserDetails, useLocalStamina, useRechargeLoading, rechargeStamina } from '../sagaStore/slices';
import { useAppDispatch } from '../hooks/storeHooks.js';
import { StaminaRechargeTypeBasic, StaminaRechargeTypeInvite } from '../utils/constants';
import ReferPopup from './ReferPopup';

function EarnGuide({ openModal, setOpenModal, setIsOneTimeTaskOpen }) {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const localStamina = useLocalStamina();
  const rechargeLoading = useRechargeLoading();
  const trigger = useRef(null);
  const modal = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [enableStaminaRecharge, setEnableStaminaRecharge] = useState(false);
  const [enableInviteRecharge, setEnableInviteRecharge] = useState(false);
  const [guideSlideUp, setguideSlideUp] = useState(false);
  const [showBoosts, setShowBoosts] = useState(false);
  const [showUpgrades, setShowUpgrades] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [isRecharging, setIsRecharging] = useState(false);
  const [boosterSelected, setBoosterSelected] = useState(0);

  const handleUserUpgrades = () => {
    setOpenModal('upgrades');
  };

  const closeModal = () => {
    setOpenModal('');
  };

  const handleChargeEnergy = () => {
    setBoosterSelected(0);
    if (currentUser.staminaRechargeRemaining > 0 && enableStaminaRecharge) {
      setIsRecharging(true);
      dispatch(rechargeStamina({ opType: StaminaRechargeTypeBasic }));
    }
  };

  const handleChargeEnergyByInvite = () => {
    setBoosterSelected(1);
    if (currentUser.inviteRechargeRemaining > 0 && enableInviteRecharge) {
      setShowPopup(true);
    }
  };

  const handleReferCompletion = () => {
    setIsRecharging(true);
    dispatch(rechargeStamina({ opType: StaminaRechargeTypeInvite }));
    setShowPopup(false);
  };

  // intro animation
  useEffect(() => {
    const guideSlide = setTimeout(() => {
      setguideSlideUp(true);
    }, 400);

    const boostsTimer = setTimeout(() => {
      setShowBoosts(true);
    }, 700);

    const upgradesTimer = setTimeout(() => {
      setShowUpgrades(true);
    }, 800);

    const tasksTimer = setTimeout(() => {
      setShowTasks(true);
    }, 900);

    return () => {
      clearTimeout(guideSlide);

      clearTimeout(boostsTimer);
      clearTimeout(upgradesTimer);
      clearTimeout(tasksTimer);
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

  // auto close modal after energy recharge
  useEffect(() => {
    if (openModal === 'boosts' && isRecharging && !rechargeLoading) {
      setIsRecharging(false);
      setOpenModal('');
    }
  }, [openModal, isRecharging, rechargeLoading, setOpenModal]);

  // lock stamina recharge when max stamina
  useEffect(() => {
    if (localStamina !== currentUser?.maxStamina) {
      setEnableStaminaRecharge(true);
      setEnableInviteRecharge(true);
    } else {
      setEnableStaminaRecharge(false);
      setEnableInviteRecharge(false);
    }
  }, [currentUser, localStamina]);

  return (
    <>
      <div className="absolute bottom-[0rem] xl:bottom-24 flex justify-center w-full xl:w-[80%] h-[30dvh] xl:h-44 pb-8">
        <img
          src={'/assets/images/clicker-character/button-footerBg.webp'}
          alt="ring"
          className={`absolute inset-0 w-full h-full object-cover rounded-b-3xl transition-opacity duration-500 ${
            guideSlideUp ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
        />

        <div className="flex flex-row justify-center space-x-[0.5rem] xl:space-x-[2rem] w-full mt-[5rem]">
          <div
            className={`w-full relative rounded-3xl xl:rounded-2xl xl:w-auto flex justify-center items-center xl:items-end transition-transform duration-500 ease-in-out ${
              showBoosts ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <button
              className="px-[3rem] py-[1rem] mb-5 tracking-wider bg-[#49DEFF] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#80E8FF] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200 text-xl font-bold font-outfit whitespace-nowrap"
              onClick={() => setOpenModal('boosts')}
            >
              <img
                src="/assets/images/clicker-character/boosts-icon.webp"
                className="h-auto w-[2dvw]"
                alt="boosts-icon"
              />
              Boosts
            </button>
          </div>

          <div
            className={`w-full relative rounded-3xl xl:rounded-2xl xl:w-auto flex justify-center items-center xl:items-end transition-transform duration-500 ease-in-out ${
              showUpgrades ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <button
              className="px-[2rem] py-[1rem] mb-5 tracking-wider bg-[#FFB23F] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#FFDC62] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200 text-xl font-bold font-outfit whitespace-nowrap"
              onClick={handleUserUpgrades}
            >
              <img src="/assets/images/clicker-character/star-icon.webp" className="h-auto w-[2dvw]" alt="star-icon" />
              Upgrades & Explore Animara
            </button>
          </div>

          <div
            className={`w-full relative rounded-3xl xl:rounded-2xl xl:w-auto flex justify-center items-center xl:items-end transition-transform duration-500 ease-in-out ${
              showTasks ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            <button
              className="px-[2.5rem] py-[1rem] mb-5 tracking-wider bg-[#49DEFF] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#80E8FF] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200 text-xl font-bold font-outfit whitespace-nowrap"
              onClick={() => setIsOneTimeTaskOpen('true')}
            >
              <img
                src="/assets/images/clicker-character/tasks-icon.webp"
                className="h-auto w-[2dvw]"
                alt="tasks-icon"
              />
              Tasks
            </button>
          </div>
        </div>
      </div>

      {openModal === 'leaderboard' && (
        <div
          className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${openModal ? 'animate-openModal' : 'animate-modalClose'}`}
          style={{
            zIndex: 90,
          }}
        >
          <div
            ref={modal}
            onFocus={() => setOpenModal('test')}
            onBlur={() => setOpenModal('')}
            className="w-full md:w-2/3 h-full md:h-2/3 px-8 py-12 text-center md:px-[70px] md:py-[60px]"
            style={{
              backgroundImage: 'url("/assets/images/leaderboardExp.webp")',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          ></div>
        </div>
      )}

      {openModal === 'boosts' && (
        <div
          className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-4`}
          style={{
            zIndex: 90,
          }}
        >
          <div
            className={`relative min-w-full md:min-w-[75%] min-h-[75%] max-w-[1200px] rounded-[20px] text-center bg-cover sm:bg-contain bg-no-repeat bg-center px-8 py-8 sm:px-[4rem] sm:py-[12rem] md:px-[6rem] md:py-[10rem] lg:px-[10rem]
              ${openModal ? 'animate-slideInFromBottom' : 'animate-slideOutToBottom'}`}
            style={{
              backgroundImage: `url(/assets/images/recharge_panel.webp)`,
            }}
          >
            <div className="text-left grid w-full gap-1 md:gap-4 mb-8 pt-[6rem] sm:pt-8">
              <button
                className="w-[4rem] text-[#80E8FF] font-outfit font-semibold hover:brightness-75"
                type="button"
                onClick={closeModal}
              >
                &lt; &nbsp; Back
              </button>

              <h3 className="text-[1.5rem] md:text-[2rem] text-[#FFAA00]">Free Daily Boosters</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto">
                <button 
                  onClick={handleChargeEnergy} 
                  disabled={rechargeLoading}
                  className={`
                    ${currentUser?.staminaRechargeRemaining > 0 
                      ? 'dark:bg-[#003459] dark:hover:bg-[#0a4780] hover:border-1 hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer' 
                      : 'dark:bg-gray-700 pointer-events-none'}
                    w-full py-2 px-6 border-none text-gray-500 bg-white border-2 rounded-lg 
                  `}
                >
                  <div className="flex items-center justify-between">
                    <img src="/assets/images/EnergyRefresh.webp" alt="energy refresh icon" className="w-6 h-6 md:w-10 md:h-10" />
                    {currentUser?.staminaRechargeRemaining > 0 && (
                      boosterSelected === 0 ? (
                        <img src="/assets/images/booster_selected.webp" alt="energy refresh icon" className="w-6 h-6 md:w-10 md:h-10" />
                      ) : (
                        <img src="/assets/images/booster_deselect.webp" alt="energy refresh icon" className="w-6 h-6 md:w-10 md:h-10" />
                      )
                    )}
                  </div>
                  <div className="pt-2 w-full text-[1.25rem] md:text-2xl text-left text-[#80E8FF]">
                    Free Recharge
                    <div className="w-full text-[1rem] md:text-lg text-[#C5C5C5] font-outfit">
                      {currentUser?.staminaRechargeRemaining}/{currentUser?.staminaRechargable || 0} &nbsp; 
                      Available Today
                    </div>
                  </div>
                </button>
                <button
                 onClick={handleChargeEnergyByInvite} 
                 disabled={rechargeLoading}
                 className={`
                   ${currentUser?.inviteRechargeRemaining > 0
                     ? 'dark:bg-[#003459] dark:hover:bg-[#0a4780] hover:border-1 hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer' 
                     : 'dark:bg-gray-700 pointer-events-none'}
                   w-full py-2 px-6 border-none text-gray-500 bg-white border-2 rounded-lg 
                 `}
                >
                  <div className="flex items-center justify-between">
                    <img src="/assets/images/inviteFriends.webp" alt="energy refresh icon" className="w-6 h-6 md:w-10 md:h-10" />
                    {currentUser?.inviteRechargeRemaining > 0 && (
                      boosterSelected === 1 ? (
                        <img src="/assets/images/booster_selected.webp" alt="energy refresh icon" className="w-6 h-6 md:w-10 md:h-10" />
                      ) : (
                        <img src="/assets/images/booster_deselect.webp" alt="energy refresh icon" className="w-6 h-6 md:w-10 md:h-10" />
                      )
                    )}
                  </div>
                  <div className="pt-2 w-full text-[1.25rem] md:text-2xl text-left text-[#80E8FF]">
                    Invite Friend
                    <div className="w-full text-[1rem] md:text-lg text-[#C5C5C5] font-outfit">
                      <span className="relative top-1 inline-flex items-center text-[#FFC85A] text-[1rem] md:text-lg font-LuckiestGuy">
                        <img src="/assets/images/coin.webp" alt="coin" className="w-5 h-5 mr-2" />
                        +5000 &nbsp;
                      </span> 
                      For You And Your Friend
                    </div>
                  </div>
                </button>
              </div>
            </div>
            {showPopup && <ReferPopup onClose={handleReferCompletion} />}
          </div>
        </div>
      )}
    </>
  );
}

EarnGuide.propTypes = {
  openModal: PropTypes.string,
  setOpenModal: PropTypes.func,
  setIsOneTimeTaskOpen: PropTypes.func,
};

export default EarnGuide;
