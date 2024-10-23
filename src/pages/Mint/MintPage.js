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
import { getUser, mintNFT, useMintingNFT, useNFTMinted, resetMintedNFT, useBindWalletLoading, useUserDetails, useMintDate } from "../../sagaStore/slices/userSlice.js";
import { useMobileMenuOpen } from '../../sagaStore/slices';
import { startCountdown } from "../../firebase/countDown";
import MintingWarningNotice from "../../components/MintingWarningNotice.jsx";
import MintingVipPass from "../../components/MintingVipPass.jsx";
import { useCallback } from "react";

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
          if (candyMachine.version !== AccountVersion.V2) {
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
  const mobileMenuOpen = useMobileMenuOpen();
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
  const { candyMachine, candyGuard } = useCandyMachine(umi, candyMachineId, checkEligibility, firstRun, setFirstRun);
  const [isAllowed, setIsAllowed] = useState(false);
  const [loadingCandyMachine, setLoadingCandyMachine] = useState(true);
  const [isContainerVisible, setIsContainerVisible] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [showTextOne, setShowTextOne] = useState(false);
  const [showTextTwo, setShowTextTwo] = useState(false);
  const [showTextThree, setShowTextThree] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
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
  const [videoSource, setVideoSource] = useState('https://storage.animara.world/unhappy-ghost.webm');
  const videoRef = useRef(null);
  const [isMobileApp] = useState(
    /android|iPad|iPhone|iPod/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
  const [isPhantomInstalled] = useState(window.phantom?.solana?.isPhantom);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [isPassOpen, setIsPassOpen] = useState(false);
  const [tutorialVid, setTutorialVid] = useState(null);
    
  // Toggle VIP pass component
  const handlePassClick = () => {
    setIsPassOpen(true); 
  };

  const closePass = () => {
    setIsPassOpen(false); 
  };

  // Toggle notice component
  const handleInfoClick = () => {
    setIsNoticeOpen(true); 
  };

  const closeNotice = () => {
    setIsNoticeOpen(false); 
  };

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

    const timerTutorial = setTimeout(() => {
      setShowTutorial(true);
    }, 800);

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
      clearTimeout(timerTutorial);
      clearTimeout(timerSubtext);
      clearTimeout(timerMintPanel);
      clearTimeout(timerCharacter);
    };
  }, []);

  useEffect(() => {
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
  }, [mintDate]);

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
        if (guard.reason === "Not enough SOL!") {
          setInsufficentBalance(true);
        }
        if (guard.reason === "Wallet does not exist"){
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
  }, [umi, checkEligibility, firstRun, currentUser, walletAddr]);

  const handleMintOrBind = () => {
    if (currentUser?.walletAddr === '') {
      setShowWalletBindingPanel(true);
      setWalletBindingAnim(true);
      setTimeout(() => {
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
      filteredGuardlist = guards.filter((elem) => elem.label !== "default");
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

  const handleBackToMint = () => {
    setWalletBindingAnim(true);
    setTimeout(() => {
      setWalletBindingAnim(false);
      setShowWalletBindingPanel(false);
    }, 300);
  }

  const onShowNftClose = () => {
    setIsShowNftOpen(false);
    dispatch(resetMintedNFT());
    dispatch(getUser());
  }

  useEffect(() => {
    if (!mintingNFT || !nftMinted) {
      setGhostExcited(false);
      return;
    }
    setGhostExcited(true);
    setIsVideoEnded(false);
    setIsShowNftOpen(true);
    setTimeout(() => {
      setMintVideoAnim(true);
    }, 300);
  }, [nftMinted, mintingNFT]);

  const handleVideoEnd = () => {
    setIsVideoEnded(true);
    setMintFadeOut(false);
    setTimeout(() => {
      setMintFadeOut(true);
    }, 500);
  };

  const handleVideoError = () =>{
    setIsVideoEnded(true);
    setMintFadeOut(false);
    setTimeout(() => {
      setMintFadeOut(true);
    }, 500);
  }

  useEffect(() => {
    if (ghostExcited) {
      setVideoSource(isMobileApp ? '/assets/images/happy-ghost.webp' : 'https://storage.animara.world/happy-ghost.webm');
    } else {
      setVideoSource(isMobileApp ? '/assets/images/unhappy-ghost.webp' : 'https://storage.animara.world/unhappy-ghost.webm');
    }
  }, [ghostExcited, isMobileApp]);

  const openPhantom = () =>{
    // Get the current URL
    const currentUrl = encodeURIComponent(window.location.href);
    
    // tries to open phantom wallet's in-app browser
    window.location.href = `https://phantom.app/ul/browse/${currentUrl}?ref=`;
  }

  const getRemainingNFTs = useCallback(()=>{
    if (!candyMachine){
      return `loading`
    }
    const nftsLeft = (Number(candyMachine.data.itemsAvailable) - Number(candyMachine.itemsRedeemed))
    const nftsAvailalbe = Number(candyMachine.data.itemsAvailable);
    if (nftsLeft === 0){
      return ``
    }
    return `${nftsLeft.toLocaleString()}/${nftsAvailalbe.toLocaleString()}`;
  }, [candyMachine]);

  return (
    <>
      {/* page background */}
      <div className={`min-h-screen flex flex-col z-[-20]`}
        style={{
          backgroundImage:
            'url("/assets/images/clicker-character/clickerWall.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
        >

          <Header />

          <div className={`flex-1 w-full flex flex-col pb-24  ${mobileMenuOpen ? `hidden` : ``}`}>
            {/* Page Content */}
            <div className="container flex flex-col justify-between w-full tracking-wider xl:flex-row">

              {/* Floating Coins */}
              <img
                className="absolute right-[5%] lg:right-[50%] top-[20%] lg:top-[20%] transform -translate-x-1/2 -translate-y-1/2 z-[20] opacity-65 w-[60px] lg:w-[120px] pointer-events-none"
                src="/assets/images/coin-3.webp"
                alt=""
              />

              <img
                className="absolute right-[12%] lg:right-[45%] top-[50%] lg:top-[50%] transform -translate-x-1/2 -translate-y-1/2 z-[20] opacity-65 w-[40px] lg:w-[120px] pointer-events-none"
                src="/assets/images/coin-4.webp"
                alt=""
              />

              <img
                className="absolute left-[12%] lg:left-[17%] top-[50rem] lg:top-[60rem] transform -translate-x-1/2 -translate-y-1/2 z-[20] opacity-65 w-[60px] lg:w-[120px] pointer-events-none"
                src="/assets/images/coin-5.webp"
                alt=""
              />

              {/* Mint info section */}
              <div className={`w-full xl:w-[45%] text-amber-500 transition-all duration-500 z-[40]
                ${showTitle ? `opacity-100` : `opacity-0`}`
              }>
                {/* title */}
                <div className="w-full mb-8 text-center xl:text-left">
                  <span
                    className="text-3xl lg:text-5xl"
                  >
                    MINT OUR
                  </span>
                  <br />
                  <span
                    className="text-5xl lg:text-7xl"
                  >
                    NFTs NOW!
                  </span>
                </div>

                {/* step 1 text */}
                <div className={`w-full mb-8 transition-all duration-500
                    ${showTextOne ? `opacity-100` : `opacity-0`}
                  `}>
                  <div className="transition-all duration-500 hover:scale-105">
                    <div className="flex items-center gap-8 pb-2">
                      <img
                        src={"/assets/images/clicker-character/gem.webp"}
                        alt="gem"
                        className="w-6 h-6 ml-2"
                      />
                      <h3 className="w-full text-2xl text-white text-wrap ">STEP 1</h3>
                    </div>
                    <p
                      className="text-[#c4c4c4] text-base font-medium font-outfit leading-tight tracking-wide"
                    >
                      Mint your nft and unlock your <span className="text-base font-bold leading-tight tracking-wide text-white">Animara (VIP Value Pass)</span> today.
                    </p>
                  </div>
                </div>

                {/* step 2 text */}
                <div className={`w-full mb-8 transition-all duration-500
                    ${showTextTwo ? `opacity-100` : `opacity-0`}
                  `}>
                  <div className="transition-all duration-500 hover:scale-105">
                    <div className="flex items-center gap-8 pb-2">
                      <img
                        src={"/assets/images/clicker-character/gem.webp"}
                        alt="gem"
                        className="w-6 h-6 ml-2"
                      />
                      <h3 className="w-full text-2xl text-white text-wrap ">STEP 2</h3>
                    </div>
                    <p
                      className="text-[#c4c4c4] text-base font-medium font-outfit leading-tight tracking-wide"
                    >
                      Link your phantom wallet , start own your <span className="text-base font-bold leading-tight tracking-wide text-white">NFT Character</span> on Animara.
                    </p>
                  </div>
                </div>

                {/* step 3 text */}
                <div className={`mb-8 transition-all duration-500
                    ${showTextThree ? `opacity-100` : `opacity-0`}
                  `}>
                  <div className="transition-all duration-500 hover:scale-105">
                    <div className="flex items-center gap-8 pb-2">
                      <img
                        src={"/assets/images/clicker-character/gem.webp"}
                        alt="gem"
                        className="w-6 h-6 ml-2"
                      />
                      <h3 className="w-full text-2xl text-white text-wrap ">STEP 3</h3>
                    </div>
                    <p
                      className="text-[#c4c4c4] text-base font-medium font-outfit leading-tight tracking-wide"
                    >
                      Compete in the Animara leaderboard event and compete to win prizes worth up to <span className="text-base font-bold leading-tight tracking-wide text-white">365k USDC</span>!
                    </p>
                  </div>
                </div>

                {/* Click to view Tutorial */}
                <div className={`mb-8 pb-12 md:pb-0 lg:pb-0 transition-all duration-500
                    ${showTutorial ? `opacity-100` : `opacity-0`}
                  `}>
                  <div className="items-center sm:flex lg:flex">
                    <img
                      src={"/assets/images/mint_video_icon.webp"}
                      alt="video"
                      className="mx-auto sm:ml-0 sm:mr-2 lg:ml-0 lg:mr-2 w-[120px] h-[120px]"
                    />
                    <div className="inline text-center sm:text-left lg:text-left">
                      <h3 className="w-full text-2xl text-white uppercase text-wrap">click to view tutorial video now!</h3>
                      <ul className="mx-auto sm:flex lg:flex sm:justify-start lg:justify-start">
                        <li><button
                          onClick={() => setTutorialVid("https://storage.animara.world/mint-anim.mp4")} // TODO: change link after video provided
                          className="text-[#80E8FF] text-lg font-outfit font-medium leading-normal underline transition-all duration-300 hover:scale-105 hover:font-bold hover:text-[#98e6f8] mb-2"
                        >
                          Guide to Mint the NFT
                        </button></li>
                        <li>
                        <span className="hidden text-lg text-white sm:block lg:block font-outfit">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        </li>
                        <li>
                        <button
                          onClick={() => setTutorialVid("https://storage.animara.world/depletion-reward-w-number.webm")} // TODO: change link after video provided
                          className="text-[#80E8FF] text-lg font-outfit font-medium leading-normal underline transition-all duration-300 hover:scale-105 hover:font-bold hover:text-[#98e6f8] mb-2"
                        >
                          Link Phantom Wallet
                        </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Mobile Ghost character view */}
                <div className="w-full z-0 max-h-[50dvh] flex xl:hidden items-center mt-[-4rem] mb-[-10rem] animate-pulse">
                  {isMobileApp?
                    <img 
                      src={videoSource}
                      alt="ghost"
                      className="mx-auto pointer-events-none rounded-3xl"
                    />
                    :
                    <video
                      className="mx-auto pointer-events-none rounded-3xl"
                      controls={false}
                      autoPlay
                      loop
                      muted
                      playsInline
                    >
                      <source src={videoSource} type="video/webm" />
                      Your browser does not support the video tag.
                    </video>
                  }
                </div>

                {/* Mobile view mint card */}
                <div
                  className="z-10 w-full block xl:hidden rounded-3xl p-4 mt-[2rem] text-white"
                  style={{
                    border: "2px solid var(--Color, #F4FBFF)",
                    background: "rgba(155, 231, 255, 0.58)",
                    boxShadow:
                      "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
                    backdropFilter: "blur(15px)",
                  }}
                >
                  {/* mint card background */}
                  <div className="absolute flex justify-between w-full -top-8 safari-hidden">
                    <img
                      src={"/assets/images/clicker-character/ring01.webp"}
                      alt="ring"
                      className="absolute object-cover w-11 left-2"
                    />
                    <img
                      src={"/assets/images/clicker-character/ring01.webp"}
                      alt="ring"
                      className="object-cover opacity-0 w-11"
                    />
                    <img
                      src={"/assets/images/clicker-character/ring02.webp"}
                      alt="ring"
                      className="absolute object-cover w-11 right-8"
                    />
                  </div>

                  {/* card content */}
                  <div
                    className="flex flex-col items-center rounded-2xl place-content-center p-6 min-h-[60vh] xl:min-h-[80dvh] 2xl:min-h-[50dvh]"
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
                        <p className="pb-1 text-md">Minting Ends In</p>
                        <div className="h-[50px] justify-start items-center inline-flex gap-1 pb-3">
                          <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                            <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
                              <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                                {timeLeft.days}
                              </div>
                            </div>
                            <div className="text-center text-white text-[7px] font-outfit uppercase">
                              Days
                            </div>
                          </div>
                          <span className="text-2xl font-semibold text-white font-outfit">
                            :
                          </span>
                          <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                            <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
                              <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                                {timeLeft.hours}
                              </div>
                            </div>
                            <div className="text-center text-white text-[7px] font-outfit uppercase">
                              Hours
                            </div>
                          </div>
                          <span className="text-2xl font-semibold text-white font-outfit">
                            :
                          </span>
                          <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                            <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
                              <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                                {timeLeft.minutes}
                              </div>
                            </div>
                            <div className="text-center text-white text-[7px] font-outfit uppercase">
                              Minutes
                            </div>
                          </div>
                          <span className="text-2xl font-semibold text-white font-outfit">
                            :
                          </span>
                          <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                            <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
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
                      className="object-contain h-auto -mt-2 -mb-2 w-72 hover:animate-treasureBoxTwerk"
                    />

                    {/* Remaining NFTs */}
                    <div className="inline-flex flex-col items-center justify-center w-full">
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="z-10 text-xl text-center text-amber-300"
                          style={{
                            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                          }}
                        >
                          {getRemainingNFTs() !== '' ? getRemainingNFTs() : 'NFTs Sold Out'}
                          {getRemainingNFTs() !== '' ? <span className="text-white"> NFTs Remaining</span> : <></>}
                        </div>
                      </div>
                    </div>
                    
                    {/* mint price */}
                    <div className="inline-flex flex-col items-center justify-center w-full">
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className="z-10 text-5xl text-center text-amber-500"
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

                    {/* Mobile minting row*/}
                    {getRemainingNFTs() !== '' 
                    ? <div className="-mb-4 w-full flex flex-row items-center justify-evenly ml-[-2rem] xs:ml-0">
                      {/* VIP pass button */}
                      <div className="w-auto mr-[-2rem] mb-[5rem] z-[50]"> 
                        <img
                          src="/assets/icons/vip-pass.webp"
                          alt="vip pass icon"
                          className="w-full h-auto transition-transform duration-200 scale-125 hover:scale-110 "
                          onClick={handlePassClick} 
                        />
                      </div>

                      {/* Mobile mint button */}
                      <div
                        className={`w-[70%] xs:w-[80%] justify-center items-center inline-flex z-[10] transition-transform duration-200
                          ${(isAllowed && !mintingNFT) || currentUser?.walletAddr === '' ? `hover:scale-105` : ``}`}
                          onMouseEnter={() => isAllowed ? setGhostExcited(true) : setGhostExcited(false)}
                          onMouseLeave={() => !mintingNFT ? setGhostExcited(false) : setGhostExcited(true)}>
                        {!isPhantomInstalled ? 
                          <button
                            className="h-[80px] w-[250px] m-auto bg-[#FFDC62] border-[#E59E69] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)]"
                            onClick={openPhantom}>
                            <span className='font-normal text-center text-white text-l alg:text-3xl'>
                              {`Open in Phantom Wallet`}    
                            </span>
                          </button>
                        : 
                          loadingCandyMachine ? 
                            <span className='h-20 m-auto text-xl text-amber-300 lg:text-3xl animate-pulse'>
                              {`Loading`} 
                            </span>
                            :
                            <button
                              className={`h-[80px] w-[250px] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] 
                                ${isAllowed || currentUser?.walletAddr === '' ?
                                  `bg-[#FFDC62] border-[#E59E69] `
                                  :
                                  `bg-slate-400 border-slate-400`}`}
                              disabled={(!isAllowed || mintingNFT) && currentUser?.walletAddr !== ''}
                              onClick={handleMintOrBind}>
                              {mintingNFT ?
                                <MoonLoader color={"#E59E69"} size={40} />
                                :
                                <div
                                  className="text-lg font-normal text-center text-white"
                                  style={{
                                    textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                                  }}
                                >
                                  <span className="">{currentUser?.walletAddr === '' ? `Bind Wallet` : isAllowed ? `Mint Now` : insufficentBalance ? `Insufficient Funds` : `Mint Disabled`}</span>
                                </div>
                              }
                            </button>
                        }
                      </div>

                      {/* Info button */}
                      <div className="w-[30%]"> 
                        <img
                          src="/assets/icons/info.webp"
                          alt="info icon"
                          className="w-full md:w-[30%] h-auto ml-[1rem] transition-transform duration-200 hover:scale-110 "
                          onClick={handleInfoClick} 
                        />
                      </div>
                      </div>
                    : <></>}

                    <WalletInfo label="Using Wallet" />
                  </div>
                </div>

                {/* footer */}
                <div className={`border-2 border-transparent border-t-sky-300 border-dashed py-8 mt-4 font-outfit text-md
                  ${showTextSubtext ? `opacity-100` : `opacity-0`}`
                }>
                  <div className="flex flex-col items-center xl:items-start">
                    {/* Web3 links */}
                    <div className="flex">
                      <a
                        className="mb-2 text-lg font-medium leading-normal underline transition-all duration-300 text-amber-500 hover:scale-105 hover:font-bold hover:text-amber-400"
                        href="https://solscan.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Solscan
                      </a>

                      <span className="text-lg text-white">&nbsp;&nbsp;|&nbsp;&nbsp;</span>

                      <a
                        className="mb-2 text-lg font-medium leading-normal underline transition-all duration-300 text-amber-500 hover:scale-105 hover:font-bold hover:text-amber-400"
                        href="https://wallet.magiceden.io/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Magic Eden
                      </a>

                    </div>
                    {/* mainnet desc */}
                    <p className="text-[#c4c4c4] text-sm font-medium leading-normal">
                      You must be on the Solana MainNet to mint.
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop View */}
              <div
                className={`w-full xl:w-[50%] p-3 hidden xl:block rounded-3xl transition-all duration-500
                  ${slideMintPanel ? `translate-x-0 opacity-100` : `translate-x-60 opacity-0`}`}
                style={{
                  border: "2px solid var(--Color, #F4FBFF)",
                  background: "rgba(155, 231, 255, 0.58)",
                  boxShadow:
                    "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
                  backdropFilter: "blur(15px)",
                }}
              >
                {/* Mint Panel background */}
                <div className="absolute flex justify-between w-full -top-8">
                  <img
                    src={"/assets/images/clicker-character/ring01.webp"}
                    alt="ring"
                    className="absolute object-cover w-11 left-2"
                  />
                  <img
                    src={"/assets/images/clicker-character/ring01.webp"}
                    alt="ring"
                    className="object-cover opacity-0 w-11"
                  />
                  <img
                    src={"/assets/images/clicker-character/ring02.webp"}
                    alt="ring"
                    className="absolute object-cover w-11 right-8"
                  />
                </div>

                {/* mint panel content */}
                <div
                  className="flex flex-col items-center h-full p-6 bg-opacity-75 rounded-2xl place-content-center"
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
                    <div className="-mt-24 p-3 px-6 bg-[#003260] rounded-3xl shadow-inner border border-[#7fc1ff] flex-col justify-self-center items-center gap-2 inline-flex">
                      <p className="pb-1 text-md">Minting Ends In</p>
                      <div className="h-[50px] justify-start items-center inline-flex gap-1 pb-3">
                        <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                          <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
                            <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                              {timeLeft.days}
                            </div>
                          </div>
                          <div className="text-center text-white text-[7px] font-outfit uppercase">
                            Days
                          </div>
                        </div>
                        <span className="text-2xl font-semibold text-white font-outfit">
                          :
                        </span>
                        <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                          <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
                            <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                              {timeLeft.hours}
                            </div>
                          </div>
                          <div className="text-center text-white text-[7px] font-outfit uppercase">
                            Hours
                          </div>
                        </div>
                        <span className="text-2xl font-semibold text-white font-outfit">
                          :
                        </span>
                        <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                          <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
                            <div className="text-center text-white text-[26px] tracking-wide font-outfit">
                              {timeLeft.minutes}
                            </div>
                          </div>
                          <div className="text-center text-white text-[7px] font-outfit uppercase">
                            Minutes
                          </div>
                        </div>
                        <span className="text-2xl font-semibold text-white font-outfit">
                          :
                        </span>
                        <div className="w-12 h-1/2 bg-[#003260] shadow-inner flex-col justify-center items-center gap-1 inline-flex">
                          <div className="flex flex-col items-center justify-center w-12 h-8 gap-4">
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
                    className="object-contain -mt-2 -mb-10 w-96 h-96 hover:animate-treasureBoxTwerk"
                  />

                  {/* Remaining NFTs */}
                  <div className="inline-flex flex-col items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="z-10 text-xl text-center text-amber-300"
                        style={{
                          textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {getRemainingNFTs() !== '' ? getRemainingNFTs() : 'NFTs Sold Out'}
                        {getRemainingNFTs() !== '' ? <span className="text-white"> NFTs Remaining</span> : <></>}
                      </div>
                    </div>
                  </div>

                  {/* mint price */}
                  <div className="inline-flex flex-col items-center justify-center w-full">
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className="z-10 text-6xl text-center text-amber-500"
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

                  {/* Desktop Minting row */}
                  {getRemainingNFTs() !== '' 
                  ? <div className="flex flex-row items-center justify-center w-full">
                      {/* VIP pass button */}
                      <div className="w-[30%]"> 
                        <img
                          src="/assets/icons/vip-pass.webp"
                          alt="vip pass icon"
                          className="w-full h-full transition-transform duration-200 hover:scale-110 "
                          onClick={handlePassClick} 
                        />
                      </div>

                      {/* Minting button */}
                      <div
                        className={`w-[40%] justify-center items-center inline-flex transition-transform duration-200 
                            ${(isAllowed && !mintingNFT) || currentUser?.walletAddr === '' ? `hover:scale-105` : ``}`}
                        onMouseEnter={() => isAllowed ? setGhostExcited(true) : setGhostExcited(false)}
                        onMouseLeave={() => !mintingNFT ? setGhostExcited(false) : setGhostExcited(true)}
                      >
                        {!isPhantomInstalled ? 
                          <button
                            className="h-[80px] w-[250px] m-auto"
                            onClick={openPhantom}>
                            <span className='font-normal text-center text-white text-l alg:text-3xl'>
                              {`Open Phantom Wallet`}    
                            </span>
                          </button>
                          :
                          loadingCandyMachine ?
                            <span className='h-20 m-auto text-xl text-amber-300 lg:text-3xl animate-pulse'>
                              {`Loading`}  
                            </span>
                            :
                            <button
                              className={`h-[80px] w-[250px] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] 
                                ${isAllowed || currentUser?.walletAddr === '' ?
                                  `bg-[#FFDC62] border-[#E59E69] `
                                  :
                                  `bg-slate-400 border-slate-400`}`}
                              disabled={(!isAllowed || mintingNFT) && currentUser?.walletAddr !== ''}
                              onClick={handleMintOrBind}>
                              {mintingNFT ?
                                <MoonLoader color={"#E59E69"} size={40} />
                                :
                                <div
                                  className="text-lg font-normal text-center text-white"
                                  style={{
                                    textShadow: "0px 2px 0.6px rgba(240, 139, 0, 0.66)",
                                  }}
                                >
                                  <span className="">{currentUser?.walletAddr === '' ? `Bind Wallet` : isAllowed ? `Mint Now` : insufficentBalance ? `Insufficient Funds` : `Mint Disabled`}</span>
                                </div>
                              }
                            </button>
                        }
                      </div>

                      {/* Info button */}
                      <div className="w-[30%]"> 
                        <img
                          src="/assets/icons/info.webp"
                          alt="info icon"
                          className="w-[2rem] h-auto ml-[1rem] transition-transform duration-200 hover:scale-110 "
                          onClick={handleInfoClick} 
                        />
                      </div>
                    </div> 
                  : <></>}

                  {/* wallet info */}
                  <WalletInfo label="Using Wallet" />
                </div>
              </div>

              {/* Desktop Ghost character view */}
              <div className={`w-[30%] ml-[-20rem] hidden lg:flex items-end mr-[-10rem] animate-pulse z-[50] transition-all duration-1000 pointer-events-none ${slideCharacter ? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}>
                <video
                  className="rounded-3xl"
                  controls={false}
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={videoSource} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>

      </div>

      {/* Tutorial video popup modal */}
      {tutorialVid && (
        <div className="fixed top-0 left-0 bg-[rgba(0,0,0,0.8)] w-full h-full z-[99]">
          <span 
            className="absolute top-2 right-5 text-[50px] font-bold text-white hover:scale-110 transition-transform duration-200"
            onClick={() => setTutorialVid(null)}>
              &times;
          </span>
          <video  
            className="block max-w-[95%] max-h-[95%] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 object-contain border-2 border-white"
            autoPlay
            controls
            playsInline>
              <source src={tutorialVid} type="video/webm" />
              Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Conditionally render the MintingWarningNotice component */}
      {isPassOpen && <MintingVipPass onClose={closePass} />}

      {/* Conditionally render the MintingVipPass component */}
      {isNoticeOpen && <MintingWarningNotice onClose={closeNotice} />}

      {/* Bind Wallet Modal */}
      {showWalletBindingPanel? 
        <div className={`fixed z-[100] inset-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg transition-all duration-300 
          ${walletBindingAnim ? `opacity-0` : `opacity-100`}
          ${window.innerHeight < 800 
            ? window.innerWidth > 500  ? '': 'flex-col'
            : `flex-col`}`}>
          {/* wallet binding panel */}
          <div className="flex duration-300 transiton-all">
            <WalletBindingPanel className="w-full p-12 my-auto lx:w-1/2" />
          </div>

          <button
            className={`text-2xl rounded-lg m-8 mt-0 py-2 px-8 hover:scale-110 transition-all duration-300
              ${currentUser?.walletAddr !== '' && !bindingWallet ? `bg-amber-400` : bindingWallet ? `bg-slate-400` : `bg-red-400 `}`}
            disabled={bindingWallet}
            onClick={handleBackToMint}
          >
            {currentUser?.walletAddr !== '' && !bindingWallet ? `Back to Mint` : `Close`}
          </button>
        </div>
        :
        <></>
      }

      {/* NFT modal */}
      {isShowNftOpen ?
        <div className="fixed z-[100] inset-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg">
          {!isVideoEnded && nftMinted && (
            <video
              ref={videoRef}
              className={`w-full h-full object-cover transition-all duration-300 ${mintVideoAnim ? `scale-100` : `scale-0`}`}
              onEnded={handleVideoEnd}
              onError={handleVideoError}
              autoPlay
              playsInline
              controls={false}
            >
              <source src="https://storage.animara.world/mint-anim.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {isVideoEnded && (
            <div className="fixed inset-0 backdrop-blur-xl flex justify-center items-center z-[200] overflow-hidden">
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
                <div className="w-full bg-gradient-to-t from-[#78bff2e1] to-[#7ae0ffe1] flex flex-col items-start p-[1rem] xl:p-[2rem] rounded-xl shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex justify-center w-full">
                    <span className="text-2xl xl:text-4xl text-center font-normal tracking-widest uppercase mb-[1rem] xl:mb-[2rem]">You minted</span>
                  </div>
                  <div className="flex justify-center w-full">
                    <img 
                      className="w-[20rem] xl:w-[26rem] h-[20rem] xl:h-[26rem] mb-4"
                      src={nftMinted.offChainMetadata.image}
                      alt="NFT Minted"
                    />
                  </div>
                  <span className="text-2xl font-normal text-left uppercase xl:text-4xl">{nftMinted.offChainMetadata.name}</span>
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
              <div className={`flex justify-center items-center bg-white absolute z-[101] inset-0 w-screen h-screen pointer-events-none transition-all duration-300 ${mintFadeOut ? `opacity-0` : `opacity-100`}`}>
                <span className="m-auto text-5xl text-center text-amber-400 animate-pulse">Loading</span>
              </div>
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
