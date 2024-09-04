import React, { useEffect, useState, useMemo, useRef } from "react";
import { publicKey } from "@metaplex-foundation/umi";
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { fetchCandyMachine, safeFetchCandyGuard, AccountVersion } from "@metaplex-foundation/mpl-candy-machine";
import { toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { useUmi } from "../../web3/useUmi.ts";
import { guardChecker } from "../../web3/checkAllowed.ts";
import { useSolanaTime } from "../../web3/SolanaTimeContext.tsx";
import Header from "../../components/Header.jsx";
import WalletInfo from "../../components/SolanaWallet/WalletInfo.jsx";
import WalletBindingPanel from "../../components/SolanaWallet/WalletBindingPanel.jsx";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import { mintNFT, useMintingNFT, useNFTMinted, resetMintedNFT, useBindWalletLoading, useUserDetails, useMintDate } from "../../sagaStore/slices/userSlice.js";
import { startCountdown } from "../../firebase/countDown";

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
          toast("Minting not available");
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
  const currentUser = useUserDetails();
  const mintDate = useMintDate();
  const bindingWallet = useBindWalletLoading();
  const mintingNFT = useMintingNFT();
  const nftMinted = useNFTMinted();
  const umi = useUmi();
  const solanaTime = useSolanaTime();
  const { publicKey: walletAddr } = useWalletMultiButton({
    onSelectWallet() {
    },
  });
  const [guards, setGuards] = useState([
    { label: "startDefault", allowed: false, maxAmount: 0 },
  ]);
  const [ownedTokens, setOwnedTokens] = useState();
  const candyMachineId = useMemo(() => {
    if (process.env.REACT_APP_CANDY_MACHINE_ID) {
      return publicKey(process.env.REACT_APP_CANDY_MACHINE_ID);
    } else {
      console.error(`failed to get candy machien id cuz No REACT_APP_CANDY_MACHINE_ID in .env!`);
      toast('failed to get candy machien id cuz No REACT_APP_CANDY_MACHINE_ID in .env!');
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
  const [slideCharacter, setSlideCharacter] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isShowNftOpen, setIsShowNftOpen] = useState(false);
  const [insufficentBalance, setInsufficentBalance] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const [mintVideoAnim, setMintVideoAnim] = useState(false);
  const [mintFadeOut, setMintFadeOut] = useState(false);
  const [showWalletBindingPanel, setShowWalletBindingPanel] = useState(false);
  const [walletBindingAnim, setWalletBindingAnim] = useState(false);
  const [ghostExcited, setGhostExcited] = useState(false);
  const [videoSource, setVideoSource] = useState('/assets/videos/unhappy-ghost.webm');
  const videoRef = useRef(null);

  // intro animation & fetch countdown
  useEffect(() => {
    // intro animations
    const timerTitle = setTimeout(() => {
      setShowTitle(true);
    }, 250);

    const timerTextOne = setTimeout(() => {
      setShowTextOne(true);
    }, 500);

    const timerTextTwo = setTimeout(() => {
      setShowTextTwo(true);
    }, 600);

    const timerTextThree = setTimeout(() => {
      setShowTextThree(true);
    }, 700);

    const timerSubtext = setTimeout(() => {
      setShowSubtext(true);
    }, 900);

    const timerMintPanel = setTimeout(() => {
      setSlideMintPanel(true);
    }, 1);

    const timerCharacter = setTimeout(() => {
      setSlideCharacter(true);
    }, 1);  

    return () => {
      clearTimeout(timerTitle);
      clearTimeout(timerTextOne);
      clearTimeout(timerTextTwo);
      clearTimeout(timerTextThree);
      clearTimeout(timerSubtext);
      clearTimeout(timerMintPanel);
      clearTimeout(timerCharacter);
    };
  }, []);

  useEffect(()=>{
    // start minting deadline
    const fetchAndStartCountdown = async () => {
      if (mintDate) {
        const cleanup = startCountdown(
          mintDate,
          setTimeLeft,
          setIsContainerVisible
        );
        return cleanup;
      }
    };
    fetchAndStartCountdown();
  },[mintDate]);

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

      let allowed = false;
      setInsufficentBalance(false);
      for (const guard of guardReturn) {
        if (guard.reason === "Not enough SOL!"){
          setInsufficentBalance(true);
        }
        if (guard.allowed) {
          allowed = true;
          break;
        }
      }
      setIsAllowed(allowed && currentUser?.walletAddr && `${walletAddr}` === currentUser?.walletAddr);

      setLoadingCandyMachine(false);
    };

    checkEligibilityFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [umi, checkEligibility, firstRun, currentUser]);

  const handleMintOrConnect = () =>{
    if (!walletAddr){
      setShowWalletBindingPanel(true);
      setWalletBindingAnim(true);
      setTimeout(()=>{
        setWalletBindingAnim(false);
      }, 300);
      return;
    }
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

  const handleBackToMint = () =>{
    setWalletBindingAnim(true);
    setTimeout(()=>{
      setWalletBindingAnim(false);
      setShowWalletBindingPanel(false);
    }, 300);
  }

  const onShowNftClose = () =>{
    setIsShowNftOpen(false);
    dispatch(resetMintedNFT());
  }

  useEffect(()=>{
    if (!mintingNFT || !nftMinted){
      setGhostExcited(false);
      return;
    }
    setGhostExcited(true);
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

  useEffect(()=>{
    if (ghostExcited){
      setVideoSource('/assets/videos/happy-ghost.webm');
    }else{
      setVideoSource('/assets/videos/unhappy-ghost.webm');
    }
  },[ghostExcited]);
  
  return (
    <>
      <Header />

      {/* page background */}
      <div
        className="flex flex-col xl:flex-row items-center min-h-screen w-full"
        style={{
          backgroundImage:
            'url("/assets/images/clicker-character/clickerWall.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Page Content */}
        <div className="w-full flex flex-col xl:flex-row justify-between container pt-[10rem] xl:pt-[6rem] tracking-wider">
          
          {/* Mint info section */}
          <div className={`xl:w-[30%]  text-amber-500 grid gap-8 transition-all duration-1000
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
              <div className="transition-all duration-500 hover:scale-110">
                <div className="flex items-center gap-8 pb-2">
                  <img
                    src={"/assets/images/clicker-character/gem.webp"}
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
            </div>

            {/* step 2 text */}
            <div className={`transition-all duration-1000
                ${showTextTwo ? `opacity-100` : `opacity-0`}
              `}>
              <div className="transition-all duration-500 hover:scale-110">
                <div className="flex items-center gap-8 pb-2">
                  <img
                    src={"/assets/images/clicker-character/gem.webp"}
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
            </div>

            {/* step 3 text */}
            <div className={`pb-6 transition-all duration-1000
                ${showTextThree ? `opacity-100` : `opacity-0`}
              `}>
              <div className="transition-all duration-500 hover:scale-110">
                <div className="flex items-center gap-8 pb-2">
                  <img
                    src={"/assets/images/clicker-character/gem.webp"}
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
            </div>

            {/* Mobile Ghost character view */}
            <div className="max-h-[50dvh] flex xl:hidden items-center mt-[-4rem] mb-[-13rem] animate-pulse">
              <video
                key={videoSource}
                className="rounded-3xl"
                controls={false}
                autoPlay
                loop
                muted
              >
                <source src={videoSource} type="video/webm" />
                Your browser does not support the video tag.
              </video>
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
                  src={"/assets/images/clicker-character/ring01.webp"}
                  alt="ring"
                  className="object-cover w-11 absolute left-2"
                />
                <img
                  src={"/assets/images/clicker-character/ring01.webp"}
                  alt="ring"
                  className="object-cover w-11 opacity-0"
                />
                <img
                  src={"/assets/images/clicker-character/ring02.webp"}
                  alt="ring"
                  className="object-cover w-11 absolute right-8"
                />
              </div>

              {/* card content */}
              <div
                className="rounded-2xl place-content-center p-6 grid min-h-[60vh] lg:min-h-[80dvh] 2xl:min-h-[50dvh]"
                style={{
                  backgroundImage:
                    'url("/assets/images/clicker-character/mintBBG.webp")',
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
                  src="/assets/images/clicker-character/nft-treasureBox.webp"
                  alt="NFT Treasure Box"
                  className="object-contain w-96 -my-10 hover:animate-treasureBoxTwerk"
                />

                {/* mint price */}
                <div className="w-full flex-col justify-center items-center inline-flex">
                  <div className="flex-col justify-center items-center flex pb-8">
                    <div
                      className="text-center text-amber-500 text-5xl z-10"
                      style={{
                        WebkitTextStrokeWidth: "3.5px",
                        WebkitTextStrokeColor: "var(--COlor-11, #FFF)",
                        textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                      }}
                    >
                      0.99 SOL
                    </div>
                  </div>
                </div>

                {/* mint button */}
                <div
                  className={`justify-center items-center inline-flex transition-transform duration-200 
                    ${(isAllowed && !mintingNFT) || !walletAddr ? `hover:scale-105` : ``}`}
                    onMouseEnter={() => isAllowed ? setGhostExcited(true) : setGhostExcited(false)}
                    onMouseLeave={() => !mintingNFT ? setGhostExcited(false) : setGhostExcited(true)}>
                  {loadingCandyMachine ? 
                    <span className='m-auto text-red-300 text-xl lg:text-3xl'>
                      {`Minting not available yet`}    
                    </span>
                    : 
                    <button
                      className={`h-[80px] w-[250px] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] 
                        ${isAllowed || !walletAddr ?
                          `bg-[#FFDC62] border-[#E59E69] cursor-pointer`
                          :
                          `bg-slate-400 border-slate-400`}`}
                      disabled={(!isAllowed || mintingNFT) && walletAddr}
                      onClick={handleMintOrConnect}>
                        {mintingNFT? 
                          <MoonLoader color={"#E59E69"} size={40} />
                          :
                          <div
                            className="text-center text-white text-2xl font-normal"
                            style={{
                              textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                            }}
                          >
                            <span className="">{!walletAddr ? `Connect Wallet` : isAllowed ? `Mint Now` : insufficentBalance ? `Insufficient Funds` : `Mint Disabled`}</span>
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
                {/* Web3 links */}
                <div className="flex">
                  <span className="text-amber-500 transition-all duration-300 hover:scale-105">
                    <a
                      href="https://solscan.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Solscan
                    </a>
                  </span>
                  <span className="text-white">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                  <span className="text-amber-500 transition-all duration-300  hover:scale-105">
                    <a
                      href="https://wallet.magiceden.io/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Magic Eden
                    </a>
                  </span>
                </div>
                {/* mainnet desc */}
                <p className="text-white text-xs">
                  You must be on the Solana MainNet to mint.
                </p>
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div
            className={`xl:w-[60%] hidden xl:block rounded-3xl p-3 transition-all duration-500
              ${slideMintPanel? `translate-x-0 opacity-100` : `translate-x-60 opacity-0`}`}
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
                src={"/assets/images/clicker-character/ring01.webp"}
                alt="ring"
                className="object-cover w-11 absolute left-2"
              />
              <img
                src={"/assets/images/clicker-character/ring01.webp"}
                alt="ring"
                className="object-cover w-11 opacity-0"
              />
              <img
                src={"/assets/images/clicker-character/ring02.webp"}
                alt="ring"
                className="object-cover w-11 absolute right-8"
              />
            </div>

            {/* mint panel content */}
            <div
              className="rounded-2xl place-content-center p-6 grid min-h-[60vh] lg:min-h-[80dvh] 2xl:min-h-[50dvh]"
              style={{
                backgroundImage:
                  'url("/assets/images/clicker-character/mintBBG.webp")',
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
                src="/assets/images/clicker-character/nft-treasureBox.webp"
                alt="NFT Treasure Box"
                className="object-contain w-96 -my-10 hover:animate-treasureBoxTwerk"
              />

              {/* mint price */}
              <div className="w-full flex-col justify-center items-center inline-flex">
                <div className="flex-col justify-center items-center flex pb-8">
                  <div
                    className="text-center text-amber-500 text-5xl z-10"
                    style={{
                      WebkitTextStrokeWidth: "3.5px",
                      WebkitTextStrokeColor: "var(--COlor-11, #FFF)",
                      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    0.99 SOL
                  </div>
                </div>
              </div>

              {/* Mint button */}
              <div
                  className={`justify-center items-center inline-flex transition-transform duration-200 
                    ${(isAllowed && !mintingNFT) || !walletAddr ? `hover:scale-105` : ``}`}
                    onMouseEnter={() => isAllowed ? setGhostExcited(true) : setGhostExcited(false)}
                    onMouseLeave={() => !mintingNFT ? setGhostExcited(false) : setGhostExcited(true)}
              >
                {loadingCandyMachine ? 
                  <span className='m-auto text-red-300 text-xl lg:text-3xl'>
                    {`Minting not available yet`}  
                  </span>
                  : 
                  <button
                    className={`h-[80px] w-[250px] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] 
                      ${isAllowed || !walletAddr ?
                        `bg-[#FFDC62] border-[#E59E69] cursor-pointer`
                        :
                        `bg-slate-400 border-slate-400`}`}
                    disabled={(!isAllowed || mintingNFT) && walletAddr}
                    onClick={handleMintOrConnect}>
                      {mintingNFT? 
                        <MoonLoader color={"#E59E69"} size={40} />
                        :
                        <div
                          className="text-center text-white text-2xl font-normal"
                          style={{
                            textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                          }}
                        >
                          <span className="">{!walletAddr ? `Connect Wallet` : isAllowed ? `Mint Now` : insufficentBalance ? `Insufficient Funds` : `Mint Disabled`}</span>
                        </div>
                      }
                  </button>  
                }
              </div>

              {/* wallet info */}
              <WalletInfo label="Using Wallet"/>
            </div>
          </div>

          {/* Desktop Ghost character view */}
          <div className={`w-[30%] ml-[-30rem] hidden xl:flex items-end mr-[-10rem] animate-pulse z-[50] transition-all duration-1000 ${slideCharacter ? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}>
            <video
              key={videoSource}
              className="rounded-3xl"
              controls={false}
              autoPlay
              loop
              muted
            >
              <source src={videoSource} type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
      
      {/* Bind Wallet Modal */}
      {showWalletBindingPanel? 
        <div className={`fixed z-[100] inset-0 w-screen h-screen flex flex-col items-center justify-center bg-black/50 backdrop-blur-lg transition-all duration-300 
          ${walletBindingAnim ? `opacity-0` : `opacity-100`}`}>
          {/* wallet binding panel */}
          <div className="flex">
            <WalletBindingPanel className="w-full lx:w-1/2 my-auto p-12" />
          </div>

          {!bindingWallet?
            <button
              className={`text-2xl rounded-lg m-4 mt-8 py-2 px-8 hover:scale-110 transition-all duration-300
                ${walletAddr && !bindingWallet ? `bg-amber-400` : `bg-red-400 `}`}
              onClick={handleBackToMint}
            >
              {walletAddr && !bindingWallet ? `Back to Mint` : `Close`}
            </button>
            :
            <></>
          }
        </div>
        :
        <></>
      }

      {/* NFT modal */}
      {isShowNftOpen?
        <div className="fixed z-[100] inset-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg">
          {!isVideoEnded && nftMinted && (
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
            <div className="fixed inset-0 bg-transparent backdrop-blur-xl rounded-xl flex justify-center items-center z-[200] overflow-hidden">
            {/* Background Image with spinning animation */}
            <div
              className={`absolute w-[2000px] h-[2000px] rotate-image`}
              style={{
                backgroundImage: `url("/assets/images/clicker-character/light-element.webp")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>

          
            {/* Static Content */}
            <div className="relative z-[101] flex flex-col items-center justify-center p-[1rem]">
              <div className="w-full bg-gradient-to-t from-[#78BFF2] to-[#7ADFFF] flex flex-col items-start p-[1rem] xl:p-[2rem] rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                <div className="w-full flex justify-center">
                  <span className="text-2xl xl:text-4xl text-center font-normal tracking-widest uppercase mb-[1rem] xl:mb-[2rem]">You minted</span>
                </div>
                <div className="w-full flex justify-center">
                  <img 
                    className="w-[20rem] xl:w-[26rem] h-[20rem] xl:h-[26rem] mb-4"
                    src={nftMinted.offChainMetadata.image}
                    alt="NFT Minted"
                  />
                </div>
                <span className="text-2xl xl:text-4xl text-left font-normal uppercase">{nftMinted.offChainMetadata.name}</span>
              </div>

              <div>
                <button
                  className="mt-[4rem] text-base xl:text-xl px-[3rem] py-[1rem] flex justify-center items-center rounded-full border border-[#E59E69] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] bg-amber-400 hover:bg-amber-300 hover:scale-110 uppercase transition-transform duration-300 ease-in-out"
                  onClick={onShowNftClose}
                >
                  awesome!
                </button>
              </div>
            </div>

          
            {/* Fade Out Overlay */}
            <div className={`bg-white absolute z-[101] inset-0 w-screen h-screen pointer-events-none transition-all duration-500 ${mintFadeOut ? `opacity-0` : `opacity-100`}`}></div>
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
