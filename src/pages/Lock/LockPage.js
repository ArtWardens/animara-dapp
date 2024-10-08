import React, { useEffect, useState } from "react";
import Header from "../../components/Header.jsx";
import { startCountdown } from '../../firebase/countDown';
import { useLockDate } from "../../sagaStore/slices/userSlice.js";
import { useMobileMenuOpen } from '../../sagaStore/slices';

const LockPage = () => {
    const lockDate = useLockDate();
    const mobileMenuOpen = useMobileMenuOpen();
    const [showLeftChain, setShowLeftChain] = useState(false);
    const [showRightChain, setShowRightChain] = useState(false);
    const [showLock, setShowLock] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [reverse, setReverse] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });


    useEffect(() => {
        const timer1 = setTimeout(() => setShowLeftChain(true), 1);
        const timer2 = setTimeout(() => setShowRightChain(true), 1);
        const timer3 = setTimeout(() => {
            setShowLock(true);
        }, 500);
        const timer4 = setTimeout(() => {
            setShowCountdown(true);
        }, 500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, []);

    useEffect(() => {
        const fetchAndStartCountdown = async () => {
            if (lockDate) {
                const cleanup = startCountdown(lockDate, setTimeLeft, setReverse);
                return cleanup;
            }
        };

        fetchAndStartCountdown();
    }, [lockDate]);

    return (
        <>
            <Header />

            <div
                className={`overflow-hidden flex-grow flex flex-col place-content-center items-center xl:px-[6rem] pb-4 h-[100dvh] bg-cover bg-center bg-no-repeat bg-fixed mt-[-13rem]
                    ${mobileMenuOpen ? `hidden` : ``}`}
                style={{
                    backgroundImage: 'url("/assets/images/clicker-character/clickerBg.webp")',
                }}
            >
                <div
                    className="absolute inset-0 flex items-center justify-center bg-cover bg-center bg-no-repeat bg-fixed bg-blend-overlay-multiply"
                    style={{
                        backgroundImage: "linear-gradient(0deg, rgba(0, 53, 80, 0.50) 0%, rgba(0, 53, 80, 0.50) 100%), radial-gradient(65.76% 50% at 50% 50%, rgba(127, 127, 127, 0.00) 0%, #606060 100%)",
                        backdropFilter: "blur(5px)",
                    }}
                >
                    <img
                        src="/assets/images/clicker-character/chain-left.webp"
                        alt="Left Chain"
                        className={`absolute origin-center h-full w-auto right-0 transition-transform duration-1000 ease-out ${showLeftChain ? (reverse ? "-translate-x-full -translate-y-full opacity-0" : "translate-x-0 translate-y-0 opacity-100") : "-translate-x-full -translate-y-full opacity-0"
                            }`}
                    />
                    <img
                        src="/assets/images/clicker-character/chain-right.webp"
                        alt="Right Chain"
                        className={`absolute origin-center h-full w-auto left-0 transition-transform duration-1000 ease-out ${showRightChain ? (reverse ? "translate-x-full -translate-y-full opacity-0" : "translate-x-0 translate-y-0 opacity-100") : "translate-x-full -translate-y-full opacity-0"
                            }`}
                    />
                </div>
                <img
                    src="/assets/images/clicker-character/padlock.webp"
                    alt="Lock"
                    className={`origin-center mb-[7rem] transition-transform duration-500 delay-150 transform ${showLock ? (reverse ? "scale-0 opacity-0" : "scale-110 opacity-100") : "scale-0 opacity-0"
                        } z-10`}
                />
            </div>

            <div className={`hidden absolute bottom-40 lg:bottom-52 left-1/2 -translate-x-1/2 w-80 p-4 pb-6 bg-[#003260] rounded-3xl shadow-inner border border-[#7fc1ff] flex-col items-center gap-3 transition-transform duration-500 delay-150 transform ${showCountdown ? (reverse ? "scale-0 opacity-0" : "scale-105 opacity-100") : "scale-0 opacity-0"}`}>
                <p className="text-lg text-white">
                    Unlocks In
                </p>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col items-center gap-1 px-2">
                        <div className="text-white text-3xl tracking-wide font-outfit">{timeLeft.days}</div>
                        <div className="text-white text-[8px] font-outfit uppercase">Days</div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl mx-1">:</span>
                    <div className="flex flex-col items-center gap-1 px-2">
                        <div className="text-white text-3xl tracking-wide font-outfit">{timeLeft.hours}</div>
                        <div className="text-white text-[8px] font-outfit uppercase">Hours</div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl mx-1">:</span>
                    <div className="flex flex-col items-center gap-1 px-2">
                        <div className="text-white text-3xl tracking-wide font-outfit">{timeLeft.minutes}</div>
                        <div className="text-white text-[8px] font-outfit uppercase">Minutes</div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl mx-1">:</span>
                    <div className="flex flex-col items-center gap-1 px-2">
                        <div className="text-white text-3xl tracking-wide font-outfit">{timeLeft.seconds}</div>
                        <div className="text-white text-[8px] font-outfit uppercase">Seconds</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LockPage;
