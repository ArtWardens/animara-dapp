import React, { useEffect, useState } from 'react';
import { Modal } from '@mui/material';
import { StaminaRechargeTypeBasic, StaminaRechargeTypeInvite } from '../utils/constants';
import { useUserDetails, useLocalStamina, useRechargeLoading, rechargeStamina } from '../sagaStore/slices';
import { useAppDispatch } from '../hooks/storeHooks.js';
import ReferPopup from './ReferPopup';
import DynamicNumberDisplay from './DynamicNumberDisplay';

const RechargeModal = ({ closeModal }) => {
  const dispatch = useAppDispatch();
  const currentUser = useUserDetails();
  const localStamina = useLocalStamina();
  const rechargeLoading = useRechargeLoading();
  const [isRecharging, setIsRecharging] = useState(false);
  const [enableStaminaRecharge, setEnableStaminaRecharge] = useState(false);
  const [enableInviteRecharge, setEnableInviteRecharge] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [slideUpgrades, setSlideUpgrades] = useState(false);

  const handleChargeEnergy = () => {
    if (currentUser.staminaRechargeRemaining > 0 && enableStaminaRecharge) {
      setIsRecharging(true);
      dispatch(rechargeStamina({ opType: StaminaRechargeTypeBasic }));
    }
  };

  const handleChargeEnergyByInvite = () => {
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
    // intro animations
    const timerUpgrades = setTimeout(() => {
      setSlideUpgrades(true);
    }, 250);

    return () => {
      clearTimeout(timerUpgrades);
    };
  }, []);

  // auto close modal after energy recharge
  useEffect(() => {
    if (isRecharging && !rechargeLoading) {
      setIsRecharging(false);
      closeModal();
    }
  }, [isRecharging, rechargeLoading, closeModal]);

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

  return(
    <div className="w-full max-w-[90dvw]">
      <div 
        className={`h-full min-h-[700px] fixed inset-0 flex bg-dark bg-opacity-75 justify-center items-center z-90 transition-all duration-300
        ${slideUpgrades? `opacity-100` : `opacity-0`}`}
        onClick={closeModal}
      >
        <div
          className={`relative w-full lg:w-[90dvw] h-4/5 rounded-3xl p-3 amt-[10rem] transition-all duration-300 z-[100] ${slideUpgrades? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}
          style={{
            border: "2px solid var(--Color, #F4FBFF)",
            background: "rgba(155, 231, 255, 0.58)",
            boxShadow:
              "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
            backdropFilter: "blur(15px)",
            zIndex: 100,
          }}
            onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute flex w-full justify-between -top-9">
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

          <div className="w-full h-full flex flex-col items-center justify-center gap-1 pt-[1rem] lg:px-[4rem] rounded-3xl"
            style={{
              backgroundImage:
                'url("/assets/images/clicker-character/mascotBg.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >

          <div className="absolute w-full top-0 left-0 flex items-center justify-center px-[4rem] pointer-events-none">
              <img
                src={"/assets/images/clicker-character/recharge.webp"}
                alt="explore-animara"
                className="w-[100%] lg:w-[50%] max-w-[800px] xs:mt-[-1rem] lg:mt-[-2rem] overflow-visible"
              />
          </div>

            <div className="w-full h-full flex flex-col mt-[4rem] lg:mt-[10rem] px-2 lg:px-[4rem]">
              <h3 className="text-[1.5rem] lg:text-[2rem] text-[#FFAA00]">Free Daily Boosters</h3>
              {isRecharging ? (
                // loader
                <div className="pt-4 flex align-middle justify-center">
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
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mt-4">
                  <button
                    onClick={handleChargeEnergy}
                    disabled={rechargeLoading}
                    className={`
                    ${
                      currentUser?.staminaRechargeRemaining > 0
                        ? 'dark:bg-[#003459] dark:hover:bg-[#0a4780] hover:border-1 hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] '
                        : 'dark:bg-gray-700 pointer-events-none'
                    }
                    w-full lg:min-h-[200px] py-2 px-6 border-none text-gray-500 bg-white border-2 rounded-lg transition-all duration-300 hover:scale-105
                  `}
                  >
                    <img
                      src="/assets/images/EnergyRefresh.webp"
                      alt="energy refresh icon"
                      className="w-6 h-6 lg:w-14 lg:h-14"
                    />
                    <div className="pt-2 w-full text-[1.25rem] md:text-2xl text-left text-[#80E8FF]">
                      Free Recharge
                      <div className="w-full text-[1rem] md:text-lg text-[#C5C5C5] font-outfit">
                        {currentUser?.staminaRechargeRemaining}/{currentUser?.staminaRechargable || 0} &nbsp; Available
                        Today
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={handleChargeEnergyByInvite}
                    disabled={rechargeLoading}
                    className={`
                  ${
                    currentUser?.inviteRechargeRemaining > 0
                      ? 'dark:bg-[#003459] dark:hover:bg-[#0a4780] hover:border-1 hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] '
                      : 'dark:bg-gray-700 pointer-events-none'
                  }
                  w-full py-2 px-6 border-none text-gray-500 bg-white border-2 rounded-lg transition-all duration-300 hover:scale-105
                `}
                  >
                    <img
                      src="/assets/images/inviteFriends.webp"
                      alt="energy refresh icon"
                      className="w-6 h-6 lg:w-14 lg:h-14"
                    />
                    <div className="pt-2 w-full text-[1.25rem] md:text-2xl text-left text-[#80E8FF]">
                      Invite Friend
                      <div className="w-full text-[1rem] md:text-lg text-[#C5C5C5] font-outfit">
                        <span className="relative top-1 inline-flex items-center">
                          <DynamicNumberDisplay 
                            number={5000} 
                            spanClassName={"text-[#FFC85A] text-[1rem] md:text-lg font-LuckiestGuy pr-3"}
                          />
                        </span>
                        For You And Your Friend
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
          <Modal
            open={showPopup}
            className="h-screen w-screen flex flex-1 overflow-x-hidden overflow-y-auto"
          >
            <ReferPopup onClose={handleReferCompletion} />
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default RechargeModal;