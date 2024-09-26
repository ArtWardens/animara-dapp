import React, { useEffect, useState, useRef } from "react";
import { useIsIOS } from "../../sagaStore/slices/systemSlice.js";
import { CSSTransition } from "react-transition-group";

const ComingSoonPage = () => {
  const isIOS = useIsIOS();
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);
  const videoRef = useRef(null);

  // intro animation
  useEffect(() => {
    setInProp(true);
  }, []);

  // Loop icon video after random seconds
  useEffect(() => {
    const handleVideoEnd = () => {
      const randomDelay = Math.floor(Math.random() * 15000) + 5000;

      // Set a timeout to restart the video after the random delay
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, randomDelay);
    };

    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd);
    }

    // Cleanup the event listener on component unmount
    return () => {
      if (videoElement) {
        videoElement.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, []);
  
  // handler to navigate back to login page
  const handleBackToHome = () =>{
    window.location.href = "https://animara.world";
  }

  return (
    <CSSTransition
      nodeRef={nodeRef} 
      in={inProp}
      timeout={500}
      classNames="fade"
      unmountOnExit
    >
      <div className="min-h-screen relative flex overflow-hidden">
        <div ref={nodeRef} className="fade-mask-layer -translate-x-full"></div>
        {/* Background Image */}
        <img 
          src="/backgrounds/BG_login.webp" alt="background"
          className="w-full h-full absolute top-0 -z-40 object-cover"
        />

        {/* Header */}
        <header className="absolute py-[2rem] px-[12rem] h-[6rem] w-full hidden lg:block">
          <a className="" href="https://animara.world" target="_blank" rel="noopener noreferrer">
            <img 
              src="/assets/icons/logo.webp" alt="logo"
              className="max-h-[4rem]"
            />
          </a>
        </header>

        {/* Info Card */}
        <div className="relative left-[50%] -translate-x-1/2 lg:left-[75%] self-center sm:max-h-[50.5rem] max-w-[25rem] sm:max-w-[27.5rem] rounded-[2.5rem] p-[2.5rem] gap-[1.25rem] bg-[#003459] shadow-[0.5rem_0.375rem_0.625rem_0_rgba(0,0,0,0.2)] font-bignoodle">
          {/* Upper Section */}
          <div className="relative self-center">
            {/* Logo */}
            <div className="flex justify-center items-center">
              {isIOS?
                <img 
                  src="/assets/icons/AnimaraLogo.webp" alt="logo"
                  className="h-[5rem] w-[5rem]"
                />
                :
                <video 
                  ref={videoRef}
                  className="h-[5rem] w-[5rem]"
                  autoPlay
                  playsInline>
                    <source src="https://storage.animara.world/logo-animated.webm" type="video/webm" />
                </video>
              }
            </div>

            {/* title */}
            <p className="my-[2rem] text-center text-[2.5rem] leading-[2.75rem] text-[#FFC85A]">Registration Opening Soon</p>
            
            {/* description */}
            <p className="my-[2rem] text-center text-[#C5C5C5] font-outfit">Exciting things are on the way in Animara! Stay tuned for your exclusive referral code from top KOLs and be among the first to step into the adventure!</p>
            
            {/* actions */}
            <div className="flex flex-col">
              {/* Back To Home Button */}
              <button
                id="back-to-login-button"
                className='mt-3 font-outfit font-bold text-[1rem] leading-[1rem] w-full rounded-[0.625rem] py-[0.875rem] px-[1rem] gap-[1.25rem] hover:brightness-75 text-center inline-flex items-center justify-center bg-[#0A4169] border-[#E59E69] text-slate-50 hover:brightness-75'
                onClick={handleBackToHome}
              >
                <span className="">Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default ComingSoonPage;
