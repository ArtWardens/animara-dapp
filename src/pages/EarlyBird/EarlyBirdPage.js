import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth.js";
import Header from "../../components/Header.jsx";
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import { BsCopy } from 'react-icons/bs';

const tasks = [
    { actionType: FaInstagram, title: 'Follow X , Retweet Post Tag 3 Friend', index: 0 },
    { actionType: FaTwitter, title: 'Follow Y on Twitter', index: 1 },
    { actionType: BsCopy, title: 'Copy and Share the Link', index: 2 },
    { actionType: FaTwitter, title: 'Follow Y on Twitter', index: 1 },
];

function EarlyBirdPage ({ currentUser, totalClicks }) {
    const navigate = useNavigate();
    const { isLoggedIn, loading } = useAuth();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        if (!isLoggedIn && !loading) {
            navigate("/login");
            toast.error("You need to be logged in to access this page");
        }
    }, [isLoggedIn, navigate, loading]);

    useEffect(() => {
        const countdownDate = new Date(new Date().getFullYear(), 6, 31).getTime(); // 31 July of current year
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
            const hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0');

            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({ days, hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Header
                currentUser={currentUser}
                totalClicks={totalClicks}
            />

            <div className="flex-grow flex flex-col place-content-center items-center px-28 pb-4 min-h-screen"
                style={{
                    backgroundImage: 'url("../../assets/images/clicker-character/clickerWall.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="w-full h-full flex gap-6 pt-32">
                    <div className="w-[68%]">
                        <div
                            className="w-full rounded-3xl p-3"
                            style={{
                                border: '2px solid var(--Color, #F4FBFF)',
                                background: 'rgba(155, 231, 255, 0.58)',
                                boxShadow: '0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)',
                                backdropFilter: 'blur(15px)',
                            }}
                        >
                            <div className="absolute flex w-full justify-between -top-8">
                                <img
                                    src={"../assets/images/clicker-character/ring01.png"}
                                    alt="ring"
                                    className="object-cover w-11 absolute left-2"
                                />
                                <img
                                    src={"../assets/images/clicker-character/ring01.png"}
                                    alt="ring"
                                    className="object-cover w-11 opacity-0"
                                />
                                <img
                                    src={"../assets/images/clicker-character/ring02.png"}
                                    alt="ring"
                                    className="object-cover w-11 absolute right-8"
                                />
                            </div>

                            <div
                                className="rounded-2xl place-content-center p-10 grid gap-4"
                                style={{
                                    backgroundImage: 'url("../assets/images/clicker-character/earlyBBG.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <h1
                                    className="text-center text-[#ffa900] text-6xl"
                                    style={{
                                        WebkitTextStrokeWidth: '4px',
                                        WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                    }}
                                >
                                    Early Bird Missions
                                </h1>

                                <div className="w-1/2 p-4 bg-[#003260] rounded-3xl shadow-inner border border-[#7fc1ff] flex-col justify-self-center items-center gap-3 inline-flex">

                                    <p className="text-lg">
                                        Missions Ends In
                                    </p>

                                    <div className="h-[50px] justify-start items-center inline-flex pb-2">
                                        <div className="w-14 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                            <div className="w-10 h-8 flex-col justify-center items-center gap-4 flex">
                                                <div className="text-center text-white text-3xl font-normal font-outfit">{timeLeft.days}</div>
                                            </div>
                                            <div className="text-center text-white text-[8px] font-outfit uppercase">Days</div>
                                        </div>
                                        <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                        <div className="w-14 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                            <div className="w-10 h-8 flex-col justify-center items-center gap-4 flex">
                                                <div className="text-center text-white text-3xl font-normal font-outfit">{timeLeft.hours}</div>
                                            </div>
                                            <div className="text-center text-white text-[8px] font-outfit uppercase">Hours</div>
                                        </div>
                                        <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                        <div className="w-14 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                            <div className="w-10 h-8 flex-col justify-center items-center gap-4 flex">
                                                <div className="text-center text-white text-3xl font-normal font-outfit">{timeLeft.minutes}</div>
                                            </div>
                                            <div className="text-center text-white text-[8px] font-outfit uppercase">Minutes</div>
                                        </div>
                                        <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                        <div className="w-14 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                            <div className="w-10 h-8 flex-col justify-center items-center gap-4 flex">
                                                <div className="text-center text-white text-3xl font-normal font-outfit">{timeLeft.seconds}</div>
                                            </div>
                                            <div className="text-center text-white text-[8px] font-outfit uppercase">Seconds</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-center text-white text-lg font-semibold font-outfit pb-3">
                                    Complete the following task within the time limit to get
                                    <br />
                                    <span
                                        className="font-LuckiestGuy text-[#ffa900] text-2xl"
                                        style={{
                                            WebkitTextStrokeWidth: '0.5px',
                                            WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                        }}
                                    >
                                        25% Discount&nbsp;
                                    </span>
                                    when buying our NFTs!
                                </p>

                                {tasks.map((task, idx) => (
                                    <div key={idx} className="flex w-full">
                                        <div className="w-[10%] flex justify-start items-center">
                                            <task.actionType className="w-8 h-8 text-[#ffc75a]" />
                                        </div>
                                        <div className="w-[75%] flex items-center">
                                            <div className="text-[#ffc75a] text-xl tracking-wide">
                                                {task.title}
                                            </div>
                                        </div>
                                        <div className="w-[15%] flex justify-end items-center">
                                            <img
                                                className="w-8"
                                                src="../../assets/images/clicker-character/checkedBox.png"
                                                alt="Checked Checkbox"
                                            />
                                        </div>
                                    </div>
                                ))}

                                <div className="w-[240px] h-[80px] flex justify-self-center items-center mt-4">
                                    <div className="bg-[#ffb23e] rounded-full border border-[#e59e69] flex justify-center items-center w-full h-full">
                                        <div className="text-center text-white text-3xl">Mint Now</div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="w-[32%] z-10 scale-150 justify-start items-center origin-bottom relative">
                        <img
                            src={"../assets/images/clicker-character/noticeBoard.png"}
                            className="w-full absolute bottom-0"
                        />
                        <div className="w-full flex flex-col absolute px-16 gap-1.5 bottom-40">
                            <div
                                className="text-[#0163be] tracking-wide text-right w-full"
                                style={{
                                    WebkitTextStrokeWidth: '1.5px',
                                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                    fontSize: '28px'
                                }}
                            >
                                NFT PERKS
                            </div>

                            <h3 className="text-sm w-full">
                                Exclusive Content
                                <p
                                    className="leading-normal font-outfit text-justify"
                                    style={{
                                        fontSize: '8px',
                                    }}
                                >
                                    Unlock hidden realms, mystery boxes, and more exclusive rewards!<br></br>
                                    Compete for your chance to win our 1 million USDT prize!
                                </p>
                            </h3>

                            <h3 className="text-sm w-full">
                                NFT Summon
                                <p
                                    className="leading-normal font-outfit text-justify"
                                    style={{
                                        fontSize: '8px',
                                    }}
                                >
                                    Each NFT has the power to mint a new one! Collect or trade them to grow the Animara universe and maintain their value.
                                </p>
                            </h3>

                            <h3 className="text-sm w-full">
                                Access to Play-to-Earn Game
                                <p
                                    className="leading-normal font-outfit text-justify"
                                    style={{
                                        fontSize: '8px',
                                    }}
                                >
                                    Our NFTs are your gateway to the Play-to-Earn ecosystem.<br></br>
                                    Join the Animara community and start earning as you play!
                                </p>
                            </h3>

                        </div>
                    </div>
                </div>

            </div>

        </>
    );
}

EarlyBirdPage.propTypes = {
    currentUser: PropTypes.object,
    totalClicks: PropTypes.number,
};

export default EarlyBirdPage;