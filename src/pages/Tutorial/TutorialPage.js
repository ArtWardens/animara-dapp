import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom/dist';

const TutorialPage = () => {
  const navigate = useNavigate();
  
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const tutorials = [
    { 
      mascot: "/assets/images/tutorial-pepe.webp", 
      menu: "/assets/images/tutorial-anitap.webp",
      title: "what is anitap?", 
      description: "Anitap is the entry point into the Animara game ecosystem, where players complete simple tasks to gather resources, earn NFT rewards, and unlock clues for the \"Play to Earn\" phase. \n\n It offers a smooth onboarding experience with airdrops and perks, helping players adapt to the game world while setting the stage for future adventures and opportunities." 
    },
    { 
      mascot: "/assets/images/tutorial-ghost.webp", 
      menu: "/assets/images/tutorial-mint.webp",
      title: "What is Minting?", 
      description: "In Animara, each NFT boosts your task completion speed during the Anitap phase and includes 75,000 Anitoken as a presale reward, accelerating your progress. \n\n The NFT also serves as your entry ticket to the game, unlocking Tap to Earn, Play to Earn, and Hunt to Earn adventures. It's your gateway to a rewarding journey in the Animara universe!" 
    },
    { 
      mascot: "/assets/images/tutorial-fox.webp", 
      menu: "/assets/images/tutorial-referral.webp",
      title: "What is Referral?", 
      description: "Refer a friend to Anitap and earn special rewards with 5% cashback! \n\n Hold an Animara NFT to boost your rewards to 20%—5% base plus a 15% NFT bonus. Invite friends, double the fun, and enjoy earning together in the Animara adventure!" 
    },
    { 
      mascot: "/assets/images/tutorial-cat.webp", 
      menu: "/assets/images/tutorial-menu.webp",
      title: "Ensure Cashback Success!!!", 
      description: "When claiming cashback, keep the page stable and avoid refreshing or leaving until the process is complete. \n\n This ensures smooth reward processing and lets you enjoy your earnings hassle-free!" 
    },
  ];

  // redirect to anitap
  const handleClick = () => {
    // update user status here 
    // then
    navigate('/anitap');
  };

  // switch between content
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % tutorials.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + tutorials.length) % tutorials.length);
  };

  // detect is mobile or not
  useEffect(()=>{
    const detectMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    detectMobile();

    window.addEventListener('resize', detectMobile);

    return () => {
      window.removeEventListener('resize', detectMobile); 
    };
  },[]);

  return(
    <>
      <div 
        className={`min-h-screen h-full flex flex-col z-30`}
        style={{
          backgroundImage: 'url("/assets/images/clicker-character/clickerWall.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="w-full lg:min-w-[1600px] flex flex-col px-[1rem] lg:px-[10rem] py-[4rem]">
          {/* demo header row */}
          <div className={`w-full flex flex-row ${isMobile ? 'items-center' : 'items-start'} justify-between z-[100]`}>
            <img
              src={"/assets/images/demo-header.webp"}
              alt="demo-header"
              className="w-auto h-[10dvh] lg:min-h-[150px] object-contain"
            />
            <img
              src={isMobile ? `/assets/images/demo-mobile-menu.webp` : `${tutorials[currentIndex].menu}`}
              alt="demo-menu"
              className={`w-auto h-6 lg:h-[20dvh] lg:min-h-[200px] object-contain`}
            />
          </div>

          {/* tutorial row */}
          <div 
            className={`w-full min-w-[200px] lg:min-w-[1600px] h-full min-h-[600px] xs:min-h-[800px] lg:min-h-[1000px] flex flex-col lg:flex-row items-center ${isMobile ? 'justify-start' : 'justify-center'} gap-[2rem] mt-0 lg:mt-[-8rem] p-[2rem] xs:p-[4rem] lg:p-[12rem] z-[10]`}
            style={{
              backgroundImage: isMobile ? 'url("/assets/images/tutorial-bg-mobile.webp")' : 'url("/assets/images/tutorial-bg.webp")',
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
              {/* tutorial descriptions */}
              <div className="w-[80%] lg:w-[30%] h-full flex flex-col items-center ml-[0rem] lg:ml-[5rem] mt-[1rem] xs:mt-[2rem] lg:mt-[2rem]">
                <div className="w-full max-w-[300px] lg:max-w-[700px] flex flex-col items-center lg:items-start justify-center">
                  <h1 className="min-h-[55px] text-[#FFAA00] text-xl lg:text-4xl text-center lg:text-left font-normal lg:whitespace-nowrap mb-2 lg:mb-[3rem]">{tutorials[currentIndex].title}</h1>

                  <p className="w-[100%] lg:w-[20dvw] h-full min-h-[260px] lg:min-h-[350px] flex flex-col items-center lg:items-start text-white text-sm lg:text-xl text-center lg:text-left font-outfit font-normal lg:mb-[3rem]"> 
                    {tutorials[currentIndex].description.split("\n").map((text, index) => (
                      <React.Fragment key={index}>
                        {text}
                        <br />
                      </React.Fragment>
                    ))}
                    <button
                      className={`bg-[#ffdc61] ${currentIndex === 3 ? 'block' : 'hidden'} text-white font-LuckiestGuy mt-8 px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]`}
                      onClick={handleClick}
                    >
                      okay
                    </button>
                  </p>
                </div>

                {/* Buttons */}
                <div className="w-full max-w-[400px] flex flex-row justify-center lg:justify-between gap-[4rem] lg:mb-[3rem]">
                  <button 
                    className={`${currentIndex === 0 ? 'hidden' : 'block'} text-white text-base font-outfit font-medium transition-all duration-300 hover:scale-110`} 
                    onClick={handlePrevious}
                  >
                    {isMobile ? '\u2190' : '\u2190 Previous'}
                  </button>
                  <button 
                    className={`${currentIndex === 3 ? 'hidden' : 'block'} text-white text-base font-outfit font-medium transition-all duration-300 hover:scale-110`} 
                    onClick={handleNext}
                  >
                    {isMobile ? '\u2192' : 'Next \u2192'}
                  </button>
                </div>
              </div>

              {/* tutorial mascot */}
              <div className="w-full lg:w-[50%] flex items-center justify-center lg:mr-[-3rem] lg:mb-[-10rem]">
                <img
                  src={tutorials[currentIndex].mascot}
                  alt="demo-menu"
                  className="w-auto h-full max-h-[150px] xs:max-h-[400px] lg:max-h-[700px] object-cover"
                />
              </div>
            
          </div>

          
        </div>
      </div>
    </>
  );
}

export default TutorialPage;