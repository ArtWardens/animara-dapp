import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import { useUserLocation, useUserLocationLoading, getUserLocations, useDailyComboMatched, useUserDetails } from "../../sagaStore/slices";
import UpgradeDetailsModal from "./UpgradeDetailsModal";
import { PropagateLoader } from "react-spinners";
import LeaderBoardModal from "../../components/LeaderBoardModal";

const ClickerUpgrades = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const totalProfit = "9,000,000";
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [slideUpgrades, setSlideUpgrades] = useState(false);

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
      name: "deserts",
      label: "Deserts",
      icon: "/assets/images/clicker-character/deserts-icon.webp",
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

  const [selectedOption, setSelectedOption] = useState("forest");
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const userLocationLoading = useUserLocationLoading();

  const { userLocations } = useUserLocation();
  const currentUser = useUserDetails();
  const dailyComboMatched = useDailyComboMatched();
  const closeAnimTimer = useRef(null);

  useEffect(() => {
    if (!userLocations && !userLocationLoading) {
      dispatch(getUserLocations());
    }

    // intro animations
    const timerUpgrades = setTimeout(() => {
      setSlideUpgrades(true);
    }, 1);

    return () => {
      clearTimeout(timerUpgrades);
    };

  }, [userLocations]);

  const handleLeaderboardClick = () => {
    setIsLeaderboardOpen(true);
  };

  const handleCloseLeaderboard = () => {
    setIsLeaderboardOpen(false);
  };

  const handleBack = () =>{
    if (closeAnimTimer.current){ return; }
    setSlideUpgrades(false);
    closeAnimTimer.current = setTimeout(()=>{
      onClose();
    }, 200);
  }

  return (
    <div className={`fixed inset-0 flex bg-dark bg-opacity-75 justify-center items-center z-50 transition-all duration-300
      ${slideUpgrades? `opacity-100` : `opacity-0`}`}>
      <div
        className={`relative w-full xl:w-5/6 h-4/5 rounded-3xl p-3 mt-[10rem] z-[100] transition-all duration-300 
          ${slideUpgrades? `translate-y-0` : `translate-y-60`}`}
      >
        {/* upgrade panel decoration */}
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

        {/* upgrade panel content */}
        <div
          className="grid w-full h-full rounded-2xl"
          style={{
            backgroundImage:
              'url("/assets/images/clicker-character/mascotBg.webp")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="flex flex-col overflow-y-auto 2xl:overflow-visible">
            {/* Leaderboard Button */}
            <button
              className="absolute top-[4rem] right-[4rem] hidden 2xl:flex items-center bg-[#49DEFF] rounded-full shadow-md text-white text-xl font-outfit font-bold tracking-wider p-[1.5rem] py-[1rem]"
              onClick={handleLeaderboardClick}
            >
              <img
                src="/assets/images/clicker-character/trophy.webp"
                alt="trophy"
                className="w-8 h-auto mr-[1rem]"
              />
              LeaderBoard
            </button>

            <div className="flex items-center justify-center">
              <img
                src={"/assets/images/clicker-character/explore-animara.webp"}
                alt="explore-animara"
                className="w-[50%] mt-[-4rem]"
              />
            </div>
            <div>
              <p className="text-[#FFC85A] text-xl text-center font-normal uppercase">
                upgrade & earn as you explore!
              </p>
            </div>

            {/* Show loader if loading is true, otherwise display the content */}
            {userLocationLoading ? (
              <div className="h-full flex flex-row">
                <div className="w-[10%] items-start justify-start mt-[4rem]">
                  <p className="ml-[4rem] cursor-pointer" onClick={handleBack}>
                    &lt;&nbsp; Back
                  </p>
                </div>
                <div className="w-[80%] flex justify-center items-center my-auto">
                  <PropagateLoader color={"#FFB23F"} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col 2xl:flex-row justify-start mt-[4rem] xl:gap-[6rem] overflow-auto">
                {/* Menu bar */}
                <div className="w-full 2xl:w-[13dvw] h-full flex flex-col xl:overflow-hidden">
                  <p className="ml-[4rem] cursor-pointer" onClick={handleBack}>
                    &lt;&nbsp; Back
                  </p>
                  <div className="flex flex-row 2xl:flex-col mt-[2.5rem] p-[2rem] xl:p-2 overflow-auto xl:overflow-hidden mb-[1rem] xl:mb-0">
                  {menuOptions.map((option, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedOption(option.name)}
                      className={`min-w-[150px] w-auto flex justify-center items-center gap-1.5 p-5 mt-0 2xl:mt-[1rem] ml-[1rem] 2xl:ml-0 rounded-[10px] border-8 border-white ${
                        selectedOption === option.name ? 'bg-[#FFB100] transform rotate-6' : 'bg-[#146CFC]'
                      } hover:pl-[24px] hover:pr-[20px] hover:rotate-6 hover:scale-105 transition-transform duration-300 ease-in-out`}
                    >
                      <img
                        src={option.icon}
                        alt={`${option.name} icon`}
                        className="w-6 h-6 mr-4"
                      />
                      <span className="text-white text-xl capitalize leading-[18px]">
                        {option.name}
                      </span>
                    </div>
                  ))}
                  </div>
                </div>

                <div className="w-full flex flex-col mr-0 2xl:mr-[2rem]">
                  <div className="w-full flex flex-row justify-center 2xl:justify-between items-center ">
                    <div className="hidden 2xl:flex flex-row">
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

                    <div className="flex flex-col 2xl:flex-row items-center gap-[1rem]">
                      {/* Daily Combo Section */}
                      <div className="flex flex-col 2xl:flex-row items-center bg-[#ffa900] rounded-3xl px-[2rem] py-[1rem] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                        <div className="flex flex-col">
                          <div className="text-white text-2xl font-LuckiestGuy font-normal tracking-wider ">
                            DAILY COMBO
                          </div>
                          <div className="flex flex-row items-center text-white text-lg ">
                            <img src="/assets/images/clicker-character/gem.webp" alt="currency icon" className="w-6 h-6" />
                            <span className="mx-2">{totalProfit}</span>
                            <img 
                              src={`/assets/images/clicker-character/${dailyComboMatched.every(item => item !== "") ? "checked" : "unchecked"}.webp`} 
                              alt={`${dailyComboMatched.every(item => item !== "") ? "checked" : "unchecked"} icon`} 
                              className="w-6 h-6 ml-2" 
                            />
                          </div>
                        </div>
                        <div className="flex ml-4">
                          <img src={`/assets/images/clicker-character/treasure-${dailyComboMatched[0] !== "" ? "unlocked" : "locked"}.webp`} alt="reward 1" title={dailyComboMatched.length > 0 ? t(dailyComboMatched[0]) : ""} className="w-full h-full" />
                          <img src={`/assets/images/clicker-character/treasure-${dailyComboMatched[1] !== "" ? "unlocked" : "locked"}.webp`} alt="reward 2" title={dailyComboMatched.length > 1 ? t(dailyComboMatched[1]) : ""} className="w-full h-full ml-2" />
                          <img src={`/assets/images/clicker-character/treasure-${dailyComboMatched[2] !== "" ? "unlocked" : "locked"}.webp`} alt="reward 2" title={dailyComboMatched.length > 2 ? t(dailyComboMatched[2]) : ""} className="w-full h-full ml-2" />
                        </div>
                      </div>

                      {/* Explora Point Section */}
                      <div className="flex flex-row items-center bg-[#11365F] rounded-3xl px-[2rem] py-[1.3rem] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                        <img src="/assets/icons/explora-point.webp" alt="profit icon" className="w-10 h-10 mr-2" />
                        <div className="flex flex-col mr-[5rem]">
                          <div className="text-[#00E0FF] text-2xl font-LuckiestGuy font-normal tracking-wider">
                            {currentUser.profitPerHour}
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
                      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-4 p-4 overflow-y-auto">
                        {userLocations.map((location, index) => {
                          if (location.region === selectedOption) {
                            return (
                              <div
                                key={index}
                                className={`rounded-[36px] text-white flex flex-col items-center transition-all duration-200 hover:scale-105 ${
                                  location.level === -1 ? "" : "cursor-pointer"
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
                                  <div className="w-full flex flex-row items-center justify-between">
                                    <p className="text-white text-sm font-sans">
                                      Explora Points
                                    </p>
                                    <div className="flex flex-row">
                                      <img
                                        src={
                                          "/assets/icons/explora-point.webp"
                                        }
                                        alt="icon2"
                                        className="w-6 h-6 mr-1"
                                      />
                                      <p className="text-[#00E0FF]">
                                        +
                                        {location.level === 0 &&
                                        location.level !== -1
                                          ? location.nextLevelExploraPts
                                          : location.currentExploraPts}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="w-full border-t-2 border-blue-400 my-[0.5rem]"></div>
                                  <div className="w-full flex flex-row justify-between">
                                    <p>
                                      {location.level === 0 &&
                                      location.level !== -1
                                        ? "Explore"
                                        : "Upgrade with"}
                                    </p>
                                    {location.level !== -1 && (
                                      <div className="flex flex-row ml-[2rem]">
                                        <img
                                          src={
                                            "/assets/images/clicker-character/icon-2.webp"
                                          }
                                          alt="icon2"
                                          className="w-6 h-6 mr-2"
                                        />
                                        <p className="text-[#ffa900]">
                                          {location.nextLevelUpgradeCost === 0
                                            ? "Max"
                                            : location.nextLevelUpgradeCost}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {location.level === -1 && (
                                  <>
                                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-[rgba(0,0,0,0.8)] flex justify-center items-center opacity-70 rounded-[36px] backdrop-blur-lg" ></div>
                                    <img
                                        src="/assets/images/clicker-character/lock-chain-only.webp"
                                        style={{
                                          backgroundSize: "cover",
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
                          }
                          return null;
                        })}
                      </div>
                    ) : (
                      <div className="flex justify-center items-end xl:items-center h-full">
                        <p className="text-white text-center text-2xl mt-[4rem] 2xl:mt-0">
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

        {/* Render the LeaderBoard pop-up if isLeaderboardOpen is true */}
        {isLeaderboardOpen && (
          <LeaderBoardModal onClose={handleCloseLeaderboard} />
        )}

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

  );
};

ClickerUpgrades.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ClickerUpgrades;
