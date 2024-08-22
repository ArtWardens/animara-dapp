import React, { useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import { useUserDetails, useLocalStamina, useRechargeLoading, rechargeStamina, getUserLocations } from '../sagaStore/slices';
import { useAppDispatch } from "../hooks/storeHooks.js";
import {
    StaminaRechargeTypeBasic,
    StaminaRechargeTypeInvite,
  } from "../utils/constants"
import ReferPopup from "./ReferPopup";

function EarnGuide({
    openModal,
    setOpenModal,
    setIsOneTimeTaskOpen
}) {
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

    const handleUserUpgrades = () => {
        setOpenModal('upgrades');
        dispatch(getUserLocations());
    };

    const closeModal = () => {
        setOpenModal("");
    };

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

    const handleReferCompletion = () =>{
        setIsRecharging(true);
        dispatch(rechargeStamina({ opType: StaminaRechargeTypeInvite }));
        setShowPopup(false);
    }

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
            if (openModal === "" || modal.current.contains(target) || trigger.current.contains(target)) return;
            setOpenModal("");
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    // close modal when key donw outside
    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (openModal === "" || keyCode !== 27) return;
            setOpenModal("");
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    // auto close modal after energy recharge
    useEffect(()=>{
        if (openModal === 'boosts' && isRecharging && !rechargeLoading ){
            setIsRecharging(false);
            setOpenModal("");
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
            <div className="absolute bottom-24 flex justify-center place-content-center w-[80%] h-44 pb-8" >
                
                <img
                    src={"/assets/images/clicker-character/button-footerBg.png"}
                    alt="ring"
                    className={`absolute inset-0 w-full h-full object-cover rounded-b-3xl transition-opacity duration-500 ${
                        guideSlideUp ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                      }`}
                />

                <div className="grid grid-cols-3">
                    <div 
                        className={`relative rounded-2xl w-full flex justify-center items-end transition-transform duration-500 ease-in-out ${
                            showBoosts ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                    >
                       <button
                            className="px-[3rem] py-[1rem] mb-5 tracking-wider bg-[#49DEFF] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#80E8FF] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200 text-xl font-bold font-outfit whitespace-nowrap"
                            onClick={() => setOpenModal('boosts')}
                        >
                            <img
                                src="/assets/images/clicker-character/boosts-icon.png"
                                className="h-auto w-[2dvw]"
                                alt="boosts-icon"
                            />
                            Boosts
                        </button>
                    </div>

                    <div
                        className={`relative rounded-2xl w-full flex justify-center items-end transition-transform duration-500 ease-in-out ${
                        showUpgrades ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                    >
                        <button
                            className="px-[2rem] py-[1rem] mb-5 tracking-wider bg-[#FFB23F] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#FFDC62] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200 text-xl font-bold font-outfit whitespace-nowrap"
                            onClick={handleUserUpgrades}
                        >
                            <img
                                src="/assets/images/clicker-character/star-icon.png"
                                className="h-auto w-[2dvw]"
                                alt="star-icon"
                            />
                            Upgrades & Explore Animara
                        </button>
                    </div>
                    <div
                        className={`relative rounded-2xl w-full flex justify-center items-end transition-transform duration-500 ease-in-out ${
                        showTasks ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                        }`}
                    >
                        <button
                            className="px-[2.5rem] py-[1rem] mb-5 tracking-wider bg-[#49DEFF] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#80E8FF] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200 text-xl font-bold font-outfit whitespace-nowrap"
                            onClick={() => setIsOneTimeTaskOpen('true')}
                        >
                            <img
                                src="/assets/images/clicker-character/tasks-icon.png"
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
                    className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${openModal ? "animate-openModal" : "animate-modalClose"}`}
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
                            backgroundImage: 'url("/assets/images/leaderboardExp.png")',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                    </div>
                </div>
            )}

            {openModal === 'boosts' && (
                <div
                    className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-4`}
                    style={{
                        zIndex: 90,
                    }}
                >
                    <div className={`w-full max-w-[900px] rounded-[20px] bg-white px-5 py-8 text-center dark:bg-dark-2 md:px-[48px] md:py-[48px] ${openModal ? "animate-slideInFromBottom" : "animate-slideOutToBottom"}`}>
                        <ul className="grid w-full gap-4 mb-8">
                            <div className='flex flex-row justify-between items-center'>
                                <h3 className='text-3xl'>
                                    Free Stamina Recharges
                                </h3>
                                <button className='text-4xl mx-3' type="button" onClick={closeModal}>&times;</button>
                            </div>
                            <li>
                                <div
                                    className={`
                                        ${currentUser?.staminaRechargeRemaining > 0 && enableStaminaRecharge ? "dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:text-gray-600 hover:bg-gray-50 cursor-pointer" : "dark:bg-gray-700 pointer-events-none"}
                                        inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800
                                    `}
                                >
                                    <div
                                        className='flex flex-1 items-center'
                                        onClick={handleChargeEnergy}
                                        disabled={rechargeLoading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-4 md:ml-6 w-10 h-10 text-fuchsia-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5ZM3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 1.5 9.75v6A2.25 2.25 0 0 0 3.75 18Z" />
                                        </svg>
                                        <div className="ml-10 w-full text-2xl text-left">
                                            Free Recharge
                                            <div className="w-full text-lg">
                                                <span className="text-fuchsia-500 text-xl">{currentUser?.staminaRechargeRemaining}/{currentUser?.staminaRechargable || 0} &nbsp;</span>available today
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div
                                    className={`
                                        ${currentUser?.inviteRechargeRemaining > 0 && enableInviteRecharge ? "dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:text-gray-600 hover:bg-gray-50 cursor-pointer" : "dark:bg-gray-700 pointer-events-none"}
                                        inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800
                                    `}
                                >
                                    <div className='flex flex-1 items-center'
                                        onClick={handleChargeEnergyByInvite}
                                        disabled={rechargeLoading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-4 md:ml-6 w-10 h-10 text-green-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                        </svg>
                                        <div className="ml-10 w-full text-2xl text-left">
                                            Invite Friend
                                            <div className="w-full text-lg text-">
                                                Send an invite to friend to recharge stamina for free<span className="text-fuchsia-500 text-xl">{currentUser?.inviteRechargeRemaining}/{currentUser?.inviteRechargable || 0} &nbsp;</span>available today
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        {showPopup && (
                            <ReferPopup
                                onClose={handleReferCompletion}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

EarnGuide.propTypes = {
    openModal: PropTypes.string,
    setOpenModal: PropTypes.func,
    setIsOneTimeTaskOpen: PropTypes.func
}

export default EarnGuide;

