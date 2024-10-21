import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import { useUserLocation, useUserLocationLoading, getUserLocations, useDailyComboMatched, useUserDetails } from "../../sagaStore/slices";
import UpgradeDetailsModal from "./UpgradeDetailsModal";
import { PropagateLoader } from "react-spinners";
import DynamicNumberDisplay from "../../components/DynamicNumberDisplay";

const ClickerUpgrades = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const totalProfit = "9,000,000";
  const [slideUpgrades, setSlideUpgrades] = useState(false);
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

  const handleBack = () =>{
    if (closeAnimTimer.current){ return; }
    setSlideUpgrades(false);
    closeAnimTimer.current = setTimeout(()=>{
      onClose();
    }, 200);
  }

  const handleOptionClick = (option, index) => {
    setSelectedOption(option.name);

      // Check if the screen width is below a certain threshold (e.g., 1024px for mobile)
      if (window.innerWidth < 1024) {
      // Scroll the selected element into view (only on mobile view)
      optionRefs.current[index].scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Aligns the item to the center vertically
        inline: 'center' // Aligns the item to the center horizontally (important for horizontal scroll)
      });
    }
  };

  return (
    <div className="w-full max-w-[90dvw]">
      <div 
        className={`h-full min-h-[700px] fixed inset-0 flex bg-dark bg-opacity-75 justify-center items-end z-50 transition-all duration-300
        ${slideUpgrades? `opacity-100` : `opacity-0`}`}
        onClick={handleBack}>
        <div
          className={`relative w-full lg:w-[90dvw] h-[90%] rounded-3xl p-3 amt-[10rem] transition-all duration-300 z-[100] ${slideUpgrades? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}
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
          <div className="absolute flex w-full justify-between -top-9">
            <img
              src={"/assets/images/clicker-character/ring01.webp"}
              alt="ring"
              className="object-cover w-12 absolute left-2"
            />
            <img
              src={"/assets/images/clicker-character/ring02.webp"}
              alt="ring"
              className="object-cover w-12 absolute right-8"
            />
          </div>

          <div
            className="flex flex-col w-full h-full rounded-2xl overflow-visible"
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

            {/* this line got problem */}
            <div className="h-full flex flex-col justify-start overflow-y-auto mt-[6rem]"> 
              <div className="w-full hidden lg:flex justify-center">
                  <p className="text-[#FFC85A] text-xl text-center font-normal uppercase">
                    upgrade & earn as you explore!
                  </p>
                </div>

              {/* Show loader if loading is true, otherwise display the content */}
              {userLocationLoading ? (
                <div className="h-full flex justify-center items-center ">
                  <PropagateLoader color={"#FFB23F"} />
                </div>
              ) : (
                <div className="w-full lg:max-w-[87dvw] h-full max-h-[70dvh] lg:max-h-[55dvh] flex flex-col lg:flex-row justify-start mt-[2rem] lg:mt-[4rem] lg:gap-[1rem] overflow-y-auto custom-scrollbar">
                  {/* Menu bar */}
                  <div className="w-full lg:w-[16dvw] h-full flex flex-col">
                    <div className="h-full lg:min-h-[800px] flex flex-row lg:flex-col lg:mt-[2.5rem] p-[2rem] lg:p-2 overflow-y-auto custom-scrollbar mb-[1rem] lg:mb-0">
                    {menuOptions.map((option, index) => (
                      <div
                        key={index}
                        onClick={() => setSelectedOption(option.name)}
                        className={`min-w-[150px] max-w-[200px] w-auto flex justify-center items-center gap-1.5 p-5 mt-0 lg:mt-[1rem] ml-[1rem] lg:ml-0 rounded-[10px] border-8 border-white ${
                          selectedOption === option.name ? 'bg-[#FFB100] transform rotate-6' : 'bg-[#146CFC]'
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
                    <div className="w-full flex flex-row flex-wrap justify-center lg:justify-between items-center p-4">
                      <div className="hidden lg:flex flex-row">
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
                        <div className={`flex flex-col lg:flex-row items-center ${dailyComboMatched.every(item => item !== "") ? "bg-[#ffa900]" : "bg-[#684500]"} rounded-3xl px-[2rem] py-[1rem] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}>
                          <div className="flex flex-col mb-2 lg:mb-0">
                            <div className="text-white text-base lg:text-xl font-LuckiestGuy font-normal tracking-wider ">
                              DAILY COMBO
                            </div>
                            <div className="flex flex-row items-center text-white text-sm lg:text-lg ">
                              <img src="/assets/images/clicker-character/gem.webp" alt="currency icon" className="w-4 lg:w-6 h-auto" />
                              <span className="mx-2">{totalProfit}</span>
                              <img 
                                src={`/assets/images/clicker-character/${dailyComboMatched.every(item => item !== "") ? "checked" : "unchecked"}.webp`} 
                                alt={`${dailyComboMatched.every(item => item !== "") ? "checked" : "unchecked"} icon`} 
                                className="w-4 h-4 ml-2" 
                              />
                            </div>
                          </div>
                          <div className="flex ml-4">
                            <img src={`/assets/images/clicker-character/treasure-${dailyComboMatched[0] !== "" ? "unlocked" : "locked"}.webp`} alt="reward 1" title={dailyComboMatched.length > 0 ? t(dailyComboMatched[0]) : ""} className="w-full h-full" />
                            <img src={`/assets/images/clicker-character/treasure-${dailyComboMatched[1] !== "" ? "unlocked" : "locked"}.webp`} alt="reward 2" title={dailyComboMatched.length > 1 ? t(dailyComboMatched[1]) : ""} className="w-full h-full ml-2" />
                            <img src={`/assets/images/clicker-character/treasure-${dailyComboMatched[2] !== "" ? "unlocked" : "locked"}.webp`} alt="reward 2" title={dailyComboMatched.length > 2 ? t(dailyComboMatched[2]) : ""} className="w-full h-full ml-2" />
                          </div>
                        </div>

                        {/* Explora Points Section */}
                        <div className="flex flex-row items-center bg-[#11365F] rounded-3xl px-[1.5rem] py-[1.3rem] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                          <img src="/assets/icons/explora-point.webp" alt="profit icon" className="w-10 h-10 mr-2" />
                          <div className="flex flex-col mr-[1rem]">
                            <div className="text-[#00E0FF] text-2xl font-LuckiestGuy font-normal tracking-wider">
                              {currentUser?.profitPerHour || 0}
                            </div>
                            <div className="text-white text-sm font-outfit">
                              Explora Points
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
                        <div className="h-full w-full max-w-[1480px] flex flex-col lg:flex-row flex-wrap items-center justify-start gap-4 amt-4 p-4 overflow-y-auto custom-scrollbar">
                          {userLocations
                            .filter((location) => location.region === selectedOption)
                            .sort((a, b) => (a.level >= 0 && b.level === -1 ? -1 : 1)) // Sort unlocked locations first
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
                                        {location.level === -1 ? "-" : location.level}
                                      </p>
                                    </div>
                                    <div className="w-full flex flex-row items-center justify-between">
                                      <p className="text-white text-sm font-sans">
                                        Explora Points
                                      </p>
                                      <div className="flex flex-row">
                                        <DynamicNumberDisplay 
                                          // number={location.level === 0 && location.level !== -1
                                          //     ? location.nextLevelExploraPts
                                          //     : location.currentExploraPts}
                                          number={location.nextLevelExploraPts - location.currentExploraPts}
                                          imgSrc={"/assets/icons/explora-point.webp"}
                                          imgClassName={"w-6 h-6 mr-1"}
                                          spanClassName={"text-[#00E0FF]"}
                                        />
                                      </div>
                                    </div>
                                    <div className="w-full border-t-2 border-blue-400 my-[0.5rem]"></div>
                                    <div className="w-full flex flex-row justify-between ">
                                      <p>
                                        {location.level === 0 && location.level !== -1
                                          ? "Explore"
                                          : "Upgrade with"}
                                      </p>
                                      {location.level !== -1 && (
                                        <div className="flex flex-row ml-[2rem]">
                                          {location.nextLevelUpgradeCost === 0 
                                            ? (
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
                                            ) 
                                            : (
                                              <DynamicNumberDisplay 
                                                  number={location.nextLevelUpgradeCost === 0
                                                    ? "Max"
                                                    : location.nextLevelUpgradeCost}
                                                  imgSrc={"assets/images/clicker-character/icon-2.webp"}
                                                  imgClassName={"w-6 h-6 mr-1"}
                                                  spanClassName={"text-[#ffa900]"}
                                                />
                                            )
                                          }
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
                                        className="w-full h-full absolute inset-0"
                                      />
                                    </>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      ) : (
                        <div className="flex justify-center items-end lg:items-center h-full">
                          <p className="text-white text-center text-2xl mt-[4rem] lg:mt-0">
                            No upgrades available for this region
                          </p>
                        </div>
                      )
                    ) : (
                      <p className="w-full h-full flex justify-center items-center text-white text-center">
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
};

ClickerUpgrades.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ClickerUpgrades;
