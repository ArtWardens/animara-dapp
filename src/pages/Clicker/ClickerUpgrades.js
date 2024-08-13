import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useUserLocation } from "../../sagaStore/slices";
import UpgradeDetailsModal from "./UpgradeDetailsModal";

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
  const [loading, setLoading] = useState(true); // Add loading state

  const { data } = useUserLocation(); // Access the data from useUserLocation
  const userLocations = data?.userLocations || []; // Safely access userLocations array

  useEffect(() => {
    if (data) {
      setLoading(false); // Set loading to false once data is available
    }
  }, [data]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="text-center">
          <svg
            aria-hidden="true"
            className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-auto"
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
          <span className="text-white text-xl">Loading...</span>
        </div>
      </div>
    );
  }

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
                            <div className="w-full flex flex-col items-start px-[3rem] py-[2rem]">
                              <p>{t(location.locationId)}</p>
                              <div className="w-full flex flex-row justify-between">
                                <p className="text-white text-sm font-sans">
                                  Explora Points
                                </p>
                                <div className="flex flex-row">
                                  <img
                                    src={
                                      "../assets/images/clicker-character/icon-2.png"
                                    }
                                    alt="icon2"
                                    className="w-6 h-6 mr-1"
                                  />
                                  <p className="text-[#80e8ff]">
                                    +{location.currentExploraPts}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full flex flex-row">
                                <p>
                                  LV.{" "}
                                  {location.level === -1 ? "-" : location.level + 1}
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
                                      {location.nextLevelUpgradeCost}
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
        </div>
      </div>

      {/* Render UpgradeDetailsModal if an upgrade is selected */}
      {selectedUpgrade && (
        <UpgradeDetailsModal
          upgrade={selectedUpgrade}
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
