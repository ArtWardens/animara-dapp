import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from "../../components/Header.jsx";
import { FaInstagram, FaTwitter, FaTelegramPlane, FaYoutube, FaLink } from 'react-icons/fa';
import { useUserDetails,getEarlyBirdOneTimeTaskList, useEarlyBirdOneTimeTaskList, useTaskIdToComplete, useEarlyBirdOneTimeTaskListSuccess, completeOneTimeTask } from "../../sagaStore/slices/userSlice.js";
import { fetchDate, startCountdown } from '../../firebase/countDown';

const EarlyBirdPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useUserDetails();
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isContainerVisible, setIsContainerVisible] = useState(true);
    const earlyBirdOneTimeTaskList = useEarlyBirdOneTimeTaskList();
    const getEarlyBirdOneTimeTaskListSuccess = useEarlyBirdOneTimeTaskListSuccess();
    const taskIdToComplete = useTaskIdToComplete();
    useEffect(() => {
        if (!getEarlyBirdOneTimeTaskListSuccess) {
            dispatch(getEarlyBirdOneTimeTaskList());
        }
    }, [dispatch, getEarlyBirdOneTimeTaskListSuccess]);
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
    const renderEarlyBirdTaskList = useMemo(() => {
        const handleTaskClick = (task) => {
            window.open(task.url, '_blank');
    
            if (!(currentUser.completedTask || []).includes(task.taskId)) {
                dispatch(completeOneTimeTask({
                    taskId: task.taskId,
                }));
            }
        };
        
        return (
            earlyBirdOneTimeTaskList.map((task, idx) => {
                const IconComponent = getIconComponent(task.actionType);
                const isTaskCompleted = currentUser?.completedTask.includes(task.taskId);
                return (
                    <div
                        key={idx}
                        disabled={taskIdToComplete !== ''}
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
                            {(taskIdToComplete !== '' && taskIdToComplete === task.taskId) ?
                                // loader
                                <div>
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
                                </div>:
                                <img
                                    className={isTaskCompleted ? "w-10" : "w-9"}
                                    src={isTaskCompleted ? "/assets/images/clicker-character/checkedBox.png" : "/assets/images/clicker-character/checkBox.png"}
                                    alt={isTaskCompleted ? "Checked Checkbox" : "Unchecked Checkbox"}
                                />}
                        </div>
                    </div>
                )
            })
        );
    }, [earlyBirdOneTimeTaskList, currentUser, dispatch, taskIdToComplete]);
    return (
        <>
            <Header />
            <div
                className="flex-grow flex flex-col place-content-center items-center px-24 pb-4 min-h-screen"
                style={{
                    backgroundImage: 'url("/assets/images/clicker-character/clickerWall.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="w-full h-full flex gap-4 pt-40 container">
                    <div className="w-[68%] lg:w-[65%] 2xl:w-[68%]">
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
                                    src={"/assets/images/clicker-character/ring01.png"}
                                    alt="ring"
                                    className="object-cover w-11 absolute left-2"
                                />
                                <img
                                    src={"/assets/images/clicker-character/ring01.png"}
                                    alt="ring"
                                    className="object-cover w-11 opacity-0"
                                />
                                <img
                                    src={"/assets/images/clicker-character/ring02.png"}
                                    alt="ring"
                                    className="object-cover w-11 absolute right-8"
                                />
                            </div>

                            <div

                                className="rounded-2xl place-content-center p-8 grid gap-4 min-h-[60dvh] lg:min-h-[90dvh] 2xl:min-h-[60dvh]"
                                style={{
                                    backgroundImage: 'url("/assets/images/clicker-character/earlyBBG.png")',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <h1

                                    className="text-center text-[#ffa900] text-6xl p-2"
                                    style={{
                                        WebkitTextStrokeWidth: '3.5px',
                                        WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                    }}
                                >
                                    Early Bird Missions

                                </h1>

                                {isContainerVisible && (
                                    <div className="w-1/2 py-3 px-4 bg-[#003260] rounded-3xl shadow-inner border border-[#7fc1ff] flex-col justify-self-center items-center gap-2 inline-flex">
                                        <p className="text-lg">Missions Ends In</p>

                                        <div className="h-[50px] justify-start items-center inline-flex gap-1 pb-2">
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-[24px] tracking-wide font-outfit">{timeLeft.days}</div>
                                                </div>
                                                <div className="text-center text-white text-[9px] font-outfit uppercase">Days</div>
                                            </div>
                                            <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-[24px] tracking-wide font-outfit">{timeLeft.hours}</div>
                                                </div>
                                                <div className="text-center text-white text-[9px] font-outfit uppercase">Hours</div>
                                            </div>
                                            <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-[24px] tracking-wide font-outfit">{timeLeft.minutes}</div>
                                                </div>
                                                <div className="text-center text-white text-[9px] font-outfit uppercase">Minutes</div>
                                            </div>
                                            <span className="text-white font-outfit font-semibold text-2xl">:</span>
                                            <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                                                <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                                                    <div className="text-center text-white text-[24px] tracking-wide font-outfit">{timeLeft.seconds}</div>
                                                </div>
                                                <div className="text-center text-white text-[9px] font-outfit uppercase">Seconds</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-center text-white text-lg font-semibold font-outfit py-3">
                                    Complete the following task within the time limit to get

                                    <br />
                                    <span

                                        className="font-LuckiestGuy text-[#ffa900] text-[28px]"
                                        style={{
                                            WebkitTextStrokeWidth: '1px',
                                            WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                        }}
                                    >
                                        25% Discount

                                    </span>
                                    &ensp;when buying our NFTs!
                                </p>

                                {renderEarlyBirdTaskList}

                                <div

                                    className="w-[240px] h-[80px] flex justify-self-center items-center mt-4 hover:scale-105 transition-transform duration-200 cursor-pointer"
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
                    <div className="w-[32%] lg:w-[35%] 2xl:w-[32%] z-10 scale-150 justify-start items-center origin-bottom relative">
                        <img

                            src={"/assets/images/clicker-character/noticeBoard.png"}
                            className="w-full absolute bottom-0"
                            alt=""
                        />
                        <div className="w-full flex flex-col absolute px-12 lg:px-12 2xl:px-16 gap-1 bottom-44 lg:bottom-36 2xl:bottom-40 text-4xl lg:text-3xl 2xl:text-4xl">
                            <div

                                className="text-[#0163be] tracking-wide text-right w-full"
                                style={{
                                    WebkitTextStrokeWidth: '1.5px',
                                    WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                }}
                            >
                                NFT PERKS

                            </div>
                            <h3 className="text-xs w-full">
                                Exclusive Content

                                <p

                                    className="leading-normal font-outfit text-justify text-[9px] lg:text-[9px] 2xl:text-[10px]"
                                >
                                    Unlock hidden realms, mystery boxes, and more exclusive rewards!<br />
                                    Compete for your chance to win our 1 million USDT prize!
                                </p>
                            </h3>
                            <h3 className="text-xs w-full">
                                NFT Summon

                                <p

                                    className="leading-normal font-outfit text-justify text-[9px] lg:text-[9px] 2xl:text-[10px]"
                                >
                                    Each NFT has the power to mint a new one! Collect or trade them to grow the Animara universe and maintain their value.
                                </p>
                            </h3>
                            <h3 className="text-xs w-full">
                                Access to Play-to-Earn Game

                                <p

                                    className="leading-normal font-outfit text-justify text-[9px] lg:text-[9px] 2xl:text-[10px]"
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

export default EarlyBirdPage;
