import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import {
  upgradeUserLocation,
  useNewlyUnlockedLocations,
  useUpgradeUserLocationError,
  useUserDetails,
  useUserLocationLoading,
} from "../../sagaStore/slices/userSlice.js";
import { MoonLoader } from "react-spinners";
import LevelUpModal from "./LevelUpModal.js";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const UpgradeDetailsModal = ({ upgrade, isMaxLevel, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const upgradeUserLocationError = useUpgradeUserLocationError();
  const newlyUnlockedLocations = useNewlyUnlockedLocations();
  const isUserLocationLoading = useUserLocationLoading();
  const [isExploredSuccessfully, setIsExploredSuccessfully] = useState(false);
  const [hasStartedUpgrade, setHasStartedUpgrade] = useState(false);
  const [showMaxLevelMessage, setShowMaxLevelMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const currentUser = useUserDetails();
  const [userLevel, setUserLevel] = useState(currentUser?.level);
  const [showLevelUpMessage, setShowLevelUpMessage] = useState(false);
  const [coinReward, setCoinReward] = useState(null);

  const logoList = [
    {
      region: "mountain",
      logo: "/assets/images/clicker-character/mountain-icon.webp",
    },
    {
      region: "forest",
      logo: "/assets/images/clicker-character/forest-icon.webp",
    },
    {
      region: "deserts",
      logo: "/assets/images/clicker-character/deserts-icon.webp",
    },
    {
      region: "cave",
      logo: "/assets/images/clicker-character/cave-icon.webp",
    },
    {
      region: "iceland",
      logo: "/assets/images/clicker-character/iceland-icon.webp",
    },
    {
      region: "valley",
      logo: "/assets/images/clicker-character/valley-icon.webp",
    },
  ];

  const logo =
    logoList.find((item) => item.region === upgrade.region)?.logo ||
    "/assets/images/clicker-character/default-icon.webp";

  useEffect(() => {
    if (hasStartedUpgrade && !isUserLocationLoading) {
      if (isMaxLevel) {
        setShowMaxLevelMessage(true);
        setIsExploredSuccessfully(false);
      } else {
        setIsExploredSuccessfully(true);
        setShowMaxLevelMessage(false);
      }
    }

    const timerModal = setTimeout(() => {
      setShowModal(true);
    }, 250);

    return () => {
      clearTimeout(timerModal);
    };
  }, [isUserLocationLoading, hasStartedUpgrade, isMaxLevel]);

  const handleUpgrade = () => {
    setIsExploredSuccessfully(false);
    setHasStartedUpgrade(true);
    setShowMaxLevelMessage(false);
    dispatch(upgradeUserLocation(upgrade.locationId));
  };

  const handleLevelUp = () => {
    if (currentUser?.level !== userLevel) {
      setUserLevel(currentUser?.level);
      setShowLevelUpMessage(true);
      getLevelingSystemData();
    } 
    else {
      onClose();
    }
  };

  const getLevelingSystemData = async () => {
    // Show reward only if user leveled up and is not at max level
    if (currentUser?.level < currentUser?.maxLevel) {
      const levelingSystemDataCollection = "levelingSystemData";
      const levelingSystemDataDocId = "9MrEEGAWyyr4Y6mSD7U3";

      const levelingSystemDataRef = doc(db, levelingSystemDataCollection, levelingSystemDataDocId);
      const levelingSystemDataDoc = await getDoc(levelingSystemDataRef);

      if (!levelingSystemDataDoc.exists()) {
        console.log("No such document!");
        return;
      }
      const levelingSystemData = levelingSystemDataDoc.data();
      setCoinReward(levelingSystemData.levelMilestone[currentUser?.level].coinReward);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-transparent backdrop-blur-xl rounded-xl flex justify-center items-center z-[200] overflow-hidden">
        {!isUserLocationLoading &&
        (showMaxLevelMessage || isExploredSuccessfully) ? (
          <>
          <div className={`absolute w-full h-full rotate-image`}
            style={{
              backgroundImage: `url("/assets/images/clicker-character/light_element.webp")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}>
          </div>
          <div
            className={`flex flex-col px-[4rem] py-[8rem] rounded-xl w-[45%] transition-all duration-1000 ${showModal ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}
            style={{
              backgroundImage: `url("/assets/images/clicker-character/successfull-bg.webp")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            {/* Close Button */}
            <button
              className="w-full items-end justify-end text-white text-4xl text-right hover:brightness-75"
              onClick={() => {
                handleLevelUp();
              }}
            >
              &times;
            </button>

            <div className="text-center tracking-wider">
              {upgradeUserLocationError === "location-max-level" ? (
                <p className="text-4xl text-red-500 font-bold my-[5rem]">
                  Failed to upgrade location. Max level reached
                </p>
              ) : upgradeUserLocationError === "insufficient-funds" ? (
                <p className="text-4xl text-red-500 font-bold my-[5rem]">
                  Failed to upgrade location level. Insufficient coins.
                </p>
              ) : (
                <>
                  <p
                    className="text-4xl text-yellow-400 font-normal tracking-wider"
                    style={{
                      WebkitTextStrokeWidth: "1.5px",
                      WebkitTextStrokeColor: "var(--COlor-11, #FFF)",
                      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    Location explored successfully!
                  </p>
                  {newlyUnlockedLocations &&
                    newlyUnlockedLocations.length > 0 && (
                      <div className="mt-[2rem]">
                        <p className="text-3xl text-white font-bold tracking-wider mb-[1rem]">
                          New Locations Unlocked:
                        </p>
                        <ul className="list-none list-inside text-2xl text-[#c4c4c4]">
                          {newlyUnlockedLocations.map((locationId, index) => (
                            <li className="mb-[0.5rem]" key={index}>
                              {t(locationId)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </div>

            <div className="w-full flex items-center justify-center">
              <button
                className="bg-[#ffdc61] text-white mt-[1rem] px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]"
                onClick={() => {
                  handleLevelUp();
                }}
                disabled={isUserLocationLoading}
              >
                Continue
              </button>
            </div>
          </div>
          </>
        ) : (
          <div
            className={`relative px-[4rem] py-[8rem] rounded-xl w-[90%] max-w-[800px] bg-no-repeat bg-contain transition-all duration-1000 ${showModal ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}
            style={{
              backgroundImage: `url("/assets/images/clicker-character/upgrades-details-bg.webp")`,
              backgroundPosition: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-20 right-20 text-white text-4xl hover:brightness-75"
              onClick={onClose}
              disabled={isUserLocationLoading}
            >
              &times;
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center text-center space-y-4">
              <p className="text-2xl text-yellow-300 mt-2 font-semibold">
                <span className="inline-flex items-center">
                  <img
                    src={logo}
                    alt="region logo"
                    className="w-[3dvw] h-auto mr-2"
                  />
                </span>
              </p>

              <h2 className="text-4xl text-white font-LuckiestGuy uppercase tracking-wider">
                {t(upgrade.locationId)}
              </h2>

              <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-sans mr-[1rem]">with</p>
                <img
                  src={"/assets/images/clicker-character/gem.webp"}
                  alt="gem"
                  className="w-6 h-6 mr-2"
                />
                <p>{upgrade.nextLevelUpgradeCost}</p>
              </div>

              <p className="text-white text-base font-sans">
                {t(`${upgrade.locationId}-${upgrade.level + 1}`)}
              </p>

              <div className="bg-[#001424] rounded-full flex justify-around items-center w-auto mt-4 px-[4rem] py-[1rem]">
                <div className="text-white flex flex-row items-center">
                  <p className="text-sm font-sans font-medium mr-[1rem]">
                    Explora Points
                  </p>
                  <img
                    src={"/assets/icons/explora-point.webp"}
                    alt="icon2"
                    className="w-6 h-6 mr-1"
                  />
                  <p className="text-2xl text-[#80e8ff] font-bold">
                    {upgrade.currentExploraPts}
                  </p>

                  {!isMaxLevel && (
                    <>
                      <p className="text-white">&nbsp; → &nbsp;</p>
                      <img
                        src={
                          "/assets/icons/explora-point.webp"
                        }
                        alt="icon2"
                        className="w-6 h-6 mr-1"
                      />
                      <p className="text-2xl text-[#80e8ff] font-bold">
                        +{upgrade.nextLevelExploraPts || 0}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {!isMaxLevel && (
                <>
                  {isUserLocationLoading ? (
                    <MoonLoader color={"#FFB23F"} size={40} />
                  ) : (
                    <button
                      className="bg-[#ffdc61] text-white mt-8 px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]"
                      onClick={handleUpgrade}
                      disabled={isUserLocationLoading}
                    >
                      Go Ahead
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Render LevelUpModal when level up */}
      {showLevelUpMessage && (
        <LevelUpModal
          onClose={() => {
            setShowLevelUpMessage(false);
            onClose();
          }}
          coinReward={coinReward}
        />
      )}
    </>
  );
};

UpgradeDetailsModal.propTypes = {
  upgrade: PropTypes.object.isRequired,
  isMaxLevel: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpgradeDetailsModal;
