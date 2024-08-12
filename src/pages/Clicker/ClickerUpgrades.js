import React, { useState } from "react";
import PropTypes from "prop-types";
import UpgradeDetailsModal from "./UpgradeDetailsModal"; // Import the new component

const ClickerUpgrades = ({ onClose }) => {
  const menuOptions = [
    { name: "Mountains", selected: false },
    { name: "Forest", selected: true },
    { name: "Deserts", selected: false },
    { name: "Cave", selected: false },
    { name: "Iceland", selected: false },
    { name: "Valley", selected: false },
  ];

  const [selectedOption, setSelectedOption] = useState("Forest");
  const [selectedUpgrade, setSelectedUpgrade] = useState(null); 

  const upgradesData = {
    Mountains: [
      {
        name: "Ionia",
        points: "+5,000",
        level: "LV.1",
        cost: "1000",
        unlocked: true,
        logo: "../assets/images/clicker-character/icon-1.png", 
        description: "Ionia is a mystical place known for its magical flora and fauna." 
      },
      {
        name: "Celestial Pagoda",
        points: "+5,000",
        level: "LV.1",
        cost: "1000",
        unlocked: false,
        logo: "../assets/images/clicker-character/celestial-pagoda-logo.png",
        description: "Legend has it that during certain celestial events, the view from this pagoda allows one to glimpse fragments of the future."
      },
    ],
    Forest: [
      {
        name: "Ionia",
        points: "+5,000",
        level: "LV.1",
        cost: "1000",
        unlocked: true,
        logo: "../assets/images/clicker-character/icon-1.png",
        description: "Ionia is a mystical place known for its magical flora and fauna."
      },
      {
        name: "Celestial Pagoda",
        points: "+5,000",
        level: "LV.1",
        cost: "1000",
        unlocked: false,
        logo: "../assets/images/clicker-character/celestial-pagoda-logo.png",
        description: "Legend has it that during certain celestial events, the view from this pagoda allows one to glimpse fragments of the future."
      },
    ],
    // Add more regions and upgrades as necessary
  };

  const selectedUpgrades = upgradesData[selectedOption];

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
                  {selectedOption} {/* Display the selected option here */}
                </div>
                <div className="flex flex-row items-center space-x-[1rem]">
                  {/* Daily Combo Section */}
                  <div className="min-w-[300px] min-h-[100px] bg-[#FFB100] rounded-xl flex items-center px-[2rem] py-[1rem] space-x-2">
                    <div className="flex flex-col ">
                      <p className="text-white text-2xl font-normal">
                        DAILY COMBO
                      </p>
                      <p className="text-white font-bold text-lg">
                        9,000,000,000
                      </p>
                    </div>
                    <div className="flex space-x-[1rem]">
                      <div className="bg-[#4B3F19] p-2 rounded-md">
                        <img
                          src={"../assets/images/clicker-character/icon-1.png"}
                          alt="icon1"
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="bg-[#4B3F19] p-2 rounded-md">
                        <img
                          src={"../assets/images/clicker-character/icon-1.png"}
                          alt="icon2"
                          className="w-6 h-6"
                        />
                      </div>
                      <div className="bg-[#4B3F19] p-2 rounded-md">
                        <img
                          src={"../assets/images/clicker-character/icon-1.png"}
                          alt="icon3"
                          className="w-6 h-6"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Profit Section */}
                  <div className="min-w-[300px] min-h-[100px] bg-[#002b4c] rounded-xl flex items-center px-[2rem] py-[1rem] ">
                    <div className="flex flex-row justify-between items-center space-x-2">
                      <img
                        src={"../assets/images/clicker-character/icon-2.png"}
                        alt="icon2"
                        className="w-12 h-12"
                      />
                      <div className="flex flex-col">
                        <p className="text-[#80e8ff] text-2xl font-normal">
                          +102,100,100K
                        </p>
                        <p className="text-[#D6F7FF] text-sm">
                          *Profit Paused After 3 Hours
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Upgrades */}
              <div className="grid grid-cols-4 gap-4 mt-4 p-4">
                {selectedUpgrades ? (
                  selectedUpgrades.map((upgrade, index) => (
                    <div
                      key={index}
                      className={`rounded-lg text-white flex flex-col items-center cursor-pointer`}
                      style={{
                        position: "relative",
                        backgroundImage: `url("../assets/images/clicker-character/upgrades-bg.png")`,
                        backgroundSize: "contain",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        opacity: upgrade.unlocked ? 1 : 0.5,
                      }}
                      onClick={() => setSelectedUpgrade(upgrade)} 
                    >
                      <div className="w-full flex flex-col items-start px-[3rem] py-[1.5rem] ">
                        <p>{upgrade.name}</p>
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
                            <p className="text-[#80e8ff]">{upgrade.points}</p>
                          </div>
                        </div>
                        <div className="w-full flex flex-row">
                          <p>{upgrade.level}</p>
                          <div className="flex flex-row ml-[2rem]">
                            <img
                              src={
                                "../assets/images/clicker-character/icon-2.png"
                              }
                              alt="icon2"
                              className="w-6 h-6 mr-2"
                            />
                            <p className="text-[#ffa900]">{upgrade.cost}</p>
                          </div>
                        </div>
                      </div>

                      {!upgrade.unlocked && (
                        <div className="absolute inset-0 flex justify-center items-center opacity-100">
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
                  ))
                ) : (
                  <p className="text-white text-center">No upgrades available</p>
                )}
              </div>
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
