import React, { useEffect, useState, useMemo, useRef } from "react";
import { publicKey } from "@metaplex-foundation/umi";
import { fetchCandyMachine, safeFetchCandyGuard, AccountVersion } from "@metaplex-foundation/mpl-candy-machine";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { useUmi } from "../../web3/useUmi.ts";
import { guardChecker } from "../../web3/checkAllowed.ts";
import { useSolanaTime } from "../../web3/SolanaTimeContext.tsx";
import WalletInfo from "../../components/SolanaWallet/WalletInfo.jsx";
import Header from "../../components/Header.jsx";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import { mintNFT, useMintingNFT, useNFTMinted, resetMintedNFT } from "../../sagaStore/slices/userSlice.js";
import { fetchDate, startCountdown } from "../../firebase/countDown";

const useCandyMachine = (
  umi,
  candyMachineId,
  checkEligibility,
  firstRun,
  setfirstRun
) => {
  const [candyMachine, setCandyMachine] = useState();
  const [candyGuard, setCandyGuard] = useState();

  // candy machine initialization
  useEffect(() => {
    (async () => {
      if (checkEligibility) {
        if (!candyMachineId) {
          console.error("No candy machine in .env!");
          toast("No candy machine in .env!");
          return;
        }

        let candyMachine;
        try {
          candyMachine = await fetchCandyMachine(umi, publicKey(candyMachineId));
          //verify CM Version
          if (candyMachine.version !==AccountVersion.V2) {
            toast("Wrong candy machine account version!");
            return;
          }
        } catch (e) {
          console.error(e);
          toast("The CM from .env is invalid");
        }
        setCandyMachine(candyMachine);
        if (!candyMachine) {
          return;
        }
        let candyGuard;
        try {
          candyGuard = await safeFetchCandyGuard(umi, candyMachine.mintAuthority);
        } catch (e) {
          console.error(e);
          toast("No Candy Guard found!");
        }
        if (!candyGuard) {
          return;
        }
        setCandyGuard(candyGuard);
        if (firstRun) {
          setfirstRun(false)
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umi, checkEligibility]);

  return { candyMachine, candyGuard };
};

function MintPage() {
  const dispatch = useAppDispatch();
  const mintingNFT = useMintingNFT();
  const nftMinted = useNFTMinted();
  const umi = useUmi();
  const solanaTime = useSolanaTime();
  const [guards, setGuards] = useState([
    { label: "startDefault", allowed: false, maxAmount: 0 },
  ]);
  const [ownedTokens, setOwnedTokens] = useState();
  const candyMachineId = useMemo(() => {
    if (process.env.REACT_APP__CANDY_MACHINE_ID) {
      return publicKey(process.env.REACT_APP__CANDY_MACHINE_ID);
    } else {
      console.error(`failed to get candy machien id cuz No REACT_APP__CANDY_MACHINE_ID in .env!`);
      toast('failed to get candy machien id cuz No REACT_APP__CANDY_MACHINE_ID in .env!');
      return publicKey("11111111111111111111111111111111");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [checkEligibility] = useState(true);
  const [firstRun, setFirstRun] = useState(true);
  const {candyMachine, candyGuard} = useCandyMachine(umi, candyMachineId, checkEligibility, firstRun, setFirstRun);
  const [isAllowed, setIsAllowed] = useState(false);
  const [loadingCandyMachine, setLoadingCandyMachine] = useState(true);
  const [isContainerVisible, setIsContainerVisible] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [showTextOne, setShowTextOne] = useState(false);
  const [showTextTwo, setShowTextTwo] = useState(false);
  const [showTextThree, setShowTextThree] = useState(false);
  const [showTextSubtext, setShowSubtext] = useState(false);
  const [slideMintPanel, setSlideMintPanel] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isShowNftOpen, setIsShowNftOpen] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [mintVideoAnim, setMintVideoAnim] = useState(false);
  const [mintFadeOut, setMintFadeOut] = useState(false);
  const videoRef = useRef(null);

  // intro animation & fetch countdown
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
    }, 500);

    const timerTextOne = setTimeout(() => {
      setShowTextOne(true);
    }, 750);

    const timerTextTwo = setTimeout(() => {
      setShowTextTwo(true);
    }, 1000);

    const timerTextThree = setTimeout(() => {
      setShowTextThree(true);
    }, 1250);

    const timerSubtext = setTimeout(() => {
      setShowSubtext(true);
    }, 1750);

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

  // minting setup
  useEffect(() => {
    const checkEligibilityFunc = async () => {
      if (!candyMachine || !candyGuard || !checkEligibility || isShowNftOpen) {
        return;
      }
      setFirstRun(false);

      const { guardReturn, ownedTokens } = await guardChecker(
        umi, candyGuard, candyMachine, solanaTime
      );

      setOwnedTokens(ownedTokens);
      setGuards(guardReturn);
      setIsAllowed(false);

      // let allowed = false;
      // for (const guard of guardReturn) {
      //   if (guard.allowed) {
      //     allowed = true;
      //     break;
      //   }
      // }
      // setIsAllowed(allowed);
      // todo: force to be true in dev net
      setIsAllowed(true);

      setLoadingCandyMachine(false);
    };

    checkEligibilityFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umi, checkEligibility, firstRun]);

  const handleMint = () =>{
    // filter guards list
    let filteredGuardlist = guards.filter(
      (elem, index, self) =>
        index === self.findIndex((t) => t.label === elem.label)
    );
    if (filteredGuardlist.length === 0) {
      console.log(`no guards`);
      return;
    }
    if (filteredGuardlist.length > 1) {
      filteredGuardlist = guards.filter((elem) => elem.label !=="default");
    }
    filteredGuardlist = filteredGuardlist.slice(-1); //additional add for showing the latest Mint
    const buttonGuard = {
      label: filteredGuardlist[0] ? filteredGuardlist[0].label : "default",
      allowed: filteredGuardlist[0].allowed,
      startTime: 0n,
      endTime: 0n,
      tooltip: filteredGuardlist[0].reason,
      maxAmount: filteredGuardlist[0].maxAmount,
    };

    // start minting
    dispatch(mintNFT({
      umi,
      buttonGuard,
      candyMachine,
      candyGuard,
      ownedTokens,
      guards,
    }));
  }

  const onShowNftClose = () =>{
    setIsShowNftOpen(false);
    dispatch(resetMintedNFT());
  }

  useEffect(()=>{
    if (!nftMinted && !mintingNFT){
      return;
    }
    setIsVideoEnded(false);
    setIsShowNftOpen(true);
    setTimeout(()=>{
      setMintVideoAnim(true);
    },300);
  }, [nftMinted, mintingNFT]);
  
  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setMintFadeOut(false);
    setTimeout(()=>{
      setMintFadeOut(true);
    },500);
  };
  
  return (
    <>
      <Header />

      {/* page background */}
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
        {/* Page Content */}
        <div className="w-full flex flex-col xl:flex-row justify-between container pt-[12rem] tracking-wider">
          
          {/* Mint info section */}
          <div className={`xl:w-[30%] text-amber-500 grid gap-8 transition-all duration-1000
            ${showTitle ? `opacity-100` : `opacity-0`}`
          }>
            {/* title */}
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

            {/* step 1 text */}
            <div className={`transition-all duration-1000
                ${showTextOne ? `opacity-100` : `opacity-0`}
              `}>
              <div className="flex items-center gap-8 pb-2">
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

            {/* step 2 text */}
            <div className={`transition-all duration-1000
                ${showTextTwo ? `opacity-100` : `opacity-0`}
              `}>
              <div className="flex items-center gap-8 pb-2">
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

            {/* step 3 text */}
            <div className={`transition-all duration-1000
                ${showTextThree ? `opacity-100` : `opacity-0`}
              `}>
              <div className="flex items-center gap-8 pb-2">
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

            {/* Mobile view mint card */}
            <div
              className="w-full block xl:hidden rounded-3xl p-3 mt-[2rem] text-white"
              style={{
                border: "2px solid var(--Color, #F4FBFF)",
                background: "rgba(155, 231, 255, 0.58)",
                boxShadow:
                  "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
                backdropFilter: "blur(15px)",
              }}
            >
              {/* mint card background */}
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

              {/* card content */}
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
                {/* mint countdown */}
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

                {/* treasure box */}
                <img
                  src="/assets/images/clicker-character/nft-treasureBox.png"
                  alt="NFT Treasure Box"
                  className="object-contain w-96 -my-10"
                />

                {/* mint price */}
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

                {/* mint button */}
                <div
                  className={`justify-center items-center inline-flex transition-transform duration-200 
                    ${isAllowed && !mintingNFT ? `hover:scale-105` : ``}`}>
                  {loadingCandyMachine ? 
                  <></>
                  : 
                  <button
                    className={`h-[80px] w-[250px] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] 
                      ${isAllowed ?
                        `bg-[#FFDC62] border-[#E59E69] cursor-pointer`
                        :
                        `bg-slate-400 border-slate-400`}`}
                    disabled={!isAllowed || mintingNFT}
                    onClick={handleMint}>
                      {mintingNFT? 
                        <MoonLoader color={"#E59E69"} size={40} />
                        :
                        <div
                          className="text-center text-white text-3xl font-normal"
                          style={{
                            textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                          }}
                        >
                          <span className="">{isAllowed ? `Mint Now` : `Mint Disabled`}</span>
                        </div>
                      }
                  </button>  
                }
              </div>
                
                <WalletInfo label="Using Wallet"/>
              </div>
            </div>
          
            {/* footer */}
            <div className={`border-2 border-transparent border-t-sky-300 border-dashed py-8 mt-4 font-outfit text-md
              ${showTextSubtext ? `opacity-100` : `opacity-0`}`
            }>
              <div className="flex flex-col items-center xl:items-start">
                <div>
                  <span className="cursor-pointer text-amber-500 hover:text-amber-500">
                    <a
                      href="https://opensea.io/login"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Opensea Link
                    </a>
                  </span>
                  <span className="text-white">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span className="cursor-pointer text-amber-500 hover:text-amber-500">
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
            {/* Mint Panel background */}
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

            {/* mint panel content */}
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
              {/* mint countdown */}
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

              {/* treasure chest */}
              <img
                src="/assets/images/clicker-character/nft-treasureBox.png"
                alt="NFT Treasure Box"
                className="object-contain w-96 -my-10"
              />

              {/* mint button */}
              <div
                  className={`justify-center items-center inline-flex transition-transform duration-200 
                    ${isAllowed && !mintingNFT ? `hover:scale-105` : ``}`}>
                  {loadingCandyMachine ? 
                  <></>
                  : 
                  <button
                    className={`h-[80px] w-[250px] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] 
                      ${isAllowed ?
                        `bg-[#FFDC62] border-[#E59E69] cursor-pointer`
                        :
                        `bg-slate-400 border-slate-400`}`}
                    disabled={!isAllowed || mintingNFT}
                    onClick={handleMint}>
                      {mintingNFT? 
                        <MoonLoader color={"#E59E69"} size={40} />
                        :
                        <div
                          className="text-center text-white text-3xl font-normal"
                          style={{
                            textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                          }}
                        >
                          <span className="">{isAllowed ? `Mint Now` : `Mint Disabled`}</span>
                        </div>
                      }
                  </button>  
                }
              </div>

              {/* wallet info */}
              <WalletInfo label="Using Wallet"/>
            </div>
          </div>
        </div>
      </div>
      {/* NFT modal */}
      {isShowNftOpen?
        <div className="fixed z-[100] inset-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg">
          {!isVideoEnded && (
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-all duration-300 ${mintVideoAnim ? `scale-100` : `scale-0`}`}
              onEnded={handleVideoEnd}
              autoPlay
              controls={false}
            >
              <source src="/assets/videos/Lootbox_Open Anim.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
  
          {isVideoEnded && (
            <div className="fixed z-[100] inset-0 w-screen h-screen flex">
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-lg">
                <div className="flex flex-col p-4 bg-slate-600 rounded-md shadow-lg gap-4">
                  <span className="mx-auto text-3xl">You minted</span>
                  <img 
                    className="max-w-full h-auto"
                    src={nftMinted.offChainMetadata.image}
                    alt="NFT Minted"/>
                  <button
                    className={`flex mx-auto w-24 h-12 p-5 justify-center items-center rounded-[10px] border border-[#E59E69] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] bg-amber-400 hover:bg-amber-300 hover:scale-105 transition-transform duration-300 ease-in-out`}
                    onClick={onShowNftClose}>Yay!</button>
                </div>
              </div>
              <div className={`bg-white z-[101] inset-0 w-screen h-screen pointer-events-none transition-all duration-500 ${mintFadeOut ? `opacity-0` : `opacity-100`}`}></div>
            </div>
          )}
        </div>
        :
        <></>
      }
    </>
  );
}

export default MintPage;
