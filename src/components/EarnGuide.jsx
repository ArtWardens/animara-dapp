import React, { useEffect, useRef, useState } from "react";
import { PropTypes } from "prop-types";
import { getAuth, onAuthStateChanged } from "../firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import ReferPopup from "./ReferPopup";

function EarnGuide({
    energyRechargable,
    handleUpdateRechargableEnergy,
    inviteRechargable,
    handleUpdateRechargableInvite,
    modalOpen,
    handleOpenModal,
    gameData,
    rewardRate,
    setIsLeaderboardOpen,
    setIsOneTimeTaskOpen
}) {

    const [enableEnergyRecharge, setEnableEnergyRecharge] = useState(false);
    const [enableInviteRecharge, setEnableInviteRecharge] = useState(false);

    const [imageSrcLeaderboard, setImageSrcLeaderboard] = useState("../assets/images/clicker-character/leaderboardbtn.png");
    const handleMouseEnterLeaderboard = () => setImageSrcLeaderboard("../assets/images/clicker-character/leaderboardHover.png");
    const handleMouseLeaveLeaderboard = () => setImageSrcLeaderboard("../assets/images/clicker-character/leaderboardbtn.png");

    const [imageSrcBoosts, setImageSrcBoosts] = useState("../assets/images/clicker-character/boostsBtn.png");
    const handleMouseEnterBoosts = () => setImageSrcBoosts("../assets/images/clicker-character/boostsHover.png");
    const handleMouseLeaveBoosts = () => setImageSrcBoosts("../assets/images/clicker-character/boostsBtn.png");

    const [imageSrcUpgrades, setImageSrcUpgrades] = useState("../assets/images/clicker-character/upgradesBtn.png");
    const handleMouseEnterUpgrades = () => setImageSrcUpgrades("../assets/images/clicker-character/upgradesHover.png");
    const handleMouseLeaveUpgrades = () => setImageSrcUpgrades("../assets/images/clicker-character/upgradesBtn.png");

    const [imageSrcTasks, setImageSrcTasks] = useState("../assets/images/clicker-character/tasksBtn.png");
    const handleMouseEnterTasks = () => setImageSrcTasks("../assets/images/clicker-character/tasksHover.png");
    const handleMouseLeaveTasks = () => setImageSrcTasks("../assets/images/clicker-character/tasksBtn.png");

    const closeModal = () => {
        handleOpenModal("");
    };

    const handleChargeEnergy = () => {
        if (energyRechargable > 0 && enableEnergyRecharge) {
            handleUpdateRechargableEnergy();
        }
    };

    const handleChargeEnergyByInvite = () => {
        if (inviteRechargable > 0 && enableInviteRecharge) {
            setTimeout(() => {
                handleUpdateRechargableInvite();
            }, 5000);
        }
    };
    
    const trigger = useRef(null);
    const modal = useRef(null);

    const [showPopup, setShowPopup] = useState(false);
    const [inviteCode, setInviteCode] = useState("");
    const auth = getAuth();

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!modal.current) return;
            if (modalOpen === "" || modal.current.contains(target) || trigger.current.contains(target)) return;
            handleOpenModal("");
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (modalOpen === "" || keyCode !== 27) return;
            handleOpenModal("");
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    useEffect(() => {
        if (gameData?.mascot2?.energy === gameData?.mascot2?.clickByLevel && gameData?.mascot2?.clickByLevel !== 0) {
            setEnableEnergyRecharge(true);
            setEnableInviteRecharge(true);
        } else {
            setEnableEnergyRecharge(false);
            setEnableInviteRecharge(false);
        }
    }, [gameData?.mascot2?.clickByLevel, gameData?.mascot2?.energy]);

    onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setInviteCode(docSnap.data().referralCode);
          } else {
            console.log("No such document!");
          }
        }
    });

    return (
        <>
            <div className="absolute bottom-12 w-full flex justify-center items-center rounded-lg">
                <div className="grid grid-cols-3 gap-0 md:gap-2 lg:gap-4">
                    <div className="relative rounded-2xl w-full flex justify-center items-end">
                        <button
                            className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                            onMouseEnter={handleMouseEnterBoosts}
                            onMouseLeave={handleMouseLeaveBoosts}
                            ref={trigger}
                            onClick={() => handleOpenModal('boosts')}
                        >
                            <img
                                src={imageSrcBoosts}
                                className="h-full w-full"
                                alt="boosts"
                            />
                        </button>
                    </div>
                    <div className="relative rounded-2xl w-full flex justify-center items-end">
                        <button
                            className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                            onMouseEnter={handleMouseEnterLeaderboard}
                            onMouseLeave={handleMouseLeaveLeaderboard}
                            ref={trigger}
                            onClick={() => setIsLeaderboardOpen(true)}
                        >
                            <img
                                src={imageSrcLeaderboard}
                                className="h-full w-full"
                                alt="leaderboard"
                            />
                        </button>
                    </div>
                    <div className="relative rounded-2xl w-full flex justify-center items-end">
                        <button
                            className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                            onMouseEnter={handleMouseEnterUpgrades}
                            onMouseLeave={handleMouseLeaveUpgrades}
                            onClick={() => handleOpenModal('upgrades')}
                        >
                            <img
                                src={imageSrcUpgrades}
                                className="h-full w-full"
                                alt="upgrades"
                            />
                        </button>
                    </div>
                    <div className="relative rounded-2xl w-full flex justify-center items-end">
                        <button
                            className="transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300"
                            onMouseEnter={handleMouseEnterTasks}
                            onMouseLeave={handleMouseLeaveTasks}
                            ref={trigger}
                            onClick={() => setIsOneTimeTaskOpen(true)}
                        >
                            <img
                                src={imageSrcTasks}
                                className="h-full w-full"
                                alt="tasks"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {modalOpen === 'leaderboard' && (
                <div
                    className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${modalOpen ? "animate-modalOpen" : "animate-modalClose"}`}
                    style={{
                        zIndex: 90,
                    }}
                >
                    <div
                        ref={modal}
                        onFocus={() => handleOpenModal(true)}
                        onBlur={() => handleOpenModal(false)}
                        className="w-full md:w-2/3 h-full md:h-2/3 px-8 py-12 text-center md:px-[70px] md:py-[60px]"
                        style={{
                            backgroundImage: 'url("../assets/images/leaderboardExp.png")',
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                    </div>
                </div>
            )}

            {modalOpen === 'boosts' && (
                <div
                    className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-4`}
                    style={{
                        zIndex: 90,
                    }}
                >
                    <div className={`w-full max-w-[900px] rounded-[20px] bg-white px-5 py-8 text-center dark:bg-dark-2 md:px-[48px] md:py-[48px] ${modalOpen ? "animate-slideInFromBottom" : "animate-slideOutToBottom"}`}>
                        <ul className="grid w-full gap-4 mb-8">
                            <div className='flex flex-row justify-between items-center'>
                                <h3 className='text-3xl'>
                                    Free Daily Boosters
                                </h3>
                                <a className='text-4xl mx-3' type="button" onClick={closeModal}>&times;</a>
                            </div>
                            <li>
                                <div
                                    className={`
                                        ${energyRechargable > 0 && enableEnergyRecharge ? "dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:text-gray-600 hover:bg-gray-50 cursor-pointer" : "dark:bg-gray-600 pointer-events-none"}
                                        inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800
                                    `}
                                >
                                    <div
                                        className='flex flex-1 items-center'
                                        onClick={handleChargeEnergy}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-4 md:ml-6 w-10 h-10 text-fuchsia-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5ZM3.75 18h15A2.25 2.25 0 0 0 21 15.75v-6a2.25 2.25 0 0 0-2.25-2.25h-15A2.25 2.25 0 0 0 3.75 18Z" />
                                        </svg>
                                        <div className="ml-10 w-full text-2xl text-left">
                                            Energy Refresh
                                            <div className="w-full text-lg">
                                                <span className="text-fuchsia-500 text-xl">{energyRechargable}/{rewardRate?.basedRefresh || 0} &nbsp;</span>available today
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div
                                    className={`
                                        ${inviteRechargable > 0 && enableInviteRecharge ? "dark:hover:bg-gray-700 dark:hover:text-gray-300 hover:text-gray-600 hover:bg-gray-50 cursor-pointer" : "dark:bg-gray-600 pointer-events-none"}
                                        inline-flex items-center justify-between w-full p-2 text-gray-500 bg-white border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800
                                    `}
                                >
                                    <div className='flex flex-1 items-center'
                                        onClick={() => {
                                            setShowPopup(true);
                                            handleChargeEnergyByInvite();
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-4 md:ml-6 w-10 h-10 text-green-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                                        </svg>
                                        <div className="ml-10 w-full text-2xl text-left">
                                            Invite Friend
                                            <div className="w-full text-lg text-">
                                                Refer to a friend to get <span className={`text-green-500 text-xl`}>&nbsp;{rewardRate?.inviteRefresh}&nbsp;</span> energy refresh.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        {showPopup && (
                            <ReferPopup
                                inviteCode={inviteCode}
                                rewardRate={rewardRate}
                                onClose={() => setShowPopup(false)}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

EarnGuide.propTypes = {
    energyRechargable: PropTypes.number,
    handleUpdateRechargableEnergy: PropTypes.func,
    inviteRechargable: PropTypes.number,
    handleUpdateRechargableInvite: PropTypes.func,
    modalOpen: PropTypes.string,
    handleOpenModal: PropTypes.func,
    gameData: PropTypes.object,
    rewardRate: PropTypes.number,
    setIsLeaderboardOpen: PropTypes.bool,
    setIsOneTimeTaskOpen: PropTypes.bool
}

export default EarnGuide;

