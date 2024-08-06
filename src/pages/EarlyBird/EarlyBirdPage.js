import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import useAuth from "../../hooks/useAuth.js";
import Header from "../../components/Header.jsx";
import { FaInstagram, FaTwitter, FaTelegramPlane, FaYoutube, FaLink } from 'react-icons/fa';
import { getEarlyBirdOneTimeTaskList, useEarlyBirdOneTimeTaskList, useEarlyBirdOneTimeTaskListSuccess, updateCompleteOneTimeTask } from "../../sagaStore/slices/userSlice.js";
import { fetchDate, startCountdown } from '../../firebase/countDown';

const EarlyBirdPage = ({ currentUser, totalClicks, setTotalClicks }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLoggedIn, loading } = useAuth();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isContainerVisible, setIsContainerVisible] = useState(true);

    const earlyBirdOneTimeTaskList = useEarlyBirdOneTimeTaskList();
    const getEarlyBirdOneTimeTaskListSuccess = useEarlyBirdOneTimeTaskListSuccess();

    useEffect(() => {
        if (!getEarlyBirdOneTimeTaskListSuccess) {
            dispatch(getEarlyBirdOneTimeTaskList());
        }
    }, [dispatch, getEarlyBirdOneTimeTaskListSuccess]);

    useEffect(() => {
        if (!isLoggedIn && !loading) {
            navigate("/login");
            toast.error("You need to be logged in to access this page");
        }
    }, [isLoggedIn, navigate, loading]);

    useEffect(() => {
        const fetchAndStartCountdown = async () => {
            const earlyBirdDate = await fetchDate("earlyBird");
            if (earlyBirdDate) {
                const cleanup = startCountdown(earlyBirdDate, setTimeLeft, setIsContainerVisible);
                return cleanup;
            }
        };

        fetchAndStartCountdown();
    }, []);

    const getIconComponent = (actionType) => {
        switch (actionType) {
            case 'youtube':
                return FaYoutube;
            case 'instagram':
                return FaInstagram;
            case 'twitter':
                return FaTwitter;
            case 'telegram':
                return FaTelegramPlane;
            default:
                return FaLink;
        }
    };

    const handleTaskClick = (task) => {
        window.open(task.url, '_blank');

        if (!(currentUser.completedTask || []).includes(task.taskId)) {
            setTotalClicks(prevTotal => {
                const newCompletedTaskArr = [...(currentUser.completedTask || []), task.taskId];

                dispatch(updateCompleteOneTimeTask({
                    uid: currentUser.uid,
                    coins: task.coins,
                    taskId: task.taskId,
                    completedTask: newCompletedTaskArr,
                }));

                toast.success("Task completed successfully!");

                // Update the current user's completed tasks locally
                currentUser = { ...currentUser, completedTask: newCompletedTaskArr };

                return prevTotal + (task.coins || 0);
            });
        }
    };

    const renderEarlyBirdTaskList = useMemo(() => {
        return (
            earlyBirdOneTimeTaskList.map((task, idx) => {
                const IconComponent = getIconComponent(task.actionType);
                const isTaskCompleted = currentUser?.completedTask.includes(task.taskId);

                return (
                    <div
                        key={idx}
                        className={`flex w-full transition-transform duration-200 px-4 cursor-pointer ${isTaskCompleted ? '' : 'hover:scale-105'}`}
                        onClick={() => isTaskCompleted ? null : handleTaskClick(task)}
                        style={{ pointerEvents: isTaskCompleted ? 'none' : 'auto' }}
                    >
                        <div className="w-[15%] flex justify-center items-center">
                            <IconComponent className={`w-8 h-8 ${isTaskCompleted ? 'text-[#ffc75a]' : 'text-white'}`} />
                        </div>
                        <div className="w-[70%] flex items-center">
                            <div className={`text-xl tracking-wide ${isTaskCompleted ? 'text-[#ffc75a]' : 'text-white'}`}>
                                {task.title}
                            </div>
                        </div>
                        <div className="w-[15%] flex justify-center items-center">
                            <img
                                className={isTaskCompleted ? "w-10" : "w-9"}
                                src={isTaskCompleted ? "../../assets/images/clicker-character/checkedBox.png" : "../../assets/images/clicker-character/checkBox.png"}
                                alt={isTaskCompleted ? "Checked Checkbox" : "Unchecked Checkbox"}
                            />
                        </div>
                    </div>
                )
            })
        );
    }, [earlyBirdOneTimeTaskList, currentUser?.completedTask]);

    return (
        <>
            <Header currentUser={currentUser} totalClicks={totalClicks} />

            <div
                className="flex-grow flex flex-col place-content-center items-center px-24 pb-4 min-h-screen"
                style={{
                    backgroundImage: 'url("../../assets/images/clicker-character/clickerWall.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="w-full h-full flex gap-4 pt-32 container">
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
                                className="rounded-2xl place-content-center p-8 grid gap-2"
                                style={{
                                    backgroundImage: 'url("../assets/images/clicker-character/earlyBBG.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <h1
                                    className="text-center text-[#ffa900] text-6xl p-2"
                                    style={{
                                        WebkitTextStrokeWidth: '4px',
                                        WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                    }}
                                >
                                    Early Bird Missions
                                </h1>

                                {isContainerVisible && (
                                    <div className="w-1/2 p-4 bg-[#003260] rounded-3xl shadow-inner border border-[#7fc1ff] flex-col justify-self-center items-center gap-2 inline-flex">
                                        <p className="text-lg">Missions Ends In</p>

                                        <div className="h-[50px] justify-start items-center inline-flex gap-1 pb-3">
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-3xl tracking-wide font-outfit">{timeLeft.days}</div>
                                                </div>
                                                <div className="text-center text-white text-[8px] font-outfit uppercase">Days</div>
                                            </div>
                                            <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-3xl tracking-wide font-outfit">{timeLeft.hours}</div>
                                                </div>
                                                <div className="text-center text-white text-[8px] font-outfit uppercase">Hours</div>
                                            </div>
                                            <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-3xl tracking-wide font-outfit">{timeLeft.minutes}</div>
                                                </div>
                                                <div className="text-center text-white text-[8px] font-outfit uppercase">Minutes</div>
                                            </div>
                                            <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-2 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-3xl tracking-wide font-outfit">{timeLeft.seconds}</div>
                                                </div>
                                                <div className="text-center text-white text-[8px] font-outfit uppercase">Seconds</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-center text-white text-lg font-semibold font-outfit py-2">
                                    Complete the following task within the time limit to get
                                    <br />
                                    <span
                                        className="font-LuckiestGuy text-[#ffa900] text-2xl"
                                        style={{
                                            WebkitTextStrokeWidth: '0.5px',
                                            WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                        }}
                                    >
                                        25% Discount &nbsp;
                                    </span>
                                    when buying our NFTs!
                                </p>

                                {renderEarlyBirdTaskList}

                                <div
                                    className="w-[240px] h-[80px] flex justify-self-center items-center mt-4 hover:scale-110 transition-transform duration-200 cursor-pointer"
                                    onClick={() => navigate('/mint')}
                                >
                                    <div className="bg-[#ffb23e] rounded-full border border-[#e59e69] flex justify-center items-center w-full h-full hover:bg-[#FFDC62] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer">
                                        <div
                                            className="text-center text-white text-3xl"
                                            style={{ textShadow: '0px 2px 0.6px rgba(240, 139, 0, 0.66)' }}
                                        >
                                            Mint Now
                                        </div>
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
                        <div className="w-full flex flex-col absolute px-14 gap-1.2 bottom-40">
                            <div
                                className="text-[#0163be] tracking-wide text-right w-full"
                                style={{
                                    WebkitTextStrokeWidth: '1.5px',
                                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                    fontSize: '32px'
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
                                    Unlock hidden realms, mystery boxes, and more exclusive rewards!<br />
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
                                    Our NFTs are your gateway to the Play-to-Earn ecosystem.<br />
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
    setTotalClicks: PropTypes.func,
};

export default EarlyBirdPage;
