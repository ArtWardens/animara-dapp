import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import { useUserLocation, useUserLocationLoading, getUserLocations } from "../../sagaStore/slices";
import UpgradeDetailsModal from "./UpgradeDetailsModal";
import { PropagateLoader } from "react-spinners";
import LeaderBoardModal from "../../components/LeaderBoardModal";

const ClickerUpgrades = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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

  const handleLeaderboardClick = () => {
    setIsLeaderboardOpen(true);
  };

  const handleCloseLeaderboard = () => {
    setIsLeaderboardOpen(false);
  };

  return (
    <div
      className={`relative w-5/6 h-4/5 rounded-3xl p-3 mt-[10rem] transition-all duration-1000 z-[100] ${slideUpgrades? `translate-y-0 opacity-100` : `translate-y-60 opacity-0`}`}
      style={{
        border: "2px solid var(--Color, #F4FBFF)",
        background: "rgba(155, 231, 255, 0.58)",
        boxShadow:
          "0px 8px 30px 0px rgba(4, 161, 183, 0.40) inset, 0px 8px 30px 0px rgba(32, 0, 99, 0.40)",
        backdropFilter: "blur(15px)",
        zIndex: 100,
      }}
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
        className="grid w-full h-full rounded-2xl"
        style={{
          backgroundImage:
            'url("/assets/images/clicker-character/mascotBg.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col">
          {/* Leaderboard Button */}
          <button
            className="absolute top-[4rem] right-[4rem] flex items-center bg-[#49DEFF] rounded-full shadow-md text-white text-xl font-outfit font-bold tracking-wider p-[1.5rem] py-[1rem]"
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
                <p className="ml-[4rem] cursor-pointer" onClick={onClose}>
                  &lt;&nbsp; Back
                </p>
              </div>
              <div className="w-[80%] flex justify-center items-center my-auto">
                <PropagateLoader color={"#FFB23F"} />
              </div>
            </div>
          ) : (
            <div className="flex flex-row justify-start mt-[4rem] gap-[6rem]">
              {/* Menu bar */}
              <div className="w-[12dvw] flex flex-col space-y-[2rem]">
                <p className="ml-[4rem] cursor-pointer" onClick={onClose}>
                  &lt;&nbsp; Back
                </p>
                {menuOptions.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedOption(option.name)}
                    className={`flex justify-center items-center gap-1.5 p-5 rounded-[10px] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset,0px_4px_4px_0px_rgba(136,136,136,0.48)] ${
                      selectedOption === option.name ? 'bg-[#FFB100] transform rotate-6' : 'bg-[#146CFC]'
                    } hover:pl-[24px] hover:pr-[20px] hover:border-1 hover:border-[#E59E69] hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset,0px_-4px_4px_0px_rgba(255,249,228,0.48),0px_5px_4px_0px_rgba(232,140,72,0.48)] hover:rotate-6 hover:scale-105 transition-transform duration-300 ease-in-out`}
                    
                  >
                    <img
                      src={option.icon}
                      alt={`${option.name} icon`}
                      className="w-6 h-6 mr-4"
                    />
                    <span className="text-white text-xl font-normal font-['Luckiest_Guy'] capitalize leading-[18px]">
                      {option.name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="w-full flex flex-col mr-[2rem]">
                <div className="w-full flex justify-between items-center">
                  <div className="text-[#FFFFFF] text-4xl text-center font-LuckiestGuy font-normal tracking-widest">
                    {selectedOption.charAt(0).toUpperCase() +
                      selectedOption.slice(1)}
                  </div>
                </div>

                {/* Display Upgrades */}
                {userLocations && userLocations.length > 0 ? (
                  userLocations.filter(
                    (location) => location.region === selectedOption
                  ).length > 0 ? (
                    <div className="grid grid-cols-4 gap-4 mt-4 p-4">
                      {userLocations.map((location, index) => {
                        if (location.region === selectedOption) {
                          return (
                            <div
                              key={index}
                              className={`rounded-lg text-white flex flex-col items-center transition-all duration-200 hover:scale-105 ${
                                location.level === -1 ? "" : "cursor-pointer"
                              }`}
                              style={{
                                position: "relative",
                                backgroundImage: `url("/assets/images/clicker-character/upgrades-bg.webp")`,
                                backgroundSize: "contain",
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
                                        "/assets/images/clicker-character/explora-point.webp"
                                      }
                                      alt="icon2"
                                      className="w-6 h-6 mr-1"
                                    />
                                    <p className="text-[#80e8ff]">
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
                                <div className="absolute inset-0 flex justify-center items-center">
                                  <img
                                    src={
                                      "/assets/images/clicker-character/lock-chain.webp"
                                    }
                                    alt="Locked"
                                    className="w-full"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full">
                      <p className="text-white text-center text-2xl">
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
  );
};

ClickerUpgrades.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ClickerUpgrades;
