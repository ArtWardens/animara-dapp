import React, { useEffect, useRef, useState } from "react";

function EnergyRegeneration({ gameData, timeLeft }) {

    const maxEnergy = 20;
    
    const currentEnergy = gameData?.mascot2?.energy || 0;
    const energyPercentage = (currentEnergy / maxEnergy) * 100;
    const progressBarWidth = Math.min(energyPercentage, 100);

    //   const [timeLeft, setTimeLeft] = useState({
    //     hours: 0,
    //     minutes: 0,
    //     seconds: 0,
    //   });

    //   useEffect(() => {
    //     const targetDate = new Date("2024-06-30T00:00:00Z").getTime();
    //     const updateCountdown = () => {
    //       const now = new Date().getTime();
    //       const distance = targetDate - now;
    //       const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //       const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //       const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    //       setTimeLeft({ hours, minutes, seconds });

    //       if (distance < 0) {
    //         clearInterval(timerInterval);
    //         setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
    //       }
    //     };

    //     const timerInterval = setInterval(updateCountdown, 1000);
    //     return () => clearInterval(timerInterval);
    //   }, []);

    const [modalOpen, setModalOpen] = useState(false);
    const trigger = useRef(null);
    const modal = useRef(null);

    useEffect(() => {
        const clickHandler = ({ target }) => {
            if (!modal.current) return;
            if (!modalOpen || modal.current.contains(target) || trigger.current.contains(target))
                return;
            setModalOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });

    useEffect(() => {
        const keyHandler = ({ keyCode }) => {
            if (!modalOpen || keyCode !== 27) return;
            setModalOpen(false);
        };
        document.addEventListener("keydown", keyHandler);
        return () => document.removeEventListener("keydown", keyHandler);
    });

    return (
        <>
            <div className="absolute w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 mx-auto bottom-5 z-10 left-4 md:left-20 lg:left-20 xl:left-64">
                <a
                    ref={trigger}
                    onClick={() => setModalOpen(true)}
                >
                    <img
                        src={"../assets/images/clicker-character/leaderboardbtn.png"}
                        className="h-full w-full"
                        alt="leaderboard"
                    />
                </a>

                <div className="bg-gray-600 rounded-full relative">
                    <div
                        className="mt-2 h-7 bg-gradient-to-r from-amber-500 from-20% to-purple-800 to-80% py-1 rounded-full"
                        style={{ width: `${progressBarWidth}%` }}
                    >
                        <div className="absolute inset-0 flex items-center">
                            <div className="relative h-12">
                                <img
                                    src={"../assets/images/clicker-character/eneryIcon.png"}
                                    className="h-full w-full"
                                    alt="energy icon"
                                />
                            </div>
                            <div className="flex-1 flex justify-center text-white text-2xl rounded-full">
                                {currentEnergy}/{maxEnergy} &emsp;
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-1 rounded-lg shadow-lg">
                    <div className={`text-md font-semibold text-center ${gameData?.mascot2?.energy >= 20 ? "hidden" : ""}`}>
                        &emsp; &emsp;
                        <span className="px-2">{String(timeLeft.hours).padStart(2, '0')} &nbsp;H</span>:
                        <span className="px-2">{String(timeLeft.minutes).padStart(2, '0')} &nbsp;M</span>:
                        <span className="px-2">{String(timeLeft.seconds).padStart(2, '0')} &nbsp;S</span>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div
                    className={`fixed left-0 top-0 flex h-full min-h-screen w-full items-center justify-center bg-dark/90 px-4 py-5 ${modalOpen ? "block" : "hidden"
                        }`}
                    style={{
                        zIndex: 100, // Add a high z-index here
                    }}
                >
                    <div
                        ref={modal}
                        className="w-2/3 h-2/3 px-8 py-12 text-center md:px-[70px] md:py-[60px]"
                        style={{
                            backgroundImage: 'url("../assets/images/leaderboardExp.png")', // Replace with your image path
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                    >
                    </div>
                </div>
            )}
        </>
    );
};

export default EnergyRegeneration;
