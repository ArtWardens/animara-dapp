import React, { useState, useEffect } from "react";

const NoInternetConnection = (props) => {
  // state variable holds the state of the internet connection
  const [isOnline, setOnline] = useState(true);

  // On initization set the isOnline state.
  useEffect(() => {
    setOnline(navigator.onLine);
  }, []);

  // event listeners to update the state
  window.addEventListener("online", () => {
    setOnline(true);
  });

  window.addEventListener("offline", () => {
    setOnline(false);
  });

  if (isOnline) {
    return props.children;
  } else {
    return <div
    className="flex flex-col justify-center items-center w-screen h-screen"
    style={{
      backgroundImage: `url("/assets/images/clicker-character/verify-email-bg.jpg")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* Logo */}
    <div className="absolute top-[2rem] xl:top-[4rem] left-[3rem] lg:left-[6rem] xl:left-[12rem]">
      <img
        src={"/assets/images/clicker-character/animara-logo.png"}
        alt="animara logo"
        className="w-[35%] xl:w-[50%] h-auto"
      />
    </div>

    {/* Content */}
    <div
      className="w-auto h-[55dvh] xl:h-[70dvh] items-center justify-center bg-contain bg-no-repeat"
      style={{
        backgroundImage: `url("/assets/images/clicker-character/verify-email-content-bg.png")`,
        backgroundPosition: "center",
      }}
    >
      <div className="h-full flex flex-col justify-center items-center mb-[1rem]">
        <img
          src={"/assets/images/clicker-character/locale.png"}
          alt="limited-access-icon"
          className="w-auto h-[8dvh] xl:h-[15dvh] mb-[1rem]"
        />
        <h1 className="w-[70%] text-xl md:text-3xl lg:text-5xl font-semibold text-center text-[#ffa900] mb-[0.5rem] lg:mb-[1rem]">
          Whoops!!
        </h1>
        <p className="w-[90%] text-[#3C3C3C] text-sm xl:text-xl text-center font-normal font-outfit ">
          No Internet connection was found. Check your connection or try again.
        </p>
      </div>

      <div className="flex justify-center items-center"></div>
    </div>
  </div>
  }
};

export default NoInternetConnection;
