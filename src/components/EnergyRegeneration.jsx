import React, { useState, useEffect } from "react";
import { PropTypes } from "prop-types";
import { ProgressBar } from "react-progressbar-fancy";
import { useLocalStamina, useUserDetails } from "../sagaStore/slices";
import { getTimeRemaining } from '../utils/getTimeRemaining';
import LeaderBoardModal from './LeaderBoardModal';
import TaskList from './TaskList';

function EnergyRegeneration({
    isLeaderboardOpen,
    setIsLeaderboardOpen,
    isOneTimeTaskOpen,
    setIsOneTimeTaskOpen,
}) {
    const currentUser = useUserDetails();
    const localStamina = useLocalStamina();
    const [profitPerHour, setProfitPerHour] = useState('');
    const [progressBarWidth, setProgressBarWidth] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
    const [countDownRemaining] = useState(0);

    const [showFirstDiv, setShowFirstDiv] = useState(false);
    const [showProgressBar, setShowProgressBar] = useState(false);

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
        // update profit per hour
        setProfitPerHour(!currentUser?.profitPerHour || currentUser?.profitPerHour === 0 ? '-' : `+${currentUser?.profitPerHour}`);

        // update energy
        const energyPercentage = (localStamina / currentUser?.maxStamina) * 100;
        setProgressBarWidth(Math.max(0, Math.min(energyPercentage, 100)));
    }, [currentUser, localStamina]);

    return (
        <>
            <div className="absolute grid grid-cols-3 gap-3 justify-center items-center w-full mx-auto my-4 p-12 top-60"
                style={{
                    zIndex: 80,
                }}
            >

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
                        className="flex gap-3 py-5 px-6 rounded-3xl"
                        style={{
                            background: '#0764BA',
                            backgroundBlendMode: 'multiply',
                            boxShadow: '3px 2px 0px 0px #60ACFF inset',
                        }}
                    >
                        <img
                            src={"../assets/images/clicker-character/coinTimer.png"}
                            className="object-contain w-1/3"
                            alt="coinTimer icon"
                        />
                        <div className="justify-center flex flex-col gap-1 pt-1">
                            <div
                                className="text-3xl"
                                style={{
                                    color: 'var(--0163BE, #0163BE)',
                                    leadingTrim: 'both',
                                    textEdge: 'cap',
                                    WebkitTextStrokeWidth: '1.2px',
                                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                    lineHeight: '90%',
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {profitPerHour}
                            </div>
                            <div className="text-sm font-outfit">Profit Per 12h</div>
                        </div>
                    </div>
                </div>

                <ProgressBar
                    score={progressBarWidth}
                    progressColor="#80E8FF"
                    primaryColor="#49DEFF"
                    secondaryColor="#FAFF00"
                    hideText={true}
                    className={`text-center border-2 border-white border-solid rounded-tl-3xl rounded-tr-md rounded-br-3xl rounded-bl-md pt-1 pb-2 transition-opacity duration-700 ${
                      showProgressBar ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
                    }`}
                />

            </div>

            {isOneTimeTaskOpen && (
                <div
                className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${
                    isOneTimeTaskOpen ? 'block' : 'hidden'
                }`}
                style={{
                    zIndex: 100,
                }}
                >
                <TaskList setIsOneTimeTaskOpen={setIsOneTimeTaskOpen} />
                </div>
            )}

            {isLeaderboardOpen && (
                <div
                className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${
                    isLeaderboardOpen ? 'block' : 'hidden'
                }`}
                style={{
                    zIndex: 100,
                }}
                >
                <LeaderBoardModal
                    timeRemaining={timeRemaining}
                    countdown={countDownRemaining}
                    isLeaderBoardOpen={isLeaderboardOpen}
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
}

export default EnergyRegeneration;
