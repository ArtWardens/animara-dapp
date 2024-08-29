import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCopy, FaShareFromSquare } from "react-icons/fa6";
import { getReferralStats, useUserDetails, useReferralStatLoading, useNFTPurchasedReferralCount, useReferralCount, useBasicClaimable, useNftClaimable } from "../../sagaStore/slices";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import StyledQRCode from "../../components/StyledQRCode";
import Header from "../../components/Header.jsx";
import { PropagateLoader } from "react-spinners"; // Import the loader

function ReferralPage (){
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useUserDetails();
  const [hasReferralStat, setHasReferralStat] = useState(false);
  const loadingReferralStats = useReferralStatLoading();
  const referralCount = useReferralCount();
  const nftPurchasedReferralCount = useNFTPurchasedReferralCount();
  const basicClaimable = useBasicClaimable();
  const nftClaimable = useNftClaimable();
  const [isXlScreen, setIsXlScreen] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showRefOne, setShowRefOne] = useState(false);
  const [showRefTwo, setShowRefTwo] = useState(false);
  const [showRefThree, setShowRefThree] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselFading, setCarouselFading] = useState(false);
  
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
        "Accumulate USDT rewards when anyone you invite purchases a piece of our NFT! Maybe you can snatch one for yourself too if you invite enough people...",
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
    }, 50);

    const timerRefOne = setTimeout(() => {
      setShowRefOne(true);
    }, 50);

    const timerRefTwo = setTimeout(() => {
      setShowRefTwo(true);
    }, 50);

    const timerRefThree = setTimeout(() => {
      setShowRefThree(true);
    }, 250);

    const timerPanel = setTimeout(() => {
      setShowPanel(true);
    }, 250);

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
    setTimeout(()=>{
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? content.length - 1 : prevIndex - 1
      );
      setCarouselFading(false);
    }, 500);
  };

  const handleNext = () => {
    if (carouselFading) { return; }
    setCarouselFading(true);
    setTimeout(()=>{
      setCurrentIndex((prevIndex) =>
        prevIndex === content.length - 1 ? 0 : prevIndex + 1
      );
      setCarouselFading(false);
    }, 500);
  };
  
  const getInviteLink = useCallback(()=>{
    if (!currentUser){
      return `${window.location.origin}/signup`;
    }
    return `${window.location.origin}/signup?invite-code=${currentUser?.referralCode}`
  },[currentUser]);

  // fetch referral stats when loading into this page
  useEffect(()=>{
    if (!hasReferralStat){
      dispatch(getReferralStats());
      setHasReferralStat(true);
    }
  },[dispatch, hasReferralStat]);

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

  const copyInviteCode = () => {
    navigator.clipboard.writeText(getInviteLink());
    toast.success('Invite code copied to clipboard!');
  };

  const getTotalClaimable = useCallback(()=>{
    if (!currentUser){ return `None`; }
    // selectively combine both claimable amt based on if use owns nft
    return `${currentUser.ownsNFT? basicClaimable + nftClaimable : basicClaimable} SOL`;
  },[currentUser, basicClaimable, nftClaimable]);

  const getAdditionalClaimable = useCallback(()=>{
    if (!nftClaimable){ return `0 SOL`; }
    // selectively combine both claimable amt based on if use owns nft
    return `${nftClaimable} SOL`;
  },[nftClaimable]);

  return (
    <>
      <Header />

      {/* background image */}
      <div
        className="flex flex-col items-center pb-4 xl:px-[2rem] min-h-screen"
        style={{
          backgroundImage: 'url("/assets/images/clicker-character/clickerWall.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* content */}
        <div 
          className={`container flex flex-col items-center gap-6 pt-40 tracking-wider transition-opacity duration-1000
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
          <div className="hidden xl:grid grid-cols-3 gap-12">
            {/* left section */}
            <div className={`w-[75%] h-full mx-auto flex flex-col justify-center items-center hover:scale-110 transition-all duration-500
               ${showRefOne ? `opacity-100` : `opacity-0`}`}>
              <img
                className="w-4/5 h-auto origin-top-left shadow"
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
                className="w-full h-auto origin-top-left shadow"
                src="/assets/images/clicker-character/ref02.webp"
                alt="NFT Cashback"
              />
              <div className="flex flex-col justify-start items-center gap-2">
                <div className="text-center text-white text-2xl uppercase leading-relaxed">
                  NFT Cashback
                </div>
                <div className="w-full origin-top-left text-center text-stone-300 font-outfit text-[12px] leading-tight tracking-wide">
                  Accumulate USDT rewards when anyone you invite purchases a piece of our NFT! Maybe you can snatch one for yourself too if you invite enough people...
                </div>
              </div>
            </div>
            {/* right section */}
            <div className={`w-[75%] h-full mx-auto flex flex-col justify-center items-center hover:scale-110 transition-all duration-500
               ${showRefTwo ? `opacity-100` : `opacity-0`}`}>
              <img
                className="w-4/5 h-auto origin-top-left shadow"
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
          <div className="h-[50dvh] relative flex xl:hidden flex-col justify-center items-center">
            <div className={`w-[70dvw] h-auto flex flex-col justify-center items-center transition-all duration-500
               ${carouselFading ? `opacity-0` : `opacity-100`}`}>
              <img
                className="w-[80%] lg:w-[60%] h-auto origin-top-left shadow"
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
                className="text-white p-2 rounded-full shadow-md"
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
                className="text-white p-2 rounded-full shadow-md"
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
          <div className={`hidden xl:flex w-full items-center transition-all duration-1000
               ${showPanel ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}>
            {/* referral stats & cashback */}
            <div className="w-[62%] hover:scale-105 transition-all duration-500"
            >
              <div className="flex w-full">
                {/* Referral stats */}
                <div className="w-[65%] border-dashed border-r-4 border-transparent">
                  {/* card background */}
                  <div
                    className="w-full h-full items-center"
                    style={{
                      backgroundImage: 'url("/assets/images/clicker-character/ticketWeb02.webp")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Title */}
                    <div className="text-neutral-700 text-xl tracking-wider pt-9 pb-3 ml-9">
                      YOUR REFERRAL STATS
                    </div>

                    {/* referral stat content */}
                    <div className="flex w-full ml-9 gap-8 min-h-[160px]">
                      {loadingReferralStats ?
                      <div className="w-full h-full flex justify-center items-center my-auto">
                        <PropagateLoader color={"#FFB23F"} />
                      </div>
                      :
                      <div className="flex">
                        {/* NFT Purchase */}
                        <div className="w-1/2">
                          <div className="justify-start items-start">
                            <p
                              className="text-amber-500 text-5xl lg:text-4xl 2xl:text-5xl"
                              style={{
                                WebkitTextStrokeWidth: '2px',
                                WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                              }}
                            >
                              {nftPurchasedReferralCount}
                            </p>
                            <p
                              className="text-amber-500 text-xl leading-relaxed"
                              style={{
                                WebkitTextStrokeWidth: '0.75px',
                                WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                              }}
                            >
                              NFT PURCHASE
                            </p>
                            <div className="w-[80%] text-neutral-700 text-xs font-semibold font-outfit">
                              How many friend you invited have minted an NFT
                            </div>
                          </div>
                        </div>
                        {/* Friends invited */}
                        <div className="w-1/2">
                          <div className="justify-start items-start">
                            <p
                              className="text-sky-700 text-5xl lg:text-4xl 2xl:text-5xl"
                              style={{
                                WebkitTextStrokeWidth: '2px',
                                WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                              }}
                            >
                              {referralCount}
                            </p>
                            <p
                              className="text-sky-700 text-xl leading-relaxed"
                              style={{
                                WebkitTextStrokeWidth: '0.75px',
                                WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                              }}
                            >
                              FRIENDS INVITED
                            </p>
                            <div className="w-[80%] text-neutral-700 text-xs font-semibold font-outfit">
                              The number of friends who have accepted your invitation to Animara
                            </div>
                          </div>
                        </div>
                      </div>}
                    </div>
                  </div>
                </div>

                {/* Cashback */}
                <div className="w-[35%]">
                  <div
                    className="w-full h-full place-content-center"
                    style={{
                      backgroundImage: 'url("/assets/images/clicker-character/ticketWeb01.webp")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {(getTotalClaimable() <= `0 sol`) ?
                      <div className="w-full h-full flex-col place-content-center gap-4 inline-flex">
                        <span className="text-center w-full">Nothing to claim yet</span>
                        <span className="text-center w-full text-xs font-outfit">Get your referrals to mint an NFT now!</span>
                      </div>
                    :
                      <div className="w-full flex-col justify-center items-center gap-3 inline-flex">
                        {/* Claimable Amount */}
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
                            {getTotalClaimable()}
                          </div>
                        </div>

                        {/* Claim button */}
                        <div className={`pb-1 justify-center items-center inline-flex transition-transform duration-200 hover:scale-105`}>
                          <p className="text-lg text-center">Cashback claim available soon!</p>
                        </div>

                        {/* NFT Prompt */}
                        {currentUser?.ownsNFT ? 
                          <span className="w-[130px] text-white text-xs font-outfit">Claiming full benefits</span>
                        :
                        <div className="justify-start items-center gap-0.5 inline-flex">
                          <span className="w-[130px] text-white text-xs font-outfit">Get additional <span className="text-white font-LuckiestGuy text-xs tracking-wide">{getAdditionalClaimable()}</span>, if you own NFT!</span>
                          <div className="flex justify-center items-center p-2 rounded-lg bg-[#FFC85A] shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:bg-[#FFAA00] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer hover:scale-105 transition-transform duration-200">
                            <div
                              className="text-orange-50 text-xs"
                              onClick={() => navigate('/mint')}
                            >
                              Own Now</div>
                          </div>
                        </div>}
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* share panel */}
            <div className="w-[40%] hover:scale-105 transition-all duration-500">
              <div
                className="w-full h-full place-content-center p-[3rem]"
                style={{
                  backgroundImage: 'url("/assets/images/clicker-character/QRBg.webp")',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className="flex w-full gap-4 justify-end">
                  <div className="w-[110px] bg-white rounded-lg place-content-center">     
                    {isXlScreen ? 
                      <StyledQRCode
                        value={getInviteLink()}
                      />:
                      <></>
                    }
                  </div>

                  <div className="w-2/3 content-center grid gap-2">
                    <div className="text-neutral-700 text-lg tracking-wide">
                      PERSONAL LINK
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FA0] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[64x] h-[30px] text-xs tracking-wide px-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200"
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

                <div className="w-full flex justify-center">
                  <button
                    className="w-[24rem] h-9 px-[1rem] py-[1.5rem] mb-5 text-sm tracking-wider bg-amber-400 shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200 whitespace-nowrap"
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
          <div className="flex flex-col xl:hidden w-full overflow-x-hidden">
            {/* referral stats & cashback */}
            <div className={`w-full flex flex-col items-center transition-all duration-1000
               ${showPanel ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}>
              <div className="flex flex-col ">
                {/* Referral stats */}
                <div className="w-full flex flex-col border-dashed border-r-4 border-transparent">
                  <div
                    className="w-full h-full items-center p-[4.5rem]"
                    style={{
                      backgroundImage: 'url("/assets/images/clicker-character/ticket-mobile-white.webp")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Title */}
                    <div className="text-neutral-700 text-xl tracking-wider pb-3 ml-0 sm:ml-[1rem]">
                      YOUR REFERRAL STATS
                    </div>

                    {/* referral stat content */}
                    <div className="flex flex-col w-full">
                      {loadingReferralStats ?
                      <div className="w-full flex justify-center items-center my-auto">
                        <PropagateLoader color={"#FFB23F"} />
                      </div>
                      :
                      <div className="flex flex-col">
                        {/* NFT Purchase */}
                        <div className="w-full mb-[1rem]">
                          <div className="justify-start items-start">
                            <div className="flex flex-row items-end">
                              <p
                                className="text-amber-500 text-5xl lg:text-4xl 2xl:text-5xl ml-0 sm:ml-[1rem]"
                                style={{
                                  WebkitTextStrokeWidth: '2px',
                                  WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                }}
                              >
                                {nftPurchasedReferralCount}
                              </p>
                              <p
                                className="text-amber-500 text-xl leading-relaxed ml-0 sm:ml-[1rem]"
                                style={{
                                  WebkitTextStrokeWidth: '0.75px',
                                  WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                }}
                              >
                                NFT PURCHASE
                              </p>
                            </div>
                            <div className="text-neutral-700 text-xs font-semibold font-outfit ml-0 sm:ml-[1rem]">
                              How many friend you <br/> invited have minted an NFT
                            </div>
                          </div>
                        </div>
                        {/* Friends invited */}
                        <div className="w-full mb-[1rem]">
                          <div className="justify-start items-start">
                            <div className="flex flex-row items-end">
                              <p
                                className="text-sky-700 text-5xl lg:text-4xl 2xl:text-5xl ml-0 sm:ml-[1rem]"
                                style={{
                                  WebkitTextStrokeWidth: '2px',
                                  WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                }}
                              >
                                {referralCount}
                              </p>
                              <p
                                className="text-sky-700 text-xl leading-relaxed ml-0 sm:ml-[1rem]"
                                style={{
                                  WebkitTextStrokeWidth: '0.75px',
                                  WebkitTextStrokeColor: 'var(--Color-11, #FFF)',
                                  textShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                }}
                              >
                                FRIENDS INVITED
                              </p>
                            </div>
                            <div className="text-neutral-700 text-xs font-semibold font-outfit ml-0 sm:ml-[1rem]">
                              The number of friends who have <br/> accepted your invitation to Animara
                            </div>
                          </div>
                        </div>
                      </div>}
                    </div>
                  </div>
                </div>

                {/* Cashback */}
                <div className="w-full mt-[0.2rem]">
                  <div
                    className="w-full place-content-center"
                    style={{
                      backgroundImage: 'url("/assets/images/clicker-character/ticket-mobile-orange.webp")',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {(getTotalClaimable() <= `0 sol`) ?
                      <div className="w-full h-full flex-col place-content-center gap-4 inline-flex p-[6rem] sm:p-[6.5rem]">
                        <span className="text-center w-full">Nothing to claim yet</span>
                        <span className="text-center w-full text-xs font-outfit">Get your referrals to mint an NFT now!</span>
                      </div>
                    :
                      <div className="w-full flex-col justify-center items-center gap-3 inline-flex p-[3rem]">
                        {/* Claimable Amount */}
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
                            {getTotalClaimable()}
                          </div>
                        </div>

                        {/* Claim button */}
                        <div className={`pb-1 justify-center items-center inline-flex transition-transform duration-200 hover:scale-105`}>
                          <p className="w-[70%] text-lg text-center">Cashback claim available soon!</p>
                        </div>

                        {/* NFT Prompt */}
                        {currentUser?.ownsNFT ? 
                          <span className="w-[130px] text-white text-xs font-outfit">Claiming full benefits</span>
                        :
                        <div className="justify-start items-center gap-0.5 inline-flex">
                          <span className="w-[130px] text-white text-xs font-outfit">Get additional <span className="text-white font-LuckiestGuy text-xs tracking-wide">{getAdditionalClaimable()}</span>, if you own NFT!</span>
                          <div className="flex justify-center items-center p-2 rounded-lg bg-[#FFC85A] shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:bg-[#FFAA00] hover:shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(232,140,72,0.48)] cursor-pointer hover:scale-105 transition-transform duration-200">
                            <div
                              className="text-orange-50 text-xs"
                              onClick={() => navigate('/mint')}
                            >
                              Own Now</div>
                          </div>
                        </div>}
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
                      />:
                      <></>
                    }
                  </div>

                  <div className="w-auto content-center grid gap-2">
                    <div className="text-neutral-700 text-lg tracking-wide">
                      PERSONAL LINK
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
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FA0] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[64x] h-[30px] text-xs tracking-wide px-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200"
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
                      or you can use social networks or email
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-center">
                  <button
                    className="w-[16rem] h-9 px-[1rem] py-[1.5rem] mb-5 text-sm tracking-wider bg-amber-400 shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] rounded-full border-orange-300 justify-center items-center gap-2 flex hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200"
                    onClick={shareInviteLink}
                  >
                    <FaShareFromSquare className="w-4 h-4 mr-2" />
                    Share to Social Networks Now!
                  </button>
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
