import React, { useState, useEffect, useRef } from "react";
import { ProgressBar } from "react-progressbar-fancy";
import { calculateCountdownRemaining, getCooldownTime, getTimeRemaining } from '../../utils/getTimeRemaining';
import LeaderBoardModal from '../LeaderBoardModal';
import OneTimeTask from '../oneTimeTask';

function EnergyRegeneration({ 
    currentUser, 
    gameData, 
    totalClicks, 
    setTotalClicks,
    isLeaderboardOpen,
    setIsLeaderboardOpen,
    isOneTimeTaskOpen,
    setIsOneTimeTaskOpen,
}) {

    const [profitPerHour, setProfitPerHour] = useState(0);
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    useEffect(() => {
        setProfitPerHour(currentUser?.profitPerHour)
    }, [currentUser])

    useEffect(() => {
        const maxEnergy = gameData?.mascot2?.energy;
        const currentEnergy = maxEnergy - gameData?.mascot2?.clickByLevel || 0;

        const energyPercentage = (currentEnergy / maxEnergy) * 100;
        setProgressBarWidth(Math.min(energyPercentage, 100));
    }, [gameData]);

    const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
    const [countDownRemaining, setCountDownRemaining] = useState(0);
 
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(getTimeRemaining());
        }, 1000);

        return () => clearInterval(intervalId); // Cleanup the interval on component unmount
    }, []);

    return (
        <>
            <div className="absolute grid grid-cols-3 gap-3 justify-center items-center w-full mx-auto my-4 p-10 top-44"
                style={{
                    zIndex: 80,
                }}
            >

                <div
                    className="items-center justify-center"
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
                                +{profitPerHour}
                            </div>
                            <div className="text-sm font-outfit">Profit Per 12h</div>
                        </div>
                    </div>
                </div>

                <ProgressBar
                    score={progressBarWidth}
                    progressColor="#AD00FF"
                    primaryColor="#AD00FF"
                    secondaryColor="#FFF500"
                    hideText={true}
                    className="text-center"
                />

            </div>

            {isOneTimeTaskOpen && (
                <div
                className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${
                    isOneTimeTaskOpen ? 'block' : 'hidden'
                }`}
                style={{
                    zIndex: 100, // Add a high z-index here
                }}
                >
                <OneTimeTask setIsOneTimeTaskOpen={setIsOneTimeTaskOpen} totalClicks={totalClicks} setTotalClicks={setTotalClicks}/>
                </div>
            )}

            {isLeaderboardOpen && (
                <div
                className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${
                    isLeaderboardOpen ? 'block' : 'hidden'
                }`}
                style={{
                    zIndex: 100, // Add a high z-index here
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
};

export default EnergyRegeneration;
