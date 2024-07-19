import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import TelegramLoginButton from "react-telegram-login";
import { handleSignInWithGoogle, handleSignInWithTwitter} from '../../firebase/auth.js';
import { useUserStore } from '../../store/store.ts';
import { useAppDispatch } from '../../hooks/storeHooks.js';
import { getUser, login, useUserDetails } from '../../sagaStore/slices/userSlice.js';
import { signInUser, storeUserInFirestore } from "../../utils/fuctions.js";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userStore = useUserStore();
  const currentUser = useUserDetails();
  const { t: tLogin } = useTranslation('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  useEffect(() => {

    const userTimeout = setTimeout(() => {
      dispatch(getUser());
    }, 1000);

    if (currentUser) {
      navigate("/clicker");
    }

    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        document.getElementById("login-form-btn").click();
      }
    };

    document.addEventListener("keypress", handleKeyPress);

    return () => {
      clearTimeout(userTimeout);
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [dispatch, currentUser, navigate]);

  const onHandleSignIn = async () => {
    dispatch(login({ email, password }));
    navigate("/clicker"); 
  }

  const handleTelegramResponse = async (response) => {
    const authUser = await signInUser();
    await storeUserInFirestore(authUser.uid, response);
    navigate("/clicker"); 
  };


  return (
    <div className="min-h-screen relative flex justify-around pt-0 md:pt-24">
      <video
        autoPlay
        loop
        muted
        className="w-[100%] h-full absolute top-0 -z-40 opacity-75 object-cover hidden md:block"
      >
        <source src="../assets/images/login-bg.mp4" type="video/mp4" />
      </video>
      <div className="mt-20 hidden md:block">
        <h3 className="text-6xl"> {tLogin('dontHaveAnAccount')} </h3>
        <p className="font-outfit mt-2">
          Aenean non vulputate quam, eu dictum est. Aliquam erat volutpat. <br />
          Suspendisse bibendum felis ullamcorper mauris ullamcorper
        </p>
      </div>
      <div id="login-card" className="relative backdrop-blur-xl p-8 pt-12 self-center rounded-[1.5rem] md:w-[25%]">
        <div
          style={{
            background: 'linear-gradient(180deg, rgba(83, 0, 97, 0.50) 0%, rgba(13, 10, 48, 0.50) 100%)',
          }}
          className="absolute -z-10 -top-24 -left-20 w-[302px] h-[302px] rounded-[50%]"
        ></div>
        <h2 className="uppercase text-6xl">{tLogin('login')}</h2>
        <p className="font-outfit text-white">{tLogin('gladYouAreBack')}</p>
        <input
          type="email"
          placeholder={tLogin('email')}
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-[100%] outline-none rounded-xl bg-transparent border border-white p-3 font-outfit mt-3 placeholder-white text-white"
        />
        <div className="relative mt-5">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder={tLogin('password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[100%] outline-none rounded-xl bg-transparent p-3 border border-white font-outfit placeholder-white text-white"
            required
          />
          <img
            onClick={togglePassword}
            src="../assets/images/eye.svg"
            alt="show password"
            className="absolute top-1/2 right-3 -translate-y-1/2 -translate-x-3 cursor-pointer"
          />
        </div>
        <div className="mt-3 pl-2 flex">
          <div className="relative mt-1">
            <input
              className="appearance-none bg-transparent z-10 opacity-0 absolute w-6 h-6"
              type="checkbox"
              name="rememberme"
              id="rememberme"
            />
            <label
              htmlFor="rememberme"
              className="block w-4 h-4 rounded-sm cursor-pointer absolute top-0 left-0 border border-white"
            />
            <label
              htmlFor="rememberme"
              className="block w-4 h-4 rounded-sm cursor-pointer absolute top-0 left-0 text-center text-white"
            >
              ✓
            </label>
          </div>
          {/* <input
            className="mr-3 rounded-lg"
            type="checkbox"
            name="rememberme"
            id=""
          /> */}
          <span className="font-outfit block ml-5 mb-5">&nbsp;Remember Me</span>
        </div>
        <button
          id="login-form-btn"
          className="mt-3 font-outfit font-semibold w-[100%] bg-gray-700 p-4 rounded-xl hover:brightness-75"
          onClick={onHandleSignIn}
        >
          Login
        </button>

        <div className="flex items-center mt-12">
          <hr className="border-t border-gray-600 flex-grow" />
          <span className="px-4 font-outfit">Or</span>
          <hr className="border-t border-gray-600 flex-grow" />
        </div>
        {/* <hr className="mt-12 bg-gray-600 w-[100%]" /> */}
        <div className="flex gap-4 justify-center mt-10">
          <img
            src="/socials/google.svg"
            alt="Google"
            className="hover:brightness-75"
            onClick={async () => {
              const user = await handleSignInWithGoogle();
              if (user) {
                userStore.setUser(user);
                navigate("/clicker"); 
              }
            }}
          />
          <img
            className="w-12 hover:brightness-75"
            src="/socials/twitter.svg"
            alt="Twitter"
            onClick={async () => {
              const user = await handleSignInWithTwitter();
              if (user) {
                navigate("/clicker"); 
              }
            }}
          />
          <div className="flex gap-4 justify-center relative w-[3.3rem]">
            <TelegramLoginButton
              className="w-[3rem] rounded-full absolute overflow-hidden opacity-[0.1] hover:brightness-75"
              dataOnauth={handleTelegramResponse}
              // botName="Animara_dapp_bot"
            />
            <img
              className="absolute w-[3.3rem] rounded-full -top-[5px] hover:brightness-75"
              src="/socials/telegram.svg"
              alt="Telegram"
            />
          </div>
        </div>
        <p className="font-outfit mt-20 mb-8 text-center block">
          Don't have an account? &nbsp;
          <Link to="/signup" className="underline underline-offset-4 hover:brightness-75">
            Signup
          </Link>
        </p>
        <div className="flex gap-8 font-outfit text-center justify-center mt-2 mb-3">
          <Link to="/">Terms & Conditions</Link>
          <Link to="/">Support</Link>
          <Link to="/">Customer Care</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;