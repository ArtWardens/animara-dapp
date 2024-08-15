import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useUserLocation } from "../../sagaStore/slices";
import UpgradeDetailsModal from "./UpgradeDetailsModal";
import { PropagateLoader } from "react-spinners"; // Import the loader

const ClickerUpgrades = ({ onClose }) => {
  const { t } = useTranslation();
  const menuOptions = [
    { name: "mountain", label: "Mountain" },
    { name: "forest", label: "Forest" },
    { name: "deserts", label: "Deserts" },
    { name: "cave", label: "Cave" },
    { name: "iceland", label: "Iceland" },
    { name: "valley", label: "Valley" },
  ];

  const [selectedOption, setSelectedOption] = useState("forest");
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data } = useUserLocation();
  const userLocations = data?.userLocations || [];
  console.log(userLocations);

  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, [data]);

  return (
    <div
      className="relative w-5/6 h-4/5 rounded-3xl p-3 mt-[10rem] transition-opacity duration-500 z-[100]"
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
          src={"../assets/images/clicker-character/ring01.png"}
          alt="ring"
          className="object-cover w-12 absolute left-2"
        />
        <img
          src={"../assets/images/clicker-character/ring02.png"}
          alt="ring"
          className="object-cover w-12 absolute right-8"
        />
      </div>

      <div
        className="grid w-full h-full rounded-2xl"
        style={{
          backgroundImage:
            'url("../assets/images/clicker-character/mascotBg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-col">
          <div className="flex items-center justify-center">
            <img
              src={"../assets/images/clicker-character/explore-animara.png"}
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
          {loading ? (
            <div className="flex justify-center items-center my-auto">
              <PropagateLoader color={"#FFB23F"} />
            </div>
          ) : (
            <div className="flex flex-row justify-start mt-[4rem] gap-[6rem]">
              {/* Menu bar */}
              <div className="flex flex-col space-y-[2rem]">
                <p className="ml-[4rem] cursor-pointer" onClick={onClose}>
                  &lt;&nbsp; Back
                </p>
                {menuOptions.map((option, index) => (
                  <div
                    key={index}
                    className="flex justify-center items-center text-lg font-bold py-2 px-4 rounded-lg cursor-pointer"
                    style={{
                      background:
                        option.name === selectedOption ? "#FFB100" : "#146CFC",
                      borderRadius: "12px",
                      padding: "15px 30px",
                      color: "#FFF",
                      boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      border: "6px solid #FFFFFF",
                      transform: `rotate(${index % 2 === 0 ? "-3deg" : "3deg"})`,
                    }}
                    onClick={() => setSelectedOption(option.name)}
                  >
                    {option.name}
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
                {userLocations.length > 0 ? (
                  userLocations.filter(
                    (location) => location.region === selectedOption
                  ).length > 0 ? (
                    <div className="grid grid-cols-4 gap-4 mt-4 p-4">
                      {userLocations.map((location, index) => {
                        if (location.region === selectedOption) {
                          return (
                            <div
                              key={index}
                              className={`rounded-lg text-white flex flex-col items-center ${
                                location.level === -1 ? "" : "cursor-pointer"
                              }`}
                              style={{
                                position: "relative",
                                backgroundImage: `url("../assets/images/clicker-character/upgrades-bg.png")`,
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
                                        "../assets/images/clicker-character/explora-point.png"
                                      }
                                      alt="icon2"
                                      className="w-6 h-6 mr-1"
                                    />
                                    <p className="text-[#80e8ff]">
                                      +{location.level === 0 && location.level !== -1 
                                      ? location.nextLevelExploraPts 
                                      : location.currentExploraPts}
                                    </p>
                                  </div>
                                </div>
                                <div className="w-full border-t-2 border-blue-400 my-[0.5rem]"></div>
                                <div className="w-full flex flex-row justify-between">
                                  <p>
                                    {location.level === 0 && location.level !== -1
                                      ? "Unlock"
                                      : "Upgrade with" }
                                  </p>
                                  {location.level !== -1 && (
                                    <div className="flex flex-row ml-[2rem]">
                                      <img
                                        src={
                                          "../assets/images/clicker-character/icon-2.png"
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
                                      "../assets/images/clicker-character/lock-chain.png"
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
