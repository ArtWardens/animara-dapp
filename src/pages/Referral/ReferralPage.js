import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCopy, FaShareFromSquare } from "react-icons/fa6";
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
        className="flex flex-col items-center px-40 pb-8 min-h-screen"
        style={{
          backgroundImage: 'url("../../assets/images/clicker-character/clickerWall.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="w-full h-full flex flex-col items-center gap-6 pt-32">
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
            <div className="w-[62%]">
              <div className="flex w-full">
                <div className="w-[65%] border-dashed border-r-4 border-transparent">
                  <div
                    className="w-full h-full py-16 px-8 items-center"
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
                          className="text-center text-amber-500 text-4xl leading-8 tracking-wide"
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
                        <div className="h-[60px] w-[160px] bg-[#FFDC62] rounded-full border border-[#E59E69] justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] hover:bg-[#FFB23F] hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] cursor-pointer">
                          <div
                            className="text-center text-white text-2xl font-normal"
                            style={{ textShadow: '0px 2px 0.6px rgba(240, 139, 0, 0.66)'}}
                          >
                            <span className="hover:text-shadow-none">Claim</span>
                          </div>
                        </div>
                      </div>
                      <div className="justify-start items-center gap-1 inline-flex">
                        <span className="w-[132px] text-white text-xs font-outfit leading-none">Get an additional<span className="text-white font-LuckiestGuy text-xs tracking-wide">&nbsp;250 SOL</span>, if you own an NFT!</span>
                        <div className="flex justify-center items-center p-2 rounded-lg bg-[#FFC85A] shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:bg-[#FFAA00] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer">
                          <div className="text-orange-50 text-xs">Own Now</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[38%]">
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
                  <div className="w-auto bg-white rounded-lg">
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
                        className="w-full bg-[#003358] border-[1px] border-[#245F89] rounded-lg p-3 text-sm font-medium font-outfit tracking-wide"
                      />
                      <button
                        type="button"
                        onClick={copyInviteCode}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FA0] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[64x] h-[30px] text-xs tracking-wide px-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer"
                        style={{
                          boxShadow: '0px 4px 4px 0px rgba(255, 210, 143, 0.61) inset',
                        }}
                      >
                        <FaCopy />
                        <span className="hover:text-shadow-[0px_2px_0.6px_rgba(240,139,0,0.66)]">
                          &nbsp;Copy
                        </span>
                      </button>
                    </div>
                    <div className="text-neutral-700 text-xs font-medium font-outfit">
                      or you can use social networks or email
                    </div>
                  </div>
                </div>

                <div
                  className="h-8 mx-4 mt-1 mb-5 text-sm bg-amber-400 shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-1 flex hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer"
                  onClick={shareInviteLink}
                >
                  <FaShareFromSquare className="w-4 h-4 mr-2" />
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
