import React, { useEffect, useState } from "react";
import Header from "../../components/Header.jsx";
import { fetchDate, startCountdown } from "../../firebase/countDown";

function ReferralPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isContainerVisible, setIsContainerVisible] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [showTextOne, setShowTextOne] = useState(false);
  const [showTextTwo, setShowTextTwo] = useState(false);
  const [showTextThree, setShowTextThree] = useState(false);
  const [showTextSubtext, setShowSubtext] = useState(false);
  const [slideMintPanel, setSlideMintPanel] = useState(false);

  useEffect(() => {
    // start minting deadline
    const fetchAndStartCountdown = async () => {
      const referralDate = await fetchDate("mint");
      if (referralDate) {
        const cleanup = startCountdown(
          referralDate,
          setTimeLeft,
          setIsContainerVisible
        );
        return cleanup;
      }
    };
    fetchAndStartCountdown();

    // intro animations
    const timerTitle = setTimeout(() => {
      setShowTitle(true);
    }, 50);

    const timerTextOne = setTimeout(() => {
      setShowTextOne(true);
    }, 250);

    const timerTextTwo = setTimeout(() => {
      setShowTextTwo(true);
    }, 350);

    const timerTextThree = setTimeout(() => {
      setShowTextThree(true);
    }, 450);

    const timerSubtext = setTimeout(() => {
      setShowSubtext(true);
    }, 650);

    const timerMintPanel = setTimeout(() => {
      setSlideMintPanel(true);
    }, 250);

    return () => {
      clearTimeout(timerTitle);
      clearTimeout(timerTextOne);
      clearTimeout(timerTextTwo);
      clearTimeout(timerTextThree);
      clearTimeout(timerSubtext);
      clearTimeout(timerMintPanel);
    };
  }, []);

  return (
    <>
      <Header />

      <div
        className="flex flex-col items-center pb-8 min-h-screen w-full"
        style={{
          backgroundImage:
            'url("/assets/images/clicker-character/clickerWall.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="w-full flex flex-col xl:flex-row justify-between container pt-[12rem] tracking-wider">
          {/* title */}
          <div className={`xl:w-[30%] text-amber-500 grid gap-8 transition-all duration-1000
            ${showTitle ? `opacity-100` : `opacity-0`}`
          }>
            <div className="py-4 text-center xl:text-left">
              <span
                className="text-5xl"
                style={{
                  WebkitTextStrokeWidth: "3px",
                  WebkitTextStrokeColor: "var(--Color-11, #FFF)",
                }}
              >
                MINT OUR
              </span>
              <br />
              <span
                className="text-7xl"
                style={{
                  WebkitTextStrokeWidth: "4px",
                  WebkitTextStrokeColor: "var(--Color-11, #FFF)",
                }}
              >
                NFT NOW
              </span>
            </div>

            <div>
              <div className={`flex items-center gap-8 pb-2 transition-all duration-1000
                ${showTextOne ? `opacity-100` : `opacity-0`}`
              }>
                <img
                  src={"/assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="ml-2 w-6 h-6"
                />
                <h3 className="text-2xl text-white w-full">STEP 1</h3>
              </div>
              <p
                className="leading-normal tracking-normal text-white font-outfit text-justify"
                style={{
                  fontSize: "14px",
                }}
              >
                Complete the following tasks to get a 25% whitelist discount!
              </p>
            </div>

            <div>
              <div className={`flex items-center gap-8 pb-2 transition-all duration-1000
                  ${showTextTwo ? `opacity-100` : `opacity-0`}`
                }>
                <img
                  src={"/assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="ml-2 w-6 h-6"
                />
                <h3 className="text-2xl text-white w-full">STEP 2</h3>
              </div>
              <p
                className="leading-normal tracking-normal text-white font-outfit text-justify"
                style={{
                  fontSize: "14px",
                }}
              >
                Mint your NFTs and unlock your Anitap VIP Value Pass today!
              </p>
            </div>
            <div>
              <div className={`flex items-center gap-8 pb-2 transition-all duration-1000
                  ${showTextThree ? `opacity-100` : `opacity-0`}`
                }>
                <img
                  src={"/assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="ml-2 w-6 h-6"
                />
                <h3 className="text-2xl text-white w-full">STEP 3</h3>
              </div>
              <p
                className="leading-normal tracking-normal text-white font-outfit text-justify"
                style={{
                  fontSize: "14px",
                }}
              >
                Use your VIP Pass to join the Animara leaderboard event and
                compete to win prizes worth up to $600,000!
              </p>
            </div>

            {/* Mobile view */}
            <div
              className="w-full block xl:hidden rounded-3xl p-3 mt-[2rem] "
              style={{
                border: "2px solid var(--Color, #F4FBFF)",
                background: "rgba(155, 231, 255, 0.58)",
                boxShadow:
                  "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
                backdropFilter: "blur(15px)",
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
              className="rounded-2xl place-content-center p-6 grid min-h-[60vh] lg:min-h-[80dvh] 2xl:min-h-[50dvh]"
              style={{
                backgroundImage:
                  'url("/assets/images/clicker-character/mintBBG.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {isContainerVisible && (
                <div className="p-3 px-6 bg-[#003260] rounded-3xl shadow-inner border border-[#7fc1ff] flex-col justify-self-center items-center gap-2 inline-flex">
                  <p className="text-md pb-1">Minting Ends In</p>
                  <div className="h-[50px] justify-start items-center inline-flex gap-1 pb-3">
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.days}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Days
                      </div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl">
                      :
                    </span>
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.hours}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Hours
                      </div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl">
                      :
                    </span>
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.minutes}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Minutes
                      </div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl">
                      :
                    </span>
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.seconds}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <img
                src="/assets/images/clicker-character/nft-treasureBox.png"
                alt="NFT Treasure Box"
                className="object-contain w-96 -my-10"
              />
              <div className="w-full flex-col justify-center items-center inline-flex">
                <div className="flex-col justify-center items-center flex pb-8">
                  <span className="text-gray-200 text-xl line-through">
                    0.097 SOL
                  </span>
                  <div className="text-center absolute right-0 bottom-[13rem] text-white text-sm border-4 px-3 py-1 border-white rounded-2xl bg-sky-500 rotate-[20deg]">
                    Early Bird
                    <br />
                    Bonus Active!
                  </div>
                  <div
                    className="text-center text-amber-500 text-5xl z-10"
                    style={{
                      WebkitTextStrokeWidth: "3.5px",
                      WebkitTextStrokeColor: "var(--COlor-11, #FFF)",
                      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    0.073 SOL
                  </div>
                </div>
              </div>
              <div className="justify-center items-center inline-flex hover:scale-105 transition-transform duration-200">
                <div className="px-[2rem] py-[1.5rem] bg-[#FFDC62] rounded-full border border-[#E59E69] justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] hover:bg-[#FFB23F] hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] cursor-pointer">
                  <div
                    className="text-center text-white text-3xl font-normal"
                    style={{
                      textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                    }}
                  >
                    <span className="hover:text-shadow-none">Mint Now</span>
                  </div>
                </div>
              </div>
            </div>
            </div>
          
            <div className={`border-2 border-transparent border-t-sky-300 border-dashed py-8 mt-4 font-outfit text-md
              ${showTextSubtext ? `opacity-100` : `opacity-0`}`
            }>
              <div className="flex flex-col items-center xl:items-start">
                <div>
                  <span className="cursor-pointer text-amber-500 hover:text-amber-400">
                    <a
                      href="https://opensea.io/login"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Opensea Link
                    </a>
                  </span>
                  <span className="text-white">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span className="cursor-pointer text-amber-500 hover:text-amber-400">
                    <a
                      href="https://etherscan.io/login"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Etherscan
                    </a>
                  </span>
                </div>
                <p className="text-white text-xs">
                  You must be on the Poleygon Mainnet to mint.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div
            className={`xl:w-[60%] hidden xl:block rounded-3xl p-3 transition-all duration-1000
              ${slideMintPanel? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}
              style={{
              border: "2px solid var(--Color, #F4FBFF)",
              background: "rgba(155, 231, 255, 0.58)",
              boxShadow:
                "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
              backdropFilter: "blur(15px)",
            }}
          >
            {/* Mint Panel */}
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
              className="rounded-2xl place-content-center p-6 grid min-h-[60vh] lg:min-h-[80dvh] 2xl:min-h-[50dvh]"
              style={{
                backgroundImage:
                  'url("/assets/images/clicker-character/mintBBG.png")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            >
              {isContainerVisible && (
                <div className="p-3 px-6 bg-[#003260] rounded-3xl shadow-inner border border-[#7fc1ff] flex-col justify-self-center items-center gap-2 inline-flex">
                  <p className="text-md pb-1">Minting Ends In</p>
                  <div className="h-[50px] justify-start items-center inline-flex gap-1 pb-3">
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.days}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Days
                      </div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl">
                      :
                    </span>
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.hours}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Hours
                      </div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl">
                      :
                    </span>
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.minutes}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Minutes
                      </div>
                    </div>
                    <span className="text-white font-outfit font-semibold text-2xl">
                      :
                    </span>
                    <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                      <div className="w-12 h-8 flex-col justify-center items-center gap-4 flex">
                        <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                          {timeLeft.seconds}
                        </div>
                      </div>
                      <div className="text-center text-white text-[7px] font-outfit uppercase">
                        Seconds
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <img
                src="/assets/images/clicker-character/nft-treasureBox.png"
                alt="NFT Treasure Box"
                className="object-contain w-96 -my-10"
              />
              <div className="w-full flex-col justify-center items-center inline-flex">
                <div className="flex-col justify-center items-center flex pb-8">
                  <span className="text-gray-200 text-xl line-through">
                    0.097 SOL
                  </span>
                  <div className="text-center absolute right-36 bottom-52 text-white text-sm border-4 px-3 py-1 border-white rounded-2xl bg-sky-500 rotate-[20deg]">
                    Early Bird
                    <br />
                    Bonus Active!
                  </div>
                  <div
                    className="text-center text-amber-500 text-6xl z-10"
                    style={{
                      WebkitTextStrokeWidth: "3.5px",
                      WebkitTextStrokeColor: "var(--COlor-11, #FFF)",
                      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    0.073 SOL
                  </div>
                </div>
              </div>
              <div className="justify-center items-center inline-flex hover:scale-105 transition-transform duration-200">
                <div className="h-[90px] w-[270px] bg-[#FFDC62] rounded-full border border-[#E59E69] justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] hover:bg-[#FFB23F] hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] cursor-pointer">
                  <div
                    className="text-center text-white text-3xl font-normal"
                    style={{
                      textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                    }}
                  >
                    <span className="hover:text-shadow-none">Mint Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReferralPage;
