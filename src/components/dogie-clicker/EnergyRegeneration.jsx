import React, { useState, useEffect } from "react";
import { ProgressBar } from "react-progressbar-fancy";

function EnergyRegeneration({ currentUser, gameData }) {

    const [profitPerHour, setProfitPerHour] = useState(0);
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    useEffect(() => {
        setProfitPerHour(currentUser?.profitPerHour)
    },[currentUser])

    useEffect(() => {
        const maxEnergy = gameData?.mascot2?.energy;
        const currentEnergy = maxEnergy - gameData?.mascot2?.clickByLevel || 0;

        const energyPercentage = (currentEnergy / maxEnergy) * 100;
        setProgressBarWidth(Math.min(energyPercentage, 100));
        
    },[gameData]);

    return (
        <>
            <div className="absolute grid grid-cols-3 gap-3 justify-center items-center w-full mx-auto my-4 p-10 top-28"
                style={{ 
                    zIndex: 99,
                }}
            >
                {/* <div className="bg-gray-600 rounded-full relative">
                    <div
                        className="mt-2 h-4 md:h-5 bg-gradient-to-r from-yellow-400 from-20% to-fuchsia-700 to-80% py-1 rounded-full"
                        style={{ 
                            width: `${progressBarWidth}%`
                        }}
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="relative h-4">
                                <img
                                    src={"../assets/images/clicker-character/eneryIcon.png"}
                                    className="pl-2 h-full w-full hidden"
                                    alt="energy icon"
                                />
                            </div>
                            <div className="text-white text-3xl rounded-full">
                                {currentEnergy}/{maxEnergy} &emsp;
                            </div>
                        </div>
                    </div>
                </div> */}

                <div 
                    className="grid grid-cols-2 gap-10 m-8 mr-8 items-center justify-center"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    <div 
                        className="flex p-3"
                        style={{
                            borderRadius: '30px',
                            background: '#0764BA',
                            backgroundBlendMode: 'multiply',
                            boxShadow: '3px 2px 0px 0px #60ACFF inset',
                        }}
                    >
                        <img 
                            src={"../assets/images/clicker-character/coinTimer.png"}
                            className="p-3"
                            alt="coinTimer icon"
                        />

                        <div className="justify-center items-center grid grid-rows-2 -gap-4">
                            <div className="text-3xl">{profitPerHour}</div>
                            <div className="text-lg font-outfit">Profit per Hour (12H)</div>
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
                
                {/* <div className="pt-1">
                    <div className={`text-md font-semibold text-center ${currentEnergy >= maxEnergy ? "hidden" : ""}`}>
                        &emsp; &emsp;<span className="px-2">{formatCountdown(countdown)}</span>
                    </div>
                </div> */}

            </div>
        </>
    );
};

export default EnergyRegeneration;
