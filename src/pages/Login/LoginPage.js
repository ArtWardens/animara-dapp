import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import {
  useAuthLoading,
  loginWithEmail,
  useUserAuthenticated,
} from "../../sagaStore/slices/userSlice.js";
import { useIsIOS } from "../../sagaStore/slices/systemSlice.js";
import { CSSTransition } from "react-transition-group";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isIOS = useIsIOS();
  const { t: tLogin } = useTranslation("login");
  const isAuthLoading = useAuthLoading();
  const isAuthenticated = useUserAuthenticated();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasInput, setHasInput] = useState(false);

  // autofill email if there is any registration email
  useEffect(() => {
    const registrationEmail = new URLSearchParams(location.search).get(
      "registrationEmail"
    );
    if (registrationEmail !== null) {
      setEmail(registrationEmail);
    }
  }, [location]);

  useEffect(() => {
    setHasInput(email !== "" && password !== "");
  }, [email, password]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        document.getElementById("login-button").click();
      }
    };
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/anitap");
    }
  }, [navigate, isAuthenticated]);

  const togglePasswordVisiblity = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginWithEmail = async () => {
    dispatch(loginWithEmail({ email, password }));
  };

  // const handleLoginWithGoogle = async () => {
  //   dispatch(loginWithGoogle());
  // };

  // const handleLoginWithTwitter = async () => {
  //   dispatch(loginWithTwitter());
  // };

  // const handleTelegramAuth = async (telegramUser) => {
  //   dispatch(loginWithTelegram(telegramUser));
  // };

  // Loop icon video after random seconds
  const videoRef = useRef(null);
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

  // Landing Fade Animation
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

  useEffect(() => {
    setInProp(true);
  }, []);

  return (
    <CSSTransition
      nodeRef={nodeRef} 
      in={inProp}
      timeout={500}
      classNames="fade"
      unmountOnExit
    >
      <div className="h-[100dvh] relative flex overflow-hidden">
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

        {/* Login Card Latest */}
        <div className="relative left-[50%] -translate-x-1/2 lg:left-[75%] self-center sm:max-h-[50.5rem] max-w-[25rem] sm:max-w-[27.5rem] rounded-[2.5rem] p-[2.5rem] gap-[1.25rem] bg-[#003459] shadow-[0.5rem_0.375rem_0.625rem_0_rgba(0,0,0,0.2)] font-bignoodle">
          {/* Upper Section */}
          <div className="flex flex-col relative self-center space-y-[2rem]">
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
            <p className="mt-6 text-center text-[2.5rem] leading-[2.75rem] text-[#FFC85A]">Welcome back to ANIMARA</p>
            <p className="text-center text-[#C5C5C5] font-outfit">Please enter your details to login</p>
            {/* Email */}
            <input
              disabled={isAuthLoading}
              type="email"
              placeholder={tLogin("Email")}
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="mt-3 w-full outline-none  rounded-[0.625rem] border border-[#245F89] py-[0.875rem] px-[1rem] font-outfit text-dark-2"
            />
            {/* Password */}
            <div className="relative mt-2">
              <input
                disabled={isAuthLoading}
                type={showPassword ? "text" : "password"}
                placeholder={tLogin("Password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full outline-none  rounded-[0.625rem] border border-[#245F89] py-[0.875rem] px-[1rem] font-outfit text-dark-2"
                required
              />
              <img
                onClick={togglePasswordVisiblity}
                src="../assets/images/eye.svg"
                alt="show password"
                className="absolute top-1/2 right-3 -translate-y-1/2 -translate-x-3 "
              />
              <div className="flex h-auto mt-2 align-item-send">
                <Link
                  to="/forgot-password"
                  className="ml-auto hover:brightness-75"
                >
                  <p className="text-amber-400 font-outfit text-[0.875rem] leading-[1rem] text-center">
                    Forgot Password?
                  </p>
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              id="login-button"
              disabled={isAuthLoading || !hasInput}
              className={`mt-3 font-outfit font-bold text-[1rem] leading-[1rem] w-full rounded-[1.25rem] border-[0.4px] py-[1.25rem] px-[2rem] ${
                isAuthLoading || !hasInput
                  ? 'bg-[#FFB23F] border-[#E59E69] text-[#FFF5F5] opacity-50'
                  : 'bg-[#FFB23F] border-[#E59E69] text-[#FFF5F5] hover:brightness-75'
              }`}
              onClick={handleLoginWithEmail}
            >
              {isAuthLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    aria-hidden="true"
                    className="w-[1rem] h-[1rem] text-Fuchsia-200 animate-spin dark:text-Fuchsia-200 fill-indigo-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              ) : (
                <span className="">Login</span>
              )}
            </button>
            <p className="mt-4 font-outfit text-[0.875rem] leading-[1rem] text-center">
              Don&#39;t have an account? &nbsp;
              <Link
                to="/signup"
                className="font-semibold hover:brightness-75 text-[#FFB23F] "
              >
                Sign Up
              </Link>
            </p>
            {/* Policies */}
            <div className="mt-3 flex gap-8 font-outfit text-[#C5C5C5] text-[1rem] text-center justify-center">
              <Link to="https://animara.world/privacy-policy" className="hover:brightness-75 ">Privacy Policy</Link>
              <span>|</span>
              <Link to="https://animara.world/terms-and-conditions" className="hover:brightness-75 ">Terms & Conditions</Link>
            </div>
          </div>
          
          {/*  Divider */}
          {/* <div className="flex items-center my-6">
            <hr className="border-t border-[#C5C5C5] flex-grow" />
            <span className="px-8 text-[0.875rem] text-[#C5C5C5] font-outfit">Or</span>
            <hr className="border-t border-[#C5C5C5] flex-grow" />
          </div> */}

          {/* Social Login Buttons Section */}
          {/* <button 
            type="button" 
            disabled={isAuthLoading}
            className="w-full max-h-[4rem] font-outfit text-[1rem] leading-[1rem] text-[#C5C5C5] rounded-[0.625rem] py-[0.875rem] px-[1rem] gap-[1.25rem] bg-[#0A4169] hover:brightness-75 text-center inline-flex items-center justify-center"
            onClick={handleLoginWithGoogle} 
          >
            <img 
              src="/socials/devicon_google.webp" alt="" 
              className="max-h-[2.5rem] max-w-[2.5rem]"
            />
            Login With Google
          </button> */}
          {/* <button 
            type="button"
            disabled={isAuthLoading}
            className="mt-1 max-h-[4rem] w-full font-outfit text-[1rem] leading-[1rem] text-[#C5C5C5] rounded-[0.625rem] py-[0.875rem] px-[1rem] gap-[1.25rem] bg-[#0A4169] hover:brightness-75 text-center inline-flex items-center justify-center"
            onClick={handleLoginWithTwitter} 
          >
            <img 
              src="/socials/devicon_x.webp" alt="" 
              className="max-h-[2.5rem] max-w-[2.5rem]"
            />
            Login With X
          </button> */}
          <div className="flex items-center justify-center">
            {/* <LoginButton
              botUsername={process.env.REACT_APP_TELEGRAM_BOT_NAME}
              onAuthCallback={handleTelegramAuth}
            /> */}
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default LoginPage;
