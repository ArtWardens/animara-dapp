import React, { useEffect, useState } from "react";
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
  const [name, setName] = useState("");
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
      name !== "" && email !== "" && password !== "" && confirmPassword !== ""
    );
  }, [name, email, password, confirmPassword]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUpWithEmail = async () => {
    if (password !== confirmPassword) {
      setDoPasswordsMatch(false);
      return;
    }
    setDoPasswordsMatch(true);
    dispatch(signupWithEmail({ email, password, name, referralCode }));
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
      setEmailError("Invalid email format");
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
      return "border-white";
    }
    return isEmailValid ? "border-green-500" : "border-red-500";
  };

  const getPasswordInputBorderClass = () => {
    if (password === "") {
      return "border-white";
    }
    return isPasswordValid ? "border-green-500" : "border-red-500";
  };

  const getConfirmPasswordInputBorderClass = () => {
    if (confirmPassword === "") {
      return "border-white";
    }
    return doPasswordsMatch ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="min-h-screen relative flex justify-around pt-0 md-pt-24">
      {/* Background */}
      <video
        autoPlay
        loop
        muted
        className="w-[100%] h-full absolute top-0 -z-40 opacity-75 object-cover hidden md:block"
      >
        <source src="./assets/images/login-bg.mp4" type="video/mp4" />
      </video>

      {/* Login Card */}
      <div
        id="login-card"
        className="relative backdrop-blur-xl p-8 pt-12 mr-10 ml-auto self-center rounded-[1.5rem] md:w-[25%]"
      >
        {/*  Card Background */}
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(83, 0, 97, 0.50) 0%, rgba(13, 10, 48, 0.50) 100%)",
          }}
          className="absolute -z-10 -top-24 -left-20 w-[302px] h-[302px] rounded-[50%]"
        ></div>

        {/*  Title */}
        <h2 className="uppercase text-6xl">SignUp</h2>
        <p className="font-outfit text-white">Welcome to Animara!</p>

        {/* Full Name */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-[100%] outline-none rounded-xl bg-transparent border border-white p-3 font-outfit mt-3 placeholder-white text-white"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={handleEmailChange}
          className={`w-[100%] outline-none rounded-xl bg-transparent p-3 font-outfit mt-3 placeholder-white text-white border ${getEmailInputBorderClass()}`}
        />
        {!isEmailValid && <p className="text-red-500">{emailError}</p>}

        {/* Password */}
        <div className="relative mt-5">
          <div className="flex flex-row">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-[100%] outline-none rounded-xl bg-transparent p-3 font-outfit placeholder-white text-white border ${getPasswordInputBorderClass()}`}
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
        <div className="relative mt-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className={`w-[100%] outline-none rounded-xl bg-transparent p-3 font-outfit placeholder-white text-white border ${getConfirmPasswordInputBorderClass()}`}
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
          className="w-[100%] outline-none rounded-xl bg-transparent border border-white p-3 font-outfit mt-3 placeholder-white text-white"
        />

        {/* signup button */}
        <button
          id="signup-button"
          disabled={isAuthLoading || !hasInput}
          onClick={handleSignUpWithEmail}
          className="mt-3 font-outfit font-semibold w-[100%] bg-gray-700 p-4 rounded-xl"
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

        {/*  Divider */}
        <div className="flex items-center mt-12">
          <hr className="border-t border-gray-600 flex-grow" />
          <span className="px-4 font-outfit">Or</span>
          <hr className="border-t border-gray-600 flex-grow" />
        </div>

        {/* SSO */}
        <div className="flex gap-4 justify-center my-[2.5rem]">
          <img
            src="/socials/google.svg"
            alt=""
            onClick={handleLoginWithGoogle}
          />
          <img
            className="w-12 hover:brightness-75"
            src="/socials/twitter.svg"
            alt=""
            onClick={handleLoginWithTwitter}
          />
        </div>
        {/* Telegram */}
        <div className="flex items-center justify-center">
          <LoginButton
            botUsername="ReactTonBot"
            onAuthCallback={handleTelegramAuth}
          />
        </div>

        {/* Login redirection */}
        <p className="font-outfit mt-20 mb-8 text-center block">
          Already have an account? &nbsp;
          <Link
            to="/login"
            className="underline underline-offset-4 hover:brightness-75"
          >
            Login
          </Link>
        </p>

        {/* Policies */}
        <div className="flex gap-8 font-outfit text-center justify-center mt-2 mb-3">
          <Link to="/">Terms & Conditions</Link>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
