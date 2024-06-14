import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSignUp, handleSignInWithGoogle } from "../../firebase/auth.ts";
import { useUserStore } from "../../store/store.ts";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword(!showPassword);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const userStore = useUserStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (userStore.user !== null) {
      console.log("redirect");
      navigate("/");
    }
  }, [userStore.user]);

  return (
    <div className="min-h-screen relative flex justify-around pt-24">
      <video
        autoPlay
        loop
        muted
        className="w-[100%] h-full absolute top-0 -z-40 opacity-75 object-cover"
      >
        <source src="../assets/images/login-bg.mp4" type="video/mp4" />
      </video>
      <div className="mt-20">
        <h3 className="text-6xl">Already have an account?</h3>
        <p className="font-outfit mt-2">
          Aenean non vulputate quam, eu dictum est. Aliquam erat volutpat.{" "}
          <br />
          Suspendisse bibendum felis ullamcorper mauris ullamcorper
        </p>
      </div>
      <div
        id="login-card"
        className="relative backdrop-blur-xl p-8 pt-12 self-center rounded-[1.5rem] md:w-[25%]"
      >
        <div
          style={{
            background:
              "linear-gradient(180deg, rgba(83, 0, 97, 0.50) 0%, rgba(13, 10, 48, 0.50) 100%)",
          }}
          className="absolute -z-10 -top-24 -left-20 w-[302px] h-[302px] rounded-[50%]"
        ></div>
        <h2 className="uppercase text-6xl">SignUp</h2>
        <p className="font-outfit text-white">Glad you're back!</p>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
          className="w-[100%] outline-none rounded-xl bg-transparent border border-white p-3 font-outfit mt-3 placeholder-white text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-[100%] outline-none rounded-xl bg-transparent border border-white p-3 font-outfit mt-3 placeholder-white text-white"
        />
        <div className="relative mt-5">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-[100%] outline-none rounded-xl bg-transparent p-3 border border-white font-outfit placeholder-white text-white"
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
          onClick={async () => {
            const user = await handleSignUp(email, password, name);
            if (user) {
              userStore.setUser(user);
              userStore.setDisplayName(name);
              navigate("/");
            }
          }}
          className="mt-3 font-outfit font-semibold w-[100%] bg-gray-700 p-4 rounded-xl"
        >
          Sign Up
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
            alt=""
            onClick={async () => {
              const user = await handleSignInWithGoogle();
              if (user) {
                userStore.setUser(user);
                userStore.setDisplayName(user.displayName);
                navigate("/");
              }
            }}
          />
          <img src="/socials/facebook.svg" alt="" />
          <img src="/socials/github.svg" alt="" />
        </div>
        <p className="font-outfit mt-20 mb-8 text-center block">
          Already have an account?{" "} &nbsp;
          <Link to="/login" className="underline underline-offset-4">
            Login
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

export default Signup;
