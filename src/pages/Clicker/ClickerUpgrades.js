import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import { useUserLocation, useUserLocationLoading, getUserLocations, useDailyComboMatched, useUserDetails } from "../../sagaStore/slices";
import UpgradeDetailsModal from "./UpgradeDetailsModal";
import { PropagateLoader } from "react-spinners";
import DynamicNumberDisplay from "../../components/DynamicNumberDisplay";
import { Modal } from "@mui/material";
import MintingWarningNotice from "../../components/MintingWarningNotice.jsx";

const ClickerUpgrades = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const totalProfit = "9,000,000";
  const [slideUpgrades, setSlideUpgrades] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeAnimTimer = useRef(null);

  const menuOptions = [
    {
      name: "mountain",
      label: "Mountain",
      icon: "/assets/images/clicker-character/mountain-icon.webp",
    },
    {
      name: "forest",
      label: "Forest",
      icon: "/assets/images/clicker-character/forest-icon.webp",
    },
    {
      name: "desert",
      label: "Desert",
      icon: "/assets/images/clicker-character/desert-icon.webp",
    },
    {
      name: "cave",
      label: "Cave",
      icon: "/assets/images/clicker-character/cave-icon.webp",
    },
    {
      name: "iceland",
      label: "Iceland",
      icon: "/assets/images/clicker-character/iceland-icon.webp",
    },
    {
      name: "valley",
      label: "Valley",
      icon: "/assets/images/clicker-character/valley-icon.webp",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("mountain");
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const userLocationLoading = useUserLocationLoading();

  const userLocations = useUserLocation();
  const currentUser = useUserDetails();
  const dailyComboMatched = useDailyComboMatched();
  const optionRefs = useRef([]);
  
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  useEffect(() => {
    if (!userLocations && !userLocationLoading) {
      dispatch(getUserLocations());
    }

    // intro animations
    const timerUpgrades = setTimeout(() => {
      setSlideUpgrades(true);
    }, 250);

    return () => {
      clearTimeout(timerUpgrades);
    };
  }, [userLocations]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Toggle notice component
  const handleInfoClick = () => {
    setIsNoticeOpen(true);
  };

  const closeNotice = () => {
    setIsNoticeOpen(false);
  };

  const handleBack = () => {
    if (closeAnimTimer.current) return;
    setSlideUpgrades(false);
    closeAnimTimer.current = setTimeout(() => {
      onClose();
    }, 200);
  };

  const handleOptionClick = (option, index) => {
    setSelectedOption(option.name);

    if (window.innerWidth < 1024) {
      // Scroll the selected element into view (only on mobile view)
      optionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "center", // Aligns the item to the center vertically
        inline: "center", // Aligns the item to the center horizontally
      });
    }
  };

  const renderWebView = () => (
    <div className="w-full max-w-[90dvw]">
      <div
        className={`h-full min-h-[700px] fixed inset-0 flex bg-dark bg-opacity-75 justify-center items-end z-50 transition-all duration-300
        ${slideUpgrades ? `opacity-100` : `opacity-0`}`}
        onClick={handleBack}
      >
        <div
          className={`relative w-full lg:w-[90dvw] h-[90%] rounded-3xl p-3 amt-[10rem] transition-all duration-300 z-[100] ${slideUpgrades ? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}
          style={{
            border: "2px solid var(--Color, #F4FBFF)",
            background: "rgba(155, 231, 255, 0.58)",
            boxShadow:
              "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
            backdropFilter: "blur(15px)",
            zIndex: 100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute flex justify-between w-full -top-9">
            <img
              src={"/assets/images/clicker-character/ring01.webp"}
              alt="ring"
              className="absolute object-cover w-12 left-2"
            />
            <img
              src={"/assets/images/clicker-character/ring02.webp"}
              alt="ring"
              className="absolute object-cover w-12 right-8"
            />
          </div>

          <div
            className="flex flex-col w-full h-full overflow-visible rounded-2xl"
            style={{
              backgroundImage:
                'url("/assets/images/clicker-character/mascotBg.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute w-full top-0 left-0 flex items-center justify-center px-[4rem] pointer-events-none">
              <img
                src={"/assets/images/clicker-character/explore-animara.webp"}
                alt="explore-animara"
                className="w-[100%] lg:w-[50%] mt-[-1rem] lg:mt-[-3rem] overflow-visible"
              />
            </div>

            <div className="h-full flex flex-col justify-start overflow-y-auto mt-[1rem] sm:mt-[6rem] lg:mt-[4rem]">
              <div className="justify-center hidden w-full lg:flex">
                <p className="text-[#FFC85A] text-xl text-center font-normal uppercase">
                  upgrade & earn as you explore!
                </p>
              </div>

              {/* Show loader if loading is true, otherwise display the content */}
              {userLocationLoading ? (
                <div className="flex items-center justify-center h-full ">
                  <PropagateLoader color={"#FFB23F"} />
                </div>
              ) : (
                <div className="w-full max-h-[100vh] lg:max-w-[87dvw] h-full flex flex-col lg:flex-row justify-start mt-[2rem] lg:gap-[1rem] overflow-y-auto custom-scrollbar xs:overflow-x-hidden">
                  {/* Menu bar */}
                  <div className="w-full lg:w-[16dvw] h-full flex flex-col">
                    <div className="h-full lg:min-h-[800px] flex flex-row lg:flex-col lg:mt-[2.5rem] p-[2rem] lg:p-2 overflow-y-auto custom-scrollbar mb-[1rem] lg:mb-0 ">
                      {menuOptions.map((option, index) => (
                        <div
                          key={index}
                          ref={(el) => (optionRefs.current[index] = el)}
                          onClick={() => handleOptionClick(option, index)}
                          className={`min-w-[150px] max-w-[200px] w-auto flex justify-center items-center gap-1.5 p-5 mt-0 lg:mt-[1rem] ml-[1rem] lg:ml-0 rounded-[10px] border-8 border-white ${
                            selectedOption === option.name
                              ? "bg-[#FFB100] transform rotate-6"
                              : "bg-[#146CFC]"
                          } hover:pl-[24px] hover:pr-[20px] hover:rotate-6 hover:scale-105 transition-transform duration-300 ease-in-out`}
                        >
                          <img
                            src={option.icon}
                            alt={`${option.name} icon`}
                            className="w-6 h-6 lg:mr-4"
                          />
                          <span className="text-white text-base lg:text-xl capitalize leading-[18px]">
                            {option.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="w-full flex flex-col mr-0 lg:mr-[2rem] ">
                    <div className="flex flex-row flex-wrap items-center justify-center w-full p-4 lg:justify-between">
                      <div className="flex-row hidden lg:flex">
                        <img
                          src={`/assets/images/clicker-character/${selectedOption}-icon.webp`}
                          alt={`${selectedOption} icon`}
                          className="w-10 h-10 mr-4"
                        />
                        <div className="text-[#FFFFFF] text-4xl text-center font-LuckiestGuy font-normal tracking-widest">
                          {selectedOption.charAt(0).toUpperCase() +
                            selectedOption.slice(1)}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row items-center gap-[1rem]">
                        {/* Daily Combo Section */}
                        <div
                          className={`flex flex-col lg:flex-row items-center ${
                            dailyComboMatched.every((item) => item !== "")
                              ? "bg-[#ffa900]"
                              : "bg-[#684500]"
                          } rounded-3xl px-[2rem] py-[1rem] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}
                        >
                          <div className="flex flex-col mb-2 lg:mb-0">
                            <div className="text-base font-normal tracking-wider text-white lg:text-xl font-LuckiestGuy ">
                              DAILY COMBO
                            </div>
                            <div className="flex flex-row items-center text-sm text-white lg:text-lg ">
                              <img
                                src="/assets/images/clicker-character/gem.webp"
                                alt="currency icon"
                                className="w-4 h-auto lg:w-6"
                              />
                              <span className="mx-2">{totalProfit}</span>
                              <img
                                src={`/assets/images/clicker-character/${
                                  dailyComboMatched.every(
                                    (item) => item !== ""
                                  )
                                    ? "checked"
                                    : "unchecked"
                                }.webp`}
                                alt={`${
                                  dailyComboMatched.every(
                                    (item) => item !== ""
                                  )
                                    ? "checked"
                                    : "unchecked"
                                } icon`}
                                className="w-4 h-4 ml-2"
                              />
                            </div>
                          </div>
                          <div className="flex ml-4">
                            <img
                              src={`/assets/images/clicker-character/treasure-${
                                dailyComboMatched[0] !== ""
                                  ? "unlocked"
                                  : "locked"
                              }.webp`}
                              alt="reward 1"
                              title={
                                dailyComboMatched.length > 0
                                  ? t(dailyComboMatched[0])
                                  : ""
                              }
                              className="w-full h-full"
                            />
                            <img
                              src={`/assets/images/clicker-character/treasure-${
                                dailyComboMatched[1] !== ""
                                  ? "unlocked"
                                  : "locked"
                              }.webp`}
                              alt="reward 2"
                              title={
                                dailyComboMatched.length > 1
                                  ? t(dailyComboMatched[1])
                                  : ""
                              }
                              className="w-full h-full ml-2"
                            />
                            <img
                              src={`/assets/images/clicker-character/treasure-${
                                dailyComboMatched[2] !== ""
                                  ? "unlocked"
                                  : "locked"
                              }.webp`}
                              alt="reward 2"
                              title={
                                dailyComboMatched.length > 2
                                  ? t(dailyComboMatched[2])
                                  : ""
                              }
                              className="w-full h-full ml-2"
                            />
                          </div>
                        </div>

                        {/* Explora Points Section */}
                        <div className="flex flex-row items-center bg-[#11365F] rounded-3xl px-[1.5rem] py-[1.3rem] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          <img
                            src="/assets/icons/explora-point.webp"
                            alt="profit icon"
                            className="w-10 h-10 mr-2"
                          />
                          <div className="flex flex-col">
                            <div className="text-[#00E0FF] text-2xl font-LuckiestGuy font-normal tracking-wider">
                              {currentUser?.profitPerHour || 0}
                            </div>
                            <div className="flex items-center text-sm text-white font-outfit">
                              Explora Points
                              <img
                                src="/assets/icons/info-blue.webp"
                                alt="explore info"
                                className="w-4 h-4 ml-2"
                                onClick={handleInfoClick}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Display Upgrades */}
                    {userLocations && userLocations.length > 0 ? (
                      userLocations.filter(
                        (location) => location.region === selectedOption
                      ).length > 0 ? (
                        <div className="h-auto w-full max-w-[1480px] flex flex-col lg:flex-row flex-wrap items-center justify-start gap-4 amt-4 p-4">
                          {userLocations
                            .filter(
                              (location) => location.region === selectedOption
                            )
                            .sort((a, b) =>
                              a.level >= 0 && b.level === -1 ? -1 : 1
                            ) // Sort unlocked locations first
                            .map((location, index) => {
                              return (
                                <div
                                  key={index}
                                  className={`w-[300px] xs:w-[350px] rounded-[36px] text-white flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 ${
                                    location.level === -1 ? "" : ""
                                  }`}
                                  style={{
                                    position: "relative",
                                    backgroundImage: `url("/assets/images/clicker-character/upgrades-bg.webp")`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                  }}
                                  onClick={
                                    location.level !== -1
                                      ? () => setSelectedUpgrade(location)
                                      : undefined
                                  }
                                >
                                  <div className="w-full flex flex-col items-start px-[2rem] py-[2rem]">
                                    <div className="flex flex-row items-center justify-between mb-[0.5rem]">
                                      <p>{t(location.locationId)} &nbsp;</p>
                                      <p className="text-[#ffa900]">
                                        LV.{" "}
                                        {location.level === -1
                                          ? "-"
                                          : location.level}
                                      </p>
                                    </div>
                                    <div className="flex flex-row items-center justify-between w-full">
                                      <p className="font-sans text-sm text-white">
                                        Explora Points
                                      </p>
                                      <div className="flex flex-row">
                                        <DynamicNumberDisplay
                                          number={
                                            location.nextLevelExploraPts -
                                            location.currentExploraPts
                                          }
                                          imgSrc={
                                            "/assets/icons/explora-point.webp"
                                          }
                                          imgClassName={"w-6 h-6 mr-1"}
                                          spanClassName={"text-[#00E0FF]"}
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full border-t-2 border-blue-400 my-[0.5rem]"></div>
                                    <div className="flex flex-row justify-between w-full ">
                                      <p>
                                        {location.level === 0 &&
                                        location.level !== -1
                                          ? "Explore"
                                          : "Upgrade with"}
                                      </p>
                                      {location.level !== -1 && (
                                        <div className="flex flex-row ml-[2rem]">
                                          {location.nextLevelUpgradeCost === 0 ? (
                                            <>
                                              <img
                                                src={
                                                  "/assets/images/clicker-character/icon-2.webp"
                                                }
                                                alt="icon2"
                                                className="w-6 h-6 mr-2"
                                              />
                                              <p className="text-[#ffa900]">
                                                Max
                                              </p>
                                            </>
                                          ) : (
                                            <DynamicNumberDisplay
                                              number={
                                                location.nextLevelUpgradeCost ===
                                                0
                                                  ? "Max"
                                                  : location.nextLevelUpgradeCost
                                              }
                                              imgSrc={
                                                "assets/images/clicker-character/icon-2.webp"
                                              }
                                              imgClassName={"w-6 h-6 mr-1"}
                                              spanClassName={"text-[#ffa900]"}
                                            />
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {location.level === -1 && (
                                    <>
                                      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.8)] flex justify-center items-center opacity-70 rounded-[36px] backdrop-blur-lg"></div>
                                      <img
                                        src="/assets/images/clicker-character/lock-chain-only.webp"
                                        style={{
                                          backgroundSize: "contain",
                                          backgroundPosition: "center",
                                          backgroundRepeat: "no-repeat",
                                        }}
                                        alt="Locked"
                                        className="absolute inset-0 w-full h-full"
                                      />
                                    </>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="flex items-end justify-center h-full lg:items-center">
                          <p className="text-white text-center text-2xl mt-[4rem] lg:mt-0">
                            No upgrades available for this region
                          </p>
                        </div>
                      )
                    ) : (
                      <p className="flex items-center justify-center w-full h-full text-center text-white">
                        No upgrades available
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Render UpgradeDetailsModal if an upgrade is selected */}
          {selectedUpgrade && (
            <UpgradeDetailsModal
              upgrade={selectedUpgrade}
              isMaxLevel={selectedUpgrade.level === selectedUpgrade.maxLevel}
              onClose={() => setSelectedUpgrade(null)}
            />
          )}
        </div>
      </div>
    </div>
  );

  const renderMobileView = () => (
    <div className="w-full max-w-[90vw]">
      {/* Close indicator outside the modal */}
      <div
        className="absolute text-lg font-bold text-white cursor-pointer z-[100] top-4 right-4"
        onClick={handleBack}
      >
        &#10005; {/* This is the close (X) symbol */}
      </div>
  
      <div
        className={`fixed inset-0 flex bg-dark bg-opacity-75 justify-center items-center z-50 transition-all duration-300 ${
          slideUpgrades ? `opacity-100` : `opacity-0`
        }`}
        onClick={handleBack}
      >
        <div
          className={`relative w-[90vw] lg:w-[80vw] h-[95vh] max-h-[95vh] rounded-3xl p-3 transition-all duration-300 z-[100] ${
            slideUpgrades ? `translate-y-0 opacity-100` : `opacity-0`
          }`}
          style={{
            border: "2px solid var(--Color, #F4FBFF)",
            background: "rgba(155, 231, 255, 0.58)",
            boxShadow:
              "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
            backdropFilter: "blur(15px)",
            zIndex: 100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="flex flex-col w-full h-full overflow-auto rounded-2xl"
            style={{
              backgroundImage: 'url("/assets/images/clicker-character/mascotBg.webp")',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Explora Points Section */}
            <div className="absolute w-full top-0 left-0 flex items-center justify-center px-[2rem] pointer-events-none">
              <img
                src={"/assets/images/clicker-character/explore-animara-mobile.webp"}
                alt="explore-animara"
                className="w-[150%] lg:w-[80%] mt-[-2rem] lg:mt-[-4rem]"
              />
            </div>
  
            <div className="absolute flex justify-between w-full -top-9">
              <img
                src={"/assets/images/clicker-character/ring01.webp"}
                alt="ring"
                className="absolute object-cover w-12 left-2"
              />
              <img
                src={"/assets/images/clicker-character/ring02.webp"}
                alt="ring"
                className="absolute object-cover w-12 right-8"
              />
            </div>
  
            <div className="h-full flex flex-col justify-start overflow-y-auto mt-[1rem]">
              {/* Explora Points Section */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-2">
                  <img
                    src="/assets/icons/explora-point.webp"
                    alt="explora points icon"
                    className="w-8 h-8"
                  />
                  <div
                    className="text-[#00E0FF] font-LuckiestGuy tracking-wider"
                    style={{ fontSize: "1.75rem", lineHeight: "2rem" }}
                  >
                    {currentUser?.profitPerHour || 0}
                  </div>
                </div>
  
                <div className="flex items-center pr-4 space-x-2">
                  <div className="text-sm text-white font-outfit">Explora Points</div>
                  <img
                    src="/assets/icons/info-blue.webp"
                    alt="explore info"
                    className="w-4 h-4"
                    onClick={handleInfoClick}
                  />
                </div>
              </div>
  
              {/* Daily Combo Section */}
              <div className="flex items-center justify-center">
                <div
                  className={`rounded-3xl p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)] w-[90%]
                    ${
                      dailyComboMatched.every((item) => item !== "")
                        ? "bg-[#ffa900]"
                        : "bg-[#684500]"
                    }`}
                >
                  <div className="flex flex-row items-center justify-between">
                    <div className="mb-2 text-2xl text-white basis-1/3 xs:text-3xl font-LuckiestGuy">
                      DAILY COMBO
                    </div>
                    <div className="flex justify-end w-full space-x-2 overflow-hidden basis-2/3">
                      {dailyComboMatched.map((item, index) => (
                        <img
                          key={index}
                          src={`/assets/images/clicker-character/treasure-${
                            item !== "" ? "unlocked" : "locked"
                          }.webp`}
                          alt={`reward ${index + 1}`}
                          className="object-contain w-10 h-10 xs:w-14 xs:h-14"
                          style={{ maxWidth: "100%", maxHeight: "100%" }} 
                        />
                      ))}
                    </div>
                  </div>
  
                  {/* Treasure boxes and checkbox */}
                  <div className="flex flex-row items-center w-full">
                    <div className="flex items-center space-x-2 basis-2/3">
                      <img
                        src="/assets/images/clicker-character/gem.webp"
                        alt="currency icon"
                        className="w-6 h-auto"
                      />
                      <span className="text-lg text-white font-LuckiestGuy">
                        90,000,000
                      </span>
                    </div>
                    <div className="basis-1/3">
                      <img
                        src={`/assets/images/clicker-character/${
                          dailyComboMatched.every((item) => item !== "") ? "checked" : "unchecked"
                        }.webp`}
                        alt="checkbox"
                        className="w-6 h-6 mt-1 ml-auto"
                        style={{ alignSelf: "flex-end" }}
                      />
                    </div>
                  </div>

                </div>
              </div>
  
              {/* Menu Bar */}
              <div className="flex justify-center w-full mt-4">
                <div className="flex flex-row gap-2 overflow-x-auto overflow-y-hidden no-scrollbar">
                  {menuOptions.map((option, index) => (
                    <div
                      key={index}
                      ref={(el) => (optionRefs.current[index] = el)}
                      onClick={() => handleOptionClick(option, index)}
                      className={`min-w-[100px] max-w-[150px] w-auto flex justify-center items-center gap-1.5 py-2 px-4 mt-2 rounded-[10px] border-4 border-white ${
                        selectedOption === option.name
                          ? "bg-[#FFB100] transform rotate-6"
                          : "bg-[#146CFC]"
                      } hover:pl-[16px] hover:pr-[16px] hover:rotate-6 hover:scale-105 transition-transform duration-300 ease-in-out`}
                    >
                      <span className="text-base text-white capitalize">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
  
              {/* Display Upgrades */}
              {userLocations && userLocations.length > 0 ? (
                userLocations.filter((location) => location.region === selectedOption).length > 0 ? (
                  <div className="flex flex-col items-center justify-start w-full p-2 mt-2 overflow-x-hidden overflow-y-auto custom-scrollbar">
                    {userLocations
                      .filter((location) => location.region === selectedOption)
                      .sort((a, b) => (a.level >= 0 && b.level === -1 ? -1 : 1))
                      .map((location, index) => (
                        <div
                          key={index}
                          className={`w-full sm:w-[90%] md:w-[80%] lg:w-[75%] xl:w-[60%] rounded-[36px] text-white flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 ${
                            location.level === -1 ? "" : ""
                          } mb-4`}
                          style={{
                            position: "relative",
                            backgroundImage: `url("/assets/images/clicker-character/upgrades-bg.webp")`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                          onClick={
                            location.level !== -1
                              ? () => setSelectedUpgrade(location)
                              : undefined
                          }
                        >
                          <div className="flex flex-col items-start w-full px-4 py-4 sm:px-6 sm:py-6">
                            <div className="flex flex-row items-center justify-between mb-2">
                              <p>{t(location.locationId)} &nbsp;</p>
                              <p className="text-[#ffa900]">
                                LV. {location.level === -1 ? "-" : location.level}
                              </p>
                            </div>
                            <div className="flex flex-row items-center justify-between w-full">
                              <p className="font-sans text-sm text-white">Explora Points</p>
                              <div className="flex flex-row">
                                <DynamicNumberDisplay
                                  number={location.nextLevelExploraPts - location.currentExploraPts}
                                  imgSrc={"/assets/icons/explora-point.webp"}
                                  imgClassName={"w-6 h-6 mr-1"}
                                  spanClassName={"text-[#00E0FF]"}
                                />
                              </div>
                            </div>
                            <div className="w-full my-2 border-t-2 border-blue-400"></div>
                            <div className="flex flex-row justify-between w-full">
                              <p>
                                {location.level === 0 && location.level !== -1
                                  ? "Explore"
                                  : "Upgrade with"}
                              </p>
                              {location.level !== -1 && (
                                <div className="flex flex-row ml-4">
                                  {location.nextLevelUpgradeCost === 0 ? (
                                    <>
                                      <img
                                        src={"/assets/images/clicker-character/icon-2.webp"}
                                        alt="icon2"
                                        className="w-6 h-6 mr-2"
                                      />
                                      <p className="text-[#ffa900]">Max</p>
                                    </>
                                  ) : (
                                    <DynamicNumberDisplay
                                      number={
                                        location.nextLevelUpgradeCost === 0
                                          ? "Max"
                                          : location.nextLevelUpgradeCost
                                      }
                                      imgSrc={"assets/images/clicker-character/icon-2.webp"}
                                      imgClassName={"w-6 h-6 mr-1"}
                                      spanClassName={"text-[#ffa900]"}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
  
                          {location.level === -1 && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.8)] flex justify-center items-center opacity-70 rounded-[36px] backdrop-blur-lg"></div>
                              <img
                                src="/assets/images/clicker-character/lock-chain-only.webp"
                                alt="Locked"
                                className="absolute inset-0 w-full h-full"
                              />
                            </>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-white text-center text-2xl mt-[4rem]">No upgrades available</p>
                  </div>
                )
              ) : (
                <p className="flex items-center justify-center w-full h-full text-center text-white">
                  No upgrades available
                </p>
              )}
            </div>
          </div>
        
            {/* Render UpgradeDetailsModal if an upgrade is selected */}
            {selectedUpgrade && (
              <UpgradeDetailsModal
                upgrade={selectedUpgrade}
                isMaxLevel={selectedUpgrade.level === selectedUpgrade.maxLevel}
                onClose={() => setSelectedUpgrade(null)}
              />
            )}
        </div>
      </div>
    </div>


  );
  
  return (
    <>
      {isMobile ? renderMobileView() : renderWebView()}
      <Modal
        open={isNoticeOpen}
        className="flex flex-1 w-screen h-screen overflow-x-hidden overflow-y-auto"
        >
        <div>
          <MintingWarningNotice onClose={closeNotice} />
        </div>
      </Modal>
    </>
  )
};

ClickerUpgrades.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ClickerUpgrades;
