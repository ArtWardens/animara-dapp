import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LoginButton } from "@telegram-auth/react";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import {
  useAuthLoading,
  useUserAuthenticated,
  signupWithEmail,
  loginWithGoogle,
  loginWithTwitter,
  loginWithTelegram,
} from "../../sagaStore/slices/userSlice.js";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthLoading = useAuthLoading();
  const isAuthenticated = useUserAuthenticated();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [hasInput, setHasInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [referralCode, setReferralCode] = useState(
    new URLSearchParams(location.search).get("invite-code") || ""
  );
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [doPasswordsMatch, setDoPasswordsMatch] = useState(true); 

  const acceptedSymbols = "!@#$%^&*";

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        document.getElementById("signup-button").click();
      }
    };
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [navigate]);

  useEffect(() => {
    setHasInput(
      username !== "" && email !== "" && password !== "" && confirmPassword !== ""
    );
  }, [username, email, password, confirmPassword]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpWithEmail = async () => {
    if (password !== confirmPassword) {
      setDoPasswordsMatch(false);
      return;
    }
    setDoPasswordsMatch(true);
    dispatch(signupWithEmail({ email, password, username, referralCode }));
  };

  const handleLoginWithGoogle = async () => {
    dispatch(loginWithGoogle());
  };

  const handleLoginWithTwitter = async () => {
    dispatch(loginWithTwitter());
  };

  const handleTelegramAuth = async (telegramUser) => {
    dispatch(loginWithTelegram(telegramUser));
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      navigate("/clicker-lock");
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmail === "") {
      setEmailError("Email is required");
      setIsEmailValid(false);
    } else if (!emailRegex.test(newEmail)) {
      setEmailError("Invalid email");
      setIsEmailValid(false);
    } else {
      setEmailError("");
      setIsEmailValid(true);
    }
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    const hasAlphabet = /[a-zA-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSymbol = /[!@#$%^&*]/.test(newPassword);
    const isLongEnough = newPassword.length > 8;

    let errorArr = [];

    if (newPassword === "") {
      errorArr.push("not be empty");
    }
    if (!isLongEnough) {
      errorArr.push("be longer than 8 characters");
    }
    if (!hasAlphabet || !hasNumber) {
      errorArr.push("contain a mix of alphabets and numbers");
    }
    if (!hasSymbol) {
      errorArr.push(`contain at least one symbol: ${acceptedSymbols}`);
    }

    if (errorArr.length > 0) {
      setPasswordError(`Password should ${errorArr.join(", ")}`);
      setIsPasswordValid(false);
    } else {
      setPasswordError("");
      setIsPasswordValid(true);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setDoPasswordsMatch(e.target.value === password);
  };

  const getEmailInputBorderClass = () => {
    if (email === "") {
      return "border-[#245F89]";
    }
    return isEmailValid ? "border-green-500" : "border-red-500";
  };

  const getPasswordInputBorderClass = () => {
    if (password === "") {
      return "border-[#245F89]";
    }
    return isPasswordValid ? "border-green-500" : "border-red-500";
  };

  const getConfirmPasswordInputBorderClass = () => {
    if (confirmPassword === "") {
      return "border-[#245F89]";
    }
    return doPasswordsMatch ? "border-green-500" : "border-red-500";
  };

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

  return (
    <div className="min-h-screen relative flex">
      {/* Background Image */}
      <img 
        src="../backgrounds/BG_login.png" alt="background"
        className="w-full h-full absolute top-0 -z-40 opacity-75 object-cover"
      />

      {/* Header */}
      <header className="absolute py-[2rem] px-[12rem] h-[6rem] w-full hidden lg:block">
        <img 
          src="/assets/icons/logo.png" alt="logo"
          className="max-h-[2rem]"
        />
      </header>

      {/* Sign up Card Latest */}
      <div className="relative left-[50%] -translate-x-1/2 lg:left-[75%] self-center sm:max-h-[59.5rem] max-w-[25rem] sm:max-w-[27.5rem] rounded-[2.5rem] p-[2.5rem] gap-[1.25rem] bg-[#003459] shadow-[0.5rem_0.375rem_0.625rem_0_rgba(0,0,0,0.2)] font-bignoodle">
        {/* Upper Section */}
        <div className="relative self-center gap-[1.25rem] flex">
          <div className="flex-none">
            <video 
              ref={videoRef}
              className="h-[5rem] w-[5rem]"
              autoPlay>
                <source src="../assets/icons/AnimaraLogoAnimated.webm" type="video/webm" />
            </video>
          </div>
          <div className="grow">
            <p className="text-[2.5rem] leading-[2.75rem] text-[#FFC85A]">Sign up</p>
            <p className="text-[#C5C5C5] font-outfit">Begin your adventure in Animara</p>
          </div>
        </div>

        {/* Username */}
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
          className="mt-6 w-full outline-none bg-transparent rounded-[0.625rem] border border-[#245F89] py-[0.875rem] px-[1rem] font-outfit text-[#C5C5C5]"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={handleEmailChange}
          className={`mt-2 w-full outline-none bg-transparent rounded-[0.625rem] border py-[0.875rem] px-[1rem] font-outfit text-[#C5C5C5] ${getEmailInputBorderClass()}`}
        />
        {!isEmailValid && <p className="text-red-500">{emailError}</p>}

        {/* Password */}
        <div className="relative mt-2">
          <div className="flex flex-row">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full outline-none bg-transparent rounded-[0.625rem] border py-[0.875rem] px-[1rem] font-outfit text-[#C5C5C5] ${getPasswordInputBorderClass()}`}
              required
            />
            <img
              onClick={togglePassword}
              src="../assets/images/eye.svg"
              alt="show password"
              className={`absolute top-1/2 right-3 -translate-y-1/2 -translate-x-3 ${isPasswordValid ? 'mt-0' : 'mt-[-1.5rem]'} cursor-pointer`}
            />
          </div>
          {!isPasswordValid && <p className="text-red-500">{passwordError}</p>}
        </div>

        {/* Confirm Password */}
        <div className="relative mt-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-full outline-none bg-transparent rounded-[0.625rem] border py-[0.875rem] px-[1rem] font-outfit text-[#C5C5C5] ${getConfirmPasswordInputBorderClass()}`}
            required
          />
          {!doPasswordsMatch && (
            <p className="text-red-500">Passwords do not match</p>
          )}
        </div>

        {/* Invite Code */}
        <input
          type="text"
          placeholder="Invite code (Optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="mt-2 w-full outline-none bg-transparent rounded-[0.625rem] border border-[#245F89] py-[0.875rem] px-[1rem] font-outfit text-[#C5C5C5]"
        />

        {/* T&C checkbox */}
        <div className="flex items-center mt-3 text-[0.875rem]">
          <input id="link-checkbox" type="checkbox" value="" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:accent-[#49DEFF] dark:focus:accent-[#49DEFF] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <label htmlFor="link-checkbox" className="ms-2 text-sm font-outfit text-gray-900 dark:text-gray-300">
            By signing up, I agree to Animara&#39;s <Link to="/" className="text-[#49DEFF] dark:text-[#49DEFF] hover:underline">Terms & Condition</Link>
          </label>
        </div>


        {/* signup button */}
        <button
          id="signup-button"
          disabled={isAuthLoading || !hasInput}
          onClick={handleSignUpWithEmail}
          className="mt-3 font-outfit font-bold text-[1rem] leading-[1rem] text-[#FFF5F5] w-full bg-[#FFB23F] rounded-[1.25rem] border-[0.4px] border-[#E59E69] py-[1.25rem] px-[2rem] hover:brightness-75"
        >
          {isAuthLoading ? (
            <div className="flex items-center justify-center">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-Fuchsia-200 animate-spin dark:text-Fuchsia-200 fill-indigo-600"
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
            <span className="">Sign Up</span>
          )}
        </button>
        <p className="mt-4 font-outfit text-[0.875rem] leading-[1rem] text-center">
            Already have an account? &nbsp;
            <Link
              to="/login"
              className="font-semibold hover:brightness-75 text-[#FFB23F]"
            >
              Login
            </Link>
          </p>

        {/*  Divider */}
        <div className="flex items-center my-6">
          <hr className="border-t border-[#C5C5C5] flex-grow" />
          <span className="px-8 text-[0.875rem] text-[#C5C5C5] font-outfit">Or</span>
          <hr className="border-t border-[#C5C5C5] flex-grow" />
        </div>

        {/* Social Login Buttons Section */}
        <button 
          type="button" 
          className="w-full max-h-[4rem] font-outfit text-[1rem] leading-[1rem] text-[#C5C5C5] rounded-[0.625rem] py-[0.875rem] px-[1rem] gap-[1.25rem] bg-[#0A4169] hover:brightness-75 text-center inline-flex items-center justify-center"
          onClick={handleLoginWithGoogle} 
        >
          <img 
            src="/socials/devicon_google.png" alt="" 
            className="max-h-[2.5rem] max-w-[2.5rem]"
          />
          Continue With Google
        </button>
        <button 
          type="button" 
          className="mt-1 max-h-[4rem] w-full font-outfit text-[1rem] leading-[1rem] text-[#C5C5C5] rounded-[0.625rem] py-[0.875rem] px-[1rem] gap-[1.25rem] bg-[#0A4169] hover:brightness-75 text-center inline-flex items-center justify-center"
          onClick={handleLoginWithTwitter} 
        >
          <img 
            src="/socials/devicon_x.png" alt="" 
            className="max-h-[2.5rem] max-w-[2.5rem]"
          />
          Continue With X
        </button>
        <div className="flex items-center justify-center">
          <LoginButton
            botUsername="ReactTonBot"
            onAuthCallback={handleTelegramAuth}
          />
        </div>


        {/* Policies */}
        <div className="mt-3 flex gap-8 font-outfit text-[#C5C5C5] text-[1rem] text-center justify-center">
          <Link to="/" className="hover:brightness-75">Privacy Policy</Link>
          <span>|</span>
          <Link to="/" className="hover:brightness-75">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
