import React from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div
      className="flex flex-col justify-center items-center w-screen h-screen"
      style={{
        backgroundImage: `url("/assets/images/clicker-character/verify-email-bg.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Logo */}
      <div className="absolute top-[2rem] xl:top-[4rem] left-[3rem] lg:left-[6rem] xl:left-[12rem]">
        <a className="cursor-pointer" href="https://animara.world" target="_blank" rel="noopener noreferrer">
          <img
            src={"/assets/images/clicker-character/animara-logo.webp"}
            alt="animara logo"
            className="w-[35%] xl:w-[50%] h-auto"
          />
        </a>
      </div>

      {/* Content */}
      <div
        className="w-auto h-[55dvh] xl:h-[70dvh] items-center justify-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: `url("/assets/images/clicker-character/verify-email-content-bg.webp")`,
          backgroundPosition: "center",
        }}
      >
        <div className="h-full flex flex-col justify-center items-center mb-4">
          <img
            src={"/assets/images/clicker-character/verify-email-icon.webp"}
            alt="verify email"
            className="w-auto h-[8dvh] xl:h-[15dvh] mb-[1rem]"
          />
          <h1 className="w-[70%] text-xl md:text-3xl lg:text-5xl font-semibold text-center text-[#ffa900] mb-[0.5rem] lg:mb-[1rem]">
            please check your email for the verification email
          </h1>
          <p className="w-[90%] text-[#3C3C3C] text-sm xl:text-xl text-center font-normal font-outfit ">
            If you have already verified your email,{" "}
            <span
              onClick={handleLoginRedirect}
              className="text-[#00b8e1] font-LuckiestGuy cursor-pointer "
            >
              click here
            </span>{" "}
            to proceed to the login page.
          </p>
        </div>

        <div className="flex justify-center items-center"></div>
      </div>

    </div>
  );
};

export default VerifyEmailPage;
