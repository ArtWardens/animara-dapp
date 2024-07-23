import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { BsCopy } from "react-icons/bs";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareFromSquare } from '@fortawesome/free-solid-svg-icons';
import gem from "../../assets/images/gem2.png";
import StyledQRCode from "../../components/StyledQRCode";
import useAuth from "../../hooks/useAuth.js";
import Header from "../../components/Header.jsx";

const ReferralPage = ({ currentUser, totalClicks, inviteCode }) => {
  const [countdown, setCountdown] = useState(5);
  const [isCloseEnabled, setIsCloseEnabled] = useState(false);
  const [inviteCodeState, setInviteCodeState] = useState(inviteCode);
  const inviteLink = `${window.location.origin}/signup?invite-code=${inviteCodeState}`;

  const navigate = useNavigate();
  const { isLoggedIn, loading, user } = useAuth();

  useEffect(() => {
    setInviteCodeState(user?.referredBy || "");
  }, [user]);

  useEffect(() => {
    if (!isLoggedIn && !loading) {
      navigate("/login");
      toast.error("You need to be logged in to access this page");
    }
  }, [isLoggedIn, navigate, loading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(timer);
          setIsCloseEnabled(true);
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const shareInviteLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Invite Friends",
          text: "Join this awesome app and get 5000 coins!",
          url: inviteLink,
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(inviteLink);
      toast.error("Invite link copied to clipboard!");
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCodeState);
    toast.success('Invite code copied to clipboard!');
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        totalClicks={totalClicks}
      />

      <div
        className="w-screen min-h-screen flex flex-col items-center px-40"
        style={{
          backgroundImage: 'url("../../assets/images/clicker-character/clickerWall.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="w-full h-full flex flex-col items-center gap-6 pt-36">
          <div className="text-center text-white text-4xl uppercase">Refer Friends</div>
          <span
            className="text-center text-amber-500 text-6xl uppercase leading-4 tracking-normal"
            style={{
              WebkitTextStrokeWidth: "3.5px",
              WebkitTextStrokeColor: "var(--Color-11, #FFF)",
            }}
          >
            Earn Free Plus, RP, and More!
          </span>

          <div className="grid grid-cols-3 gap-32">
            <div className="w-full h-full flex flex-col justify-center items-center">
              <img
                className="w-4/5 h-auto origin-top-left shadow"
                src="../../assets/images/clicker-character/board.png"
                alt="Invite Rewards"
              />
              <div className="flex flex-col justify-start items-center gap-2">
                <div className="text-center text-white text-2xl uppercase leading-relaxed">
                  Invite Rewards
                </div>
                <div className="w-[350px] origin-top-left text-center text-stone-300 font-outfit text-sm leading-tight tracking-wide">
                  Get a boost of currencies to use in our Tap-to-Earn game when anyone signs up with your code.
                </div>
              </div>
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <img
                className="w-full h-auto origin-top-left shadow"
                src="../../assets/images/clicker-character/board.png"
                alt="NFT Cashback"
              />
              <div className="flex flex-col justify-start items-center gap-2">
                <div className="text-center text-white text-2xl uppercase leading-relaxed">
                  NFT Cashback
                </div>
                <div className="w-[350px] origin-top-left text-center text-stone-300 font-outfit text-sm leading-tight tracking-wide">
                  Accumulate USDT rewards when anyone you invite purchases a piece of our NFT! Maybe you can snatch one for yourself too if you invite enough people...
                </div>
              </div>
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <img
                className="w-4/5 h-auto origin-top-left shadow"
                src="../../assets/images/clicker-character/board.png"
                alt="Rank Up Rewards"
              />
              <div className="flex flex-col justify-start items-center gap-2">
                <div className="text-center text-white text-2xl uppercase leading-relaxed">
                  Rank Up Rewards
                </div>
                <div className="w-[350px] origin-top-left text-center text-stone-300 font-outfit text-sm leading-tight tracking-wide">
                  Earn MORE currencies in our Tap-to-Earn game when friends you invite hit certain level milestones in our Tap-to-Earn game.
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full">
            <div className="w-[63%]">
              <div className="flex w-full">
                <div className="w-[65%] border-dashed border-r-4 border-transparent">
                  <div
                    className="w-full h-full py-16 px-12 items-center"
                    style={{
                      backgroundImage: 'url("../../assets/images/clicker-character/ticketWeb02.png")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div className="text-neutral-700 text-xl tracking-wider pb-4">
                      YOUR REFERRAL STATS
                    </div>
                    <div className="flex w-full gap-8">
                      <div className="w-1/2">
                        <div className="justify-start items-start">
                          <p
                            className="text-amber-500 text-5xl"
                            style={{
                              WebkitTextStrokeWidth: '2px',
                              WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            }}
                          >
                            2
                          </p>
                          <p
                            className="text-amber-500 text-xl leading-relaxed"
                            style={{
                              WebkitTextStrokeWidth: '0.75px',
                              WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            }}
                          >
                            NFT PURCHASED
                          </p>
                          <div className="text-neutral-700 text-xs font-semibold font-outfit">
                            Begin foundational development, core mechanics.
                          </div>
                        </div>
                      </div>
                      <div className="w-1/2">
                        <div className="justify-start items-start">
                          <p
                            className="text-sky-700 text-5xl"
                            style={{
                              WebkitTextStrokeWidth: '2px',
                              WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            }}
                          >
                            2
                          </p>
                          <p
                            className="text-sky-700 text-xl leading-relaxed"
                            style={{
                              WebkitTextStrokeWidth: '0.75px',
                              WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                            }}
                          >
                            FRIENDS INVITE
                          </p>
                          <div className="text-neutral-700 text-xs font-semibold font-outfit">
                            Begin foundational development, core mechanics.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-[35%]">
                  <div
                    className="w-full h-full place-content-center"
                    style={{
                      backgroundImage: 'url("../../assets/images/clicker-character/ticketWeb01.png")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    <div className="w-full flex-col justify-center items-center gap-2 inline-flex">
                      <div className="flex-col justify-center items-center gap-1 flex">
                        <div className="text-center text-white text-sm font-normal leading-none tracking-wide">NFT Cashback</div>
                        <div
                          className="text-center text-amber-500 text-4xl leading-9 tracking-wide"
                          style={{
                            WebkitTextStrokeWidth: '2px',
                            WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                            textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                          }}
                        >
                          500 sol
                        </div>
                      </div>
                      <div className="pb-2 justify-center items-center inline-flex">
                        <div className="h-[64px] px-12 bg-amber-300 rounded-full shadow shadow-inner border border-orange-300 justify-center items-center inline-flex">
                          <div className="text-center text-white text-2xl font-normal">Claim</div>
                        </div>
                      </div>
                      <div className="justify-start items-center gap-1 inline-flex">
                        <span className="w-[135px] text-white text-xs font-medium font-outfit leading-none">Get an additional<span className="text-white font-LuckiestGuy text-xs tracking-wider">&nbsp;250 SOL </span>, if you own an NFT!</span>
                        <div className="bg-amber-300 rounded-md justify-center items-center flex p-2">
                          <div className="text-orange-50 text-xs font-normal">Own Now</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[37%]">
              <div
                className="w-full h-full place-content-center px-6"
                style={{
                  backgroundImage: 'url("../../assets/images/clicker-character/QRBg.png")',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >

                <div className="flex w-full gap-4 p-3">
                  <div className="w-1/3 bg-white rounded-lg">
                    <StyledQRCode
                      value={inviteLink}
                      image={gem}
                    />
                  </div>

                  <div className="w-2/3 content-center grid gap-2">
                    <div className="text-neutral-700 text-lg tracking-wide">
                      PERSONAL LINK
                    </div>
                    <div className="flex items-center w-full relative">
                      <input
                        type="text"
                        value={inviteCodeState}
                        readOnly={user?.referredBy ? true : false}
                        onChange={(e) => setInviteCodeState(e.target.value)}
                        className="w-full bg-[#003358] border-[1px] border-[#245F89] rounded-xl p-3 text-sm font-medium font-outfit tracking-wide"
                      />
                      <button
                        type="button"
                        onClick={copyInviteCode}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FA0] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[70px] h-[32px] shadow-inner text-xs tracking-wide px-2"
                        style={{
                          boxShadow: '0px 4px 4px 0px rgba(255, 210, 143, 0.61) inset',
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                        </svg>
                        &nbsp; Copy
                      </button>
                    </div>
                    <div className="text-neutral-700 text-xs font-medium font-outfit">
                      or you can use social networks or email
                    </div>
                  </div>
                </div>

                <div
                  className="h-8 mx-4 mt-1 mb-5 text-sm bg-amber-400 rounded-full border-orange-300 justify-center items-center gap-1 flex"
                  onClick={shareInviteLink}
                >
                  <FontAwesomeIcon icon={faShareFromSquare} className="w-4 h-4 mr-2" />
                  Share to Social Networks Now!
                </div>

              </div>
            </div>
          </div>
        </div >
      </div >
    </>
);
};

export default ReferralPage;
