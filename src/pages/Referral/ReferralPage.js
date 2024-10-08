import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MoonLoader } from 'react-spinners';
import { FaCopy, FaShareFromSquare } from "react-icons/fa6";
import { useWallet } from '@solana/wallet-adapter-react';
import { getReferralStats, useUserDetails, useReferralStatLoading, useNFTPurchasedReferralCount, useReferralCount, useBasicClaimable, useNftClaimable, claimCashback, useClaimCashbackLoading, useBindWalletLoading, useTotalClaimed } from "../../sagaStore/slices";
import { useMobileMenuOpen } from '../../sagaStore/slices';
import { useAppDispatch } from "../../hooks/storeHooks.js";
import WalletBindingPanel from "../../components/SolanaWallet/WalletBindingPanel.jsx";
import StyledQRCode from "../../components/StyledQRCode";
import Header from "../../components/Header.jsx";
import { PropagateLoader } from "react-spinners";

function ReferralPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useUserDetails();
  const mobileMenuOpen = useMobileMenuOpen();
  const [hasReferralStat, setHasReferralStat] = useState(false);
  const loadingReferralStats = useReferralStatLoading();
  const referralCount = useReferralCount();
  const nftPurchasedReferralCount = useNFTPurchasedReferralCount();
  const basicClaimable = useBasicClaimable();
  const nftClaimable = useNftClaimable();
  const totalClaimed = useTotalClaimed();
  const claimCashbackLoading = useClaimCashbackLoading();
  const bindingWallet = useBindWalletLoading();
  const { sendTransaction } = useWallet();
  const [isXlScreen, setIsXlScreen] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showRefOne, setShowRefOne] = useState(false);
  const [showRefTwo, setShowRefTwo] = useState(false);
  const [showRefThree, setShowRefThree] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselFading, setCarouselFading] = useState(false);
  const [showWalletBindingPanel, setShowWalletBindingPanel] = useState(false);
  const [walletBindingAnim, setWalletBindingAnim] = useState(false);

  // screen size handler
  useEffect(() => {
    // Tailwind's default breakpoint for 'xl' is 1280px
    const mediaQuery = window.matchMedia('(min-width: 1280px)');

    // Function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsXlScreen(event.matches);
    };

    // Set the initial value
    setIsXlScreen(mediaQuery.matches);

    // Add the listener for subsequent changes using the updated approach
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Clean up the listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  // Mobile view carousel content
  const content = [
    {
      image: "/assets/images/clicker-character/ref01.webp",
      alt: "Invite Rewards",
      title: "Invite Rewards",
      description:
        "Get a boost of currencies to use in our Tap-to-Earn game when anyone signs up with your code.",
    },
    {
      image: "/assets/images/clicker-character/ref02.webp",
      alt: "NFT Cashback",
      title: "NFT Cashback",
      description:
        "Accumulate SOL rewards when anyone you invite purchases a piece of our NFT! Maybe you can snatch one for yourself too if you invite enough people...",
    },
    {
      image: "/assets/images/clicker-character/ref03.webp",
      alt: "Rank Up Rewards",
      title: "Rank Up Rewards",
      description:
        "Earn MORE currencies in our Tap-to-Earn game when friends you invite hit certain level milestones in our Tap-to-Earn game.",
    },
  ];

  // intro anim
  useEffect(() => {
    const timerTitle = setTimeout(() => {
      setShowTitle(true);
    }, 1);

    const timerRefOne = setTimeout(() => {
      setShowRefOne(true);
    }, 1);

    const timerRefTwo = setTimeout(() => {
      setShowRefTwo(true);
    }, 1);

    const timerRefThree = setTimeout(() => {
      setShowRefThree(true);
    }, 200);

    const timerPanel = setTimeout(() => {
      setShowPanel(true);
    }, 50);

    return () => {
      clearTimeout(timerTitle);
      clearTimeout(timerRefOne);
      clearTimeout(timerRefTwo);
      clearTimeout(timerRefThree);
      clearTimeout(timerPanel);
    };
  }, []);


  // Mobile view carousel buttons
  const handlePrev = () => {
    if (carouselFading) { return; }
    setCarouselFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? content.length - 1 : prevIndex - 1
      );
      setCarouselFading(false);
    }, 500);
  };

  const handleNext = () => {
    if (carouselFading) { return; }
    setCarouselFading(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === content.length - 1 ? 0 : prevIndex + 1
      );
      setCarouselFading(false);
    }, 500);
  };

  const getInviteLink = useCallback(() => {
    if (!currentUser) {
      return `${window.location.origin}/signup`;
    }
    return `${window.location.origin}/signup?invite-code=${currentUser?.referralCode}`
  }, [currentUser]);

  // fetch referral stats when loading into this page
  useEffect(() => {
    if (!hasReferralStat) {
      dispatch(getReferralStats());
      setHasReferralStat(true);
    }
  }, [dispatch, hasReferralStat]);

  const shareInviteLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Invite Friends",
          text: "Join this awesome app and get 5000 coins!",
          url: getInviteLink(),
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(getInviteLink());
      toast.error("Invite link copied to clipboard!");
    }
  };

  const copyInviteCode = useCallback(() => {
    navigator.clipboard.writeText(currentUser?.referralCode ? currentUser.referralCode : '');
    toast.success('Referral Code copied to clipboard!');
  }, [currentUser]);

  const getTotalClaimable = useCallback(() => {
    if (!currentUser) { return `0 sol`; }


    if (basicClaimable + nftClaimable === 0){
      return `0 sol`;
    }else{
      if (currentUser.ownsNFT){
        // selectively combine both claimable amt based on if user owns nft
        return `${currentUser.ownsNFT ? (basicClaimable + nftClaimable).toFixed(4) : basicClaimable.toFixed(4)}`;
      }else{
        if (basicClaimable !== 0){
          return `${basicClaimable}`;
        }else {
          return `-`;
        }
      }
    }
  }, [currentUser, basicClaimable, nftClaimable]);

  const getAdditionalClaimable = useCallback(() => {
    if (!nftClaimable) { return `0 SOL`; }
    // selectively combine both claimable amt based on if use owns nft
    return `${nftClaimable.toFixed(4)}`;
  }, [nftClaimable]);

  const handleClaimCashbackOrBind = () => {
    if (currentUser.walletAddr === '') {
      // special case 1: has claimable but wallet not binded yet to claim
      setShowWalletBindingPanel(true);
      setWalletBindingAnim(true);
      setTimeout(() => {
        setWalletBindingAnim(false);
      }, 300);
    }else if (!currentUser.ownsNFT && basicClaimable === 0 && nftClaimable >= 0 && currentUser.walletAddr !== ''){
      // special case 2: only have nft claimables to claim but doesnt own nft yet
      navigate('/mint');
    }else {
      // ready to claim cashback
      dispatch(claimCashback({ sendTransaction }));
    }
  };

  const handleBackToMint = () => {
    setWalletBindingAnim(true);
    setTimeout(() => {
      setWalletBindingAnim(false);
      setShowWalletBindingPanel(false);
    }, 300);
  }

  // const openPhantom = () =>{
  //   // Get the current URL
  //   const currentUrl = encodeURIComponent(window.location.href);

  //   // tries to open phantom wallet's in-app browser
  //   window.location.href = `https://phantom.app/ul/browse/${currentUrl}?ref=`;
  // }


  return (
    <>
      {/* page background */}
      <div className={`min-h-screen flex flex-col `}
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

        <div className={`flex-1 w-full flex flex-col z-20 pb-24 ${mobileMenuOpen ? `hidden` : ``}`}>
          {/* content */}
          <div
            className={`container flex flex-col items-center gap-6 tracking-wider transition-opacity duration-500
            ${showTitle ? `opacity-100` : `opacity-0`}`}
          >

            {/* title */}
            <div className="text-center text-white text-3xl uppercase">Refer Friends</div>

            {/* subtitle */}
            <span
              className="text-center text-amber-500 text-6xl uppercase tracking-normal pb-2"
              style={{
                WebkitTextStrokeWidth: "3.5px",
                WebkitTextStrokeColor: "var(--Color-11, #FFF)",
              }}
            >
              Earn Free Plus, RP, and More!
            </span>

            {/* Desktop view */}
            <div className="hidden lg:grid grid-cols-3 gap-12">
              {/* left section */}
              <div className={`w-[75%] h-full mx-auto flex flex-col justify-center items-center hover:scale-110 transition-all duration-500
                ${showRefOne ? `opacity-100` : `opacity-0`}`}>
                <img
                  className="w-4/5 aspect-[1.35] origin-top-left"
                  src="/assets/images/clicker-character/ref01.webp"
                  alt="Invite Rewards"
                />
                <div className="flex flex-col justify-start items-center gap-2">
                  <div className="text-center text-white text-2xl uppercase leading-relaxed">
                    Invite Rewards
                  </div>
                  <div className="w-full origin-top-left text-center text-stone-300 font-outfit text-[12px] leading-tight tracking-wide">
                    Get a boost of currencies to use in our Tap-to-Earn game when anyone signs up with your code.
                  </div>
                </div>
              </div>
              {/* mid section */}
              <div className={`w-[75%] h-full mx-auto flex flex-col justify-center items-center hover:scale-110 transition-all duration-500
                ${showRefThree ? `opacity-100` : `opacity-0`}`}>
                <img
                  className="w-full aspect-[1.22] origin-top-left"
                  src="/assets/images/clicker-character/ref02.webp"
                  alt="NFT Cashback"
                />
                <div className="flex flex-col justify-start items-center gap-2">
                  <div className="text-center text-white text-2xl uppercase leading-relaxed">
                    NFT Cashback
                  </div>
                  <div className="w-full origin-top-left text-center text-stone-300 font-outfit text-[12px] leading-tight tracking-wide">
                    Accumulate SOL rewards when anyone you invite purchases a piece of our NFT! Maybe you can snatch one for yourself too if you invite enough people...
                  </div>
                </div>
              </div>
              {/* right section */}
              <div className={`w-[75%] h-full mx-auto flex flex-col justify-center items-center hover:scale-110 transition-all duration-500
                ${showRefTwo ? `opacity-100` : `opacity-0`}`}>
                <img
                  className="w-4/5 aspect-[1.35] origin-top-left"
                  src="/assets/images/clicker-character/ref03.webp"
                  alt="Rank Up Rewards"
                />
                <div className="flex flex-col justify-start items-center gap-2">
                  <div className="text-center text-white text-2xl uppercase leading-relaxed">
                    Rank Up Rewards
                  </div>
                  <div className="w-full origin-top-left text-center text-stone-300 font-outfit text-[12px] leading-tight tracking-wide">
                    Earn MORE currencies in our Tap-to-Earn game when friends you invite hit certain level milestones in our Tap-to-Earn game.
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile view */}
            <div className="h-[50dvh] relative flex lg:hidden flex-col justify-center items-center mb-[2rem]">
              <div className={`w-[70dvw] h-auto flex flex-col justify-center items-center transition-all duration-500
                ${carouselFading ? `opacity-0` : `opacity-100`}`}>
                <img
                  className="w-[80%] lg:w-[60%] h-auto origin-top-left"
                  src={content[currentIndex].image}
                  alt={content[currentIndex].alt}
                />
                <div className="flex flex-col justify-start items-center gap-2 mt-4">
                  <div className="text-center text-white text-2xl uppercase leading-relaxed">
                    {content[currentIndex].title}
                  </div>
                  <div className="w-[350px] origin-top-left text-center text-stone-300 font-outfit text-[12px] leading-tight tracking-wide">
                    {content[currentIndex].description}
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="absolute top-1/2 hover:scale-150 transition-scale duration-500 transform -translate-y-1/2 left-[-2rem]">
                <button
                  onClick={handlePrev}
                  className="text-white p-2 rounded-full"
                >
                  <img
                    className="w-full h-full"
                    src="/assets/images/clicker-character/arrow-left.webp"
                    alt="left arrow"
                  />
                </button>
              </div>
              <div className="absolute top-1/2 hover:scale-150 transition-scale duration-500 transform -translate-y-1/2 right-[-2rem]">
                <button
                  onClick={handleNext}
                  className="text-white p-2 rounded-full"
                >
                  <img
                    className="w-full h-full "
                    src="/assets/images/clicker-character/arrow-right.webp"
                    alt="right arrow"
                  />
                </button>
              </div>
            </div>

            {/* Desktop bottom panel */}
            <div className={`hidden lg:flex w-full items-center transition-all duration-500
                ${showPanel ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}>
              {/* referral stats & cashback */}
              <div className="w-[60%] flex transition-all duration-300 hover:scale-105"
              >
                {/* Referral stats */}
                <div className="w-[70%] h-auto aspect-[2.33] border-dashed border-r-4 border-transparent">
                  {/* card background */}
                  <div
                    className="flex flex-col w-full h-full py-6"
                    style={{
                      backgroundImage: 'url("/assets/images/clicker-character/ticketWeb02.webp")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Title */}
                    <div className="text-neutral-700 text-xl tracking-wider ml-9">
                      YOUR REFERRAL STATS
                    </div>

                    {/* referral stat content */}
                    <div className="w-full flex my-auto">
                      {loadingReferralStats ?
                        <div className="w-full flex justify-center items-center">
                          <div>
                            <PropagateLoader color={"#FFB23F"} />
                          </div>
                        </div>
                        :
                        <div className="flex flex-row ml-9">
                          {/* NFT Purchase */}
                          <div className="flex w-1/3">
                            <div className="flex flex-col justify-start items-start">
                              <p
                                className="text-amber-500 text-xl lg:text-3xl xl:text-5xl"
                              >
                                {nftPurchasedReferralCount}
                              </p>
                              <p
                                className="text-amber-500 text-base xl:text-xl leading-relaxed"
                              >
                                NFT MINTS
                              </p>
                              <div className="w-[80%] text-neutral-700 text-[0.5rem] xl:text-xs font-semibold font-outfit">
                                How many friend you invited have minted an NFT
                              </div>
                            </div>
                          </div>
                          {/* Friends invited */}
                          <div className="flex w-1/3 mr-3">
                            <div className="flex flex-col justify-start items-start">
                              <p
                                className="text-[#0163BE] text-xl lg:text-3xl xl:text-5xl"
                              >
                                {referralCount}
                              </p>
                              <p
                                className="text-[#0163BE] text-base xl:text-xl leading-relaxed"
                              >
                                FRIENDS INVITED
                              </p>
                              <div className="w-[80%] text-neutral-700 text-[0.5rem] xl:text-xs font-semibold font-outfit">
                                The number of friends who have accepted your invitation to Animara
                              </div>
                            </div>
                          </div>
                          {/* Claimable cashback */}
                          <div className="flex w-1/3">
                            <div className="flex flex-col justify-start items-start">
                              <p className="text-[#FFAA00] text-xl lg:text-3xl xl:text-5xl">
                                {totalClaimed} <span className="text-base font-normal uppercase">sol</span>
                              </p>
                              <p
                                className="text-[#FFAA00] text-base xl:text-lg font-normal leading-relaxed"
                              >
                                total claimed
                              </p>
                              <p className="w-[80%] text-neutral-700 text-[0.5rem] xl:text-xs font-semibold font-outfit mb-2">
                                Track your claimed earnings in total claimed.
                              </p>
                              <p className="text-[#00B9E1] text-sm font-normal font-outfit underline transition-all duration-500 hover:scale-105">
                                View claim history
                              </p>
                            </div>
                          </div>
                        </div>}
                    </div>
                  </div>
                </div>

                {/* Cashback */}
                <div className= "w-[35%] h-auto aspect-[1.246]">
                  <div
                    className="h-full aspect-[1.246] place-content-center"
                    style={{
                      backgroundImage: getTotalClaimable() === '0 sol' ? 'url("/assets/images/clicker-character/ticket-black.webp")' : 'url("/assets/images/clicker-character/ticketWeb01.webp")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {loadingReferralStats ?
                      <div className="w-full flex justify-center items-center">
                        <div>
                          <PropagateLoader color={"#fef3c7"} />
                        </div>
                      </div>
                      :
                      getTotalClaimable() === '0 sol' ?
                        <div className="w-full h-full p-4 flex-col justify-center items-center inline-flex">
                          {/* Claimable Amount */}
                          <div className="flex-col justify-center items-center flex">
                            <div className="mb-2 text-center text-sm font-normal leading-none tracking-wide">NFT Cashback</div>
                            <div
                              className="my-2 text-center text-white text-2xl xl:text-4xl leading-8 tracking-wide"
                              style={{
                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                              }}
                            >
                              {getTotalClaimable()} sol
                            </div>
                          </div>

                          {/* Description */}
                          <div className="w-full flex items-center justify-center">
                            <p className="text-white text-base text-center font-semibold font-outfit tracking-normal">
                              Claim cashbacks by inviting friends to buy NFTs!
                            </p>
                          </div>

                          {/* Claim button */}
                          <div className={`my-auto justify-center items-center inline-flex transition-transform duration-200 hover:scale-105`}>
                            <button
                              className={`bg-[#3C3C3C] h-[48px] w-[160px] rounded-full justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(265,249,228,0.48),0px_5px_4px_0px_rgba(0,0,0,0.48)] cursor-pointer`}
                              onClick={handleClaimCashbackOrBind}>
                              {claimCashbackLoading ?
                                <div className="h-18 w-16 flex justify-center items-center">
                                  <MoonLoader size={25} color={'#d97706'} />
                                </div>
                                :
                                <div
                                  className={`text-center text-white 
                                  ${!currentUser.walletAddr ? 'text-xl' :  getTotalClaimable() === '0 sol' ? 'text-sm ' : 'text-2xl'}`}
                                  style={{
                                    textShadow: '0px 2px 0.6px rgb(71, 85, 105, 0.66)'
                                  }}
                                >
                                  <span className={`hover:text-shadow-none`}>{claimCashbackLoading ? 'Loading' : !currentUser.walletAddr ? `Bind Wallet` : getTotalClaimable() === '0 sol' ? 'Mint Now' : `Claim`}</span>
                                </div>
                              }
                            </button>
                          </div>
                        </div>
                        :
                        <div className="w-full h-full p-4 flex-col justify-center items-center inline-flex">
                          {/* Claimable Amount */}
                          <div className="flex-col justify-center items-center flex">
                            <div className="mb-2 text-center text-sm font-normal leading-none tracking-wide">NFT Cashback</div>
                            <div
                              className="my-2 text-center text-amber-50 text-2xl xl:text-4xl leading-8 tracking-wide"
                              style={{
                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                              }}
                            >
                              {getTotalClaimable()} sol
                            </div>
                          </div>
                          
                          {/* NFT Prompt */}
                          {currentUser?.ownsNFT ?
                            <span className="w-[130px] mt-2 text-amber-50 text-xs font-outfit">Claiming full benefits</span>
                            :
                            <div className="justify-start items-center inline-flex">
                              <span className="w-full min-w-[130px] mt-[0.3rem] mr-2 text-[0.75rem] xl:text-xs font-outfit">Mint NFT to claim <span className="font-LuckiestGuy text-sm tracking-wide">{getAdditionalClaimable()} sol !</span></span>
                            </div>}

                          {/* Claim button */}
                          <div className={`my-auto justify-center items-center inline-flex transition-transform duration-200
                            ${claimCashbackLoading ||  getTotalClaimable() === '0 sol' ? '' : 'hover:scale-105'}`}>
                            <button
                              disabled={claimCashbackLoading ||  getTotalClaimable() === '0 sol'}
                              className={`h-[48px] w-[160px] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer
                                ${claimCashbackLoading ||  getTotalClaimable() === '0 sol' ?
                                  " border-slate-300 bg-slate-300"
                                  :
                                  " border-amber-600 bg-amber-300 hover:bg-amber-400"}`}
                              onClick={handleClaimCashbackOrBind}>
                              {claimCashbackLoading ?
                                <div className="h-18 w-16 flex justify-center items-center">
                                  <MoonLoader size={25} color={'#d97706'} />
                                </div>
                                :
                                <div
                                  className={`text-center text-white 
                                  ${!currentUser.walletAddr ? 'text-xl' : claimCashbackLoading ||  getTotalClaimable() === '0 sol' ? 'text-sm ' : 'text-2xl'}`}
                                  style={{
                                    textShadow: `${claimCashbackLoading ||  getTotalClaimable() === '0 sol' ?
                                      '0px 2px 0.6px rgb(71, 85, 105, 0.66)'
                                      :
                                      '0px 2px 0.6px rgba(240, 139, 0, 0.66)'
                                      }`
                                  }}
                                >
                                  <span className={`hover:text-shadow-none ${claimCashbackLoading ? 'animate-pulse': ''}`}>{claimCashbackLoading ? 'Loading' : !currentUser.walletAddr ? `Bind Wallet` : getTotalClaimable() === '0 sol' ? 'Claimed Everything' : getTotalClaimable() === '-' ? 'Mint Now' : `Claim`}</span>
                                </div>
                              }
                            </button>
                          </div>
                        </div>
                    }
                  </div>
                </div>
              </div>

              {/* share panel */}
              <div className="w-[40%] flex hover:scale-105 transition-all duration-500">
                <div
                  className="flex flex-col w-full h-full aspect-[1.79] place-content-center p-[3rem]"
                  style={{
                    backgroundImage: 'url("/assets/images/clicker-character/QRBg.webp")',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* info section */}
                  <div className="flex w-full justify-end">
                    {/* qr code */}
                    <div className="w-[110px] mr-auto bg-white rounded-lg place-content-center">
                      {isXlScreen ?
                        <StyledQRCode
                          value={getInviteLink()}
                        /> :
                        <></>
                      }
                    </div>

                    <div className="w-2/3 content-center grid gap-2">
                      <div className="text-neutral-700 text-lg tracking-wide">
                        Referral Code
                      </div>
                      <div className="flex items-center w-full relative">
                        <input
                          type="text"
                          value={currentUser?.referralCode}
                          readOnly={currentUser?.referralCode ? true : false}
                          className="w-full bg-[#003358] border-[1px] border-[#245F89] rounded-lg p-3 text-sm font-medium font-outfit tracking-wide"
                        />
                        <button
                          type="button"
                          onClick={copyInviteCode}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FA0] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[64x] h-[30px] text-xs tracking-wide px-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A]  hover:scale-105 transition-transform duration-200"
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
                        share invite link to social media
                      </div>
                    </div>
                  </div>

                  {/* share button */}
                  <div className="w-full flex justify-center mt-2">
                    <button
                      className="w-full h-9 px-[1rem] py-[1.5rem] mb-5 text-sm tracking-wider bg-amber-400 shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center flex hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A]  hover:scale-105 transition-transform duration-200 whitespace-nowrap"
                      onClick={shareInviteLink}
                    >
                      <FaShareFromSquare className="w-4 h-4 mr-2" />
                      Share to Social Networks Now!
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Mobile bottom panel */}
            <div className="flex flex-col lg:hidden w-full overflow-x-hidden">
              {/* referral stats & cashback */}
              <div className={`w-full flex flex-col items-center transition-all duration-500
                ${showPanel ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}>
                <div className="flex flex-col ">
                  {/* Referral stats */}
                  <div className="w-full aspect-[0.63] flex flex-col border-dashed border-r-4 border-transparent">
                    <div
                      className={"w-full h-full items-center px-[2rem] xs:px-[3rem] py-[3rem] xs:py-[5rem]"}
                      style={{
                        backgroundImage: 'url("/assets/images/clicker-character/ticket-mobile-white.webp")',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {/* Title */}
                      <div className="text-neutral-700 text-xl tracking-wider ml-0 sm:ml-[1rem]">
                        YOUR REFERRAL STATS
                      </div>

                      {/* referral stat content */}
                      <div className="flex flex-col w-full h-full">
                        {loadingReferralStats ?
                          <div className="flex justify-center items-center m-auto">
                            <div>
                              <PropagateLoader color={"#FFB23F"} />
                            </div>
                          </div>
                          :
                          <div className="flex flex-col h-full">
                            {/* NFT Purchase */}
                            <div className="w-full my-auto justify-start items-start">
                              {/* title */}
                              <div className="flex flex-row items-end">
                                <p
                                  className="mr-2 text-amber-500 text-5xl lg:text-4xl 2xl:text-5xl ml-0 sm:ml-[1rem]"
                                  style={{
                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                  }}
                                >
                                  {nftPurchasedReferralCount}
                                </p>
                                <p
                                  className="text-amber-500 text-xl leading-relaxed ml-0 sm:ml-[1rem]"
                                  style={{
                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                  }}
                                >
                                  NFT MINTS
                                </p>
                              </div>
                              {/* body */}
                              <div className="text-neutral-700 text-xs font-semibold font-outfit ml-0 sm:ml-[1rem]">
                                How many friend you <br /> invited have minted an NFT
                              </div>
                            </div>
                            {/* Friends invited */}
                            <div className="w-full my-auto justify-start items-start">
                              {/* title */}
                              <div className="flex flex-row items-end">
                                <p
                                  className="mr-2 text-sky-700 text-5xl lg:text-4xl 2xl:text-5xl ml-0 sm:ml-[1rem]"
                                  style={{
                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                  }}
                                >
                                  {referralCount}
                                </p>
                                <p
                                  className="text-sky-700 text-xl leading-relaxed ml-0 sm:ml-[1rem]"
                                  style={{
                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                  }}
                                >
                                  FRIENDS INVITED
                                </p>
                              </div>
                              {/* body */}
                              <div className="text-neutral-700 text-xs font-semibold font-outfit ml-0 sm:ml-[1rem]">
                                The number of friends who have <br /> accepted your invitation to Animara
                              </div>
                            </div>
                            {/* Claimable cashback */}
                            <div className="w-full my-auto justify-start items-start">
                              {/* title */}
                              <div className="flex flex-row items-end">
                              <p
                                className="mr-2 text-amber-500 text-5xl lg:text-4xl 2xl:text-5xl ml-0 sm:ml-[1rem]"
                                style={{
                                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                }}
                              >
                                  {totalClaimed} <span className="text-base font-normal uppercase">sol</span>
                                </p>
                              </div>
                              <div className="flex flex-col">
                                <p
                                  className="text-amber-500 text-xl leading-relaxed ml-0 sm:ml-[1rem]"
                                  style={{
                                    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                  }}
                                >
                                  total claimed
                                </p>
                                <p className="w-[80%] text-neutral-700 text-[0.5rem] xl:text-xs font-semibold font-outfit mb-2">
                                  Track your claimed earnings in total claimed.
                                </p>
                                <p className="text-[#00B9E1] text-sm font-normal font-outfit underline transition-all duration-500 hover:scale-105">
                                  View claim history
                                </p>
                              </div>
                            </div>
                          </div>}
                      </div>
                    </div>
                  </div>

                  {/* Cashback */}
                  <div className="w-full aspect-[1.175] mt-[0.2rem]">
                    <div
                      className="h-full place-content-center"
                      style={{
                        backgroundImage: getTotalClaimable() === '0 sol' ? 'url("/assets/images/clicker-character/ticket-mobile-black.webp")' : 'url("/assets/images/clicker-character/ticket-mobile-orange.webp")',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    >
                      {loadingReferralStats ?
                        <div className="w-full flex justify-center items-center">
                          <div>
                            <PropagateLoader color={"#fef3c7"} />
                          </div>
                        </div>
                        :
                        getTotalClaimable() === '0 sol' ?
                          <div className="w-full h-full flex-col justify-center items-center inline-flex px-[1rem] py-[2rem]">
                          {/* Claimable Amount */}
                          <div className="flex-col justify-center items-center flex">
                            <div className="mb-2 text-center text-sm font-normal leading-none tracking-wide">NFT Cashback</div>
                            <div
                              className="my-2 text-center text-white text-4xl leading-8 tracking-wide"
                              style={{
                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                              }}
                            >
                              {getTotalClaimable() === '0 sol' ? '0' : getTotalClaimable()} sol
                            </div>
                          </div>

                          {/* Description */}
                          <div className="w-full flex items-center justify-center">
                            <p className="text-white text-base text-center font-semibold font-outfit tracking-normal">
                              Claim cashbacks by inviting friends to buy NFTs!
                            </p>
                          </div>

                          {/* Claim button */}
                          <div className={`my-auto justify-center items-center inline-flex transition-transform duration-200
                            ${claimCashbackLoading || getTotalClaimable() === '0 sol' ?
                              ''
                              :
                              'hover:scale-105'}`}>
                            <button
                              className={`bg-[#3C3C3C] h-[4rem] w-[10rem] rounded-full justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(0,0,0,0.48)] cursor-pointer`}
                              onClick={handleClaimCashbackOrBind}>
                              {claimCashbackLoading ?
                                <div className="h-18 w-16 flex justify-center items-center">
                                  <MoonLoader size={25} color={'#d97706'} />
                                </div>
                                :
                                <div
                                  className={`text-center 
                                  ${currentUser.walletAddr === '' ? 'text-white text-xl' : claimCashbackLoading || getTotalClaimable() === '0 sol' ? 'text-slate-100 text-sm ' : 'text-white text-2xl'}`}
                                  style={{
                                    textShadow: `${claimCashbackLoading || getTotalClaimable() === '0 sol' ?
                                      '0px 2px 0.6px rgb(71, 85, 105, 0.66)'
                                      :
                                      '0px 2px 0.6px rgba(240, 139, 0, 0.66)'
                                      }`
                                  }}
                                >
                                  <span className={`hover:text-shadow-none ${claimCashbackLoading ? 'animate-pulse': ''}`}>{claimCashbackLoading ? 'Loading' : !currentUser.walletAddr ? `Bind Wallet` : getTotalClaimable() === '0 sol' ? 'Mint Now' : `Claim`}</span>
                                </div>
                              }
                            </button>
                          </div>
                          </div>
                          :
                          <div className="w-full h-full flex-col justify-center items-center inline-flex px-[1rem] py-[2rem]">
                            {/* Claimable Amount */}
                            <div className="flex-col justify-center items-center flex">
                              <div className="mb-2 text-center text-sm font-normal leading-none tracking-wide">NFT Cashback</div>
                              <div
                                className="my-2 text-center text-amber-50 text-4xl leading-8 tracking-wide"
                                style={{
                                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                }}
                              >
                                {getTotalClaimable()} sol
                              </div>
                            </div>

                            {/* NFT Prompt */}
                            {currentUser?.ownsNFT ?
                              <span className="w-[130px] text-amber-50 text-xs font-outfit">Claiming full benefits</span>
                              :
                              <div className="justify-start items-center inline-flex">
                                <span className="w-full min-w-[130px] mt-[0.3rem] mr-2 text-white text-xs font-outfit">Mint NFT to claim <span className="font-LuckiestGuy text-xs tracking-wide">{getAdditionalClaimable()} sol !</span></span>
                              </div>}

                            {/* Claim button */}
                            <div className={`my-auto justify-center items-center inline-flex transition-transform duration-200
                              ${claimCashbackLoading || getTotalClaimable() === '0 sol' ?
                                ''
                                :
                                'hover:scale-105'}`}>
                              <button
                                disabled={claimCashbackLoading || getTotalClaimable() === '0 sol'}
                                className={`h-[4rem] w-[10rem] rounded-full border justify-center items-center inline-flex shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer
                                  ${claimCashbackLoading || getTotalClaimable() === '0 sol' ?
                                    " border-slate-300 bg-slate-300"
                                    :
                                    " border-amber-600 bg-amber-300 hover:bg-amber-400 hover:pl-[24px] hover:pr-[20px] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)]"}`}
                                onClick={handleClaimCashbackOrBind}>
                                {claimCashbackLoading ?
                                  <div className="h-18 w-16 flex justify-center items-center">
                                    <MoonLoader size={25} color={'#d97706'} />
                                  </div>
                                  :
                                  <div
                                    className={`text-center 
                                    ${currentUser.walletAddr === '' ? 'text-white text-xl' : claimCashbackLoading || getTotalClaimable() === '0 sol' ? 'text-slate-100 text-sm ' : 'text-white text-2xl'}`}
                                    style={{
                                      textShadow: `${claimCashbackLoading || getTotalClaimable() === '0 sol' ?
                                        '0px 2px 0.6px rgb(71, 85, 105, 0.66)'
                                        :
                                        '0px 2px 0.6px rgba(240, 139, 0, 0.66)'
                                        }`
                                    }}
                                  >
                                    <span className={`hover:text-shadow-none ${claimCashbackLoading ? 'animate-pulse': ''}`}>{claimCashbackLoading ? 'Loading' : !currentUser.walletAddr ? `Bind Wallet` : getTotalClaimable() === '0 sol' ? 'Claimed Everything' : getTotalClaimable() === '-' ? 'Mint Now' : `Claim`}</span>
                                  </div>
                                }
                              </button>
                            </div>
                          </div>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* share panel */}
              <div className="w-full">
                <div
                  className="w-full h-full place-content-center p-[4.5rem]"
                  style={{
                    backgroundImage: 'url("/assets/images/clicker-character/qr-mobile-bg.webp")',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >

                  <div className="w-full flex flex-col gap-4 items-center">
                    <div className="w-auto bg-white rounded-lg place-content-center">
                      {!isXlScreen ?
                        <StyledQRCode
                          value={getInviteLink()}
                        /> :
                        <></>
                      }
                    </div>

                    <div className="w-auto content-center grid gap-2">
                      <div className="text-neutral-700 text-lg tracking-wide">
                        Referral Code
                      </div>
                      <div className="flex items-center w-full relative">
                        <input
                          type="text"
                          value={currentUser?.referralCode}
                          readOnly={currentUser?.referralCode ? true : false}
                          className="w-full bg-[#003358] border-[1px] border-[#245F89] rounded-lg p-3 text-sm font-medium font-outfit tracking-wide"
                        />
                        <button
                          type="button"
                          onClick={copyInviteCode}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FA0] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[64x] h-[30px] text-xs tracking-wide px-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A]  hover:scale-105 transition-transform duration-200"
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
                      <div className="text-neutral-700 text-xs font-medium font-outfit mb-[1rem]">
                        share invite link to social media
                      </div>
                    </div>
                  </div>

                  <div className="w-full flex justify-center">
                    <button
                      className="hidden lg:flex w-[16rem] h-9 px-[1rem] py-[1.5rem] mb-5 text-sm tracking-wider bg-amber-400 shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={shareInviteLink}
                    >
                      <FaShareFromSquare className="w-4 h-4 mr-2" />
                      Share to Social Networks Now!
                    </button>
                    <button
                      className="w-[16rem] h-9 px-[1rem] py-[1.5rem] mb-5 text-sm tracking-wider bg-amber-400 shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex lg:hidden hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200"
                      onClick={shareInviteLink}
                    >
                      <FaShareFromSquare className="w-4 h-4 mr-2" />
                      Share Now!
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bind Wallet Modal */}
      {showWalletBindingPanel ?
        <div className={`fixed z-[100] inset-0 w-screen h-screen flex items-center justify-center bg-black/50 backdrop-blur-lg transition-all duration-300 
          ${walletBindingAnim ? `opacity-0` : `opacity-100`}
          ${window.innerHeight < 800
            ? window.innerWidth > 500 ? '' : 'flex-col'
            : `flex-col`}`}>
          {/* wallet binding panel */}
          <div className="flex">
            <WalletBindingPanel className="w-full lx:w-1/2 my-auto p-12" />
          </div>

          {!bindingWallet ?
            <button
              className={`text-2xl rounded-lg m-8 mb-12 mt-0 py-2 px-8 hover:scale-110 transition-all duration-300
                ${currentUser.walletAddr !== '' && !bindingWallet ? `bg-amber-400` : `bg-red-400 `}`}
              onClick={handleBackToMint}
            >
              {currentUser.walletAddr !== '' && !bindingWallet ? `Claim Cashback` : `Close`}
            </button>
            :
            <></>
          }
        </div>
        :
        <></>
      }
    </>
  );
}

export default ReferralPage;
