import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import {
  upgradeUserLocation,
  useUpgradeUserLocationError,
  useUserLocationLoading,
} from "../../sagaStore/slices/userSlice.js";
import { PropagateLoader } from "react-spinners";

const UpgradeDetailsModal = ({ upgrade, isMaxLevel, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const upgradeUserLocationError = useUpgradeUserLocationError();
  const isUserLocationLoading = useUserLocationLoading();
  const [isExploredSuccessfully, setIsExploredSuccessfully] = useState(false);
  const [hasStartedUpgrade, setHasStartedUpgrade] = useState(false);
  const [showMaxLevelMessage, setShowMaxLevelMessage] = useState(false);

  const logoList = [
    {
      region: "mountain",
      logo: "../assets/images/clicker-character/icon-1.png",
    },
    { region: "forest", logo: "../assets/images/clicker-character/icon-2.png" },
    {
      region: "deserts",
      logo: "../assets/images/clicker-character/desert-icon.png",
    },
    {
      region: "cave",
      logo: "../assets/images/clicker-character/cave-icon.png",
    },
    {
      region: "iceland",
      logo: "../assets/images/clicker-character/iceland-icon.png",
    },
    {
      region: "valley",
      logo: "../assets/images/clicker-character/valley-icon.png",
    },
  ];

  const logo =
    logoList.find((item) => item.region === upgrade.region)?.logo ||
    "../assets/images/clicker-character/default-icon.png";

  useEffect(() => {
    if (hasStartedUpgrade && !isUserLocationLoading) {
      if (upgrade.level === upgrade.maxLevel) {
        setShowMaxLevelMessage(true);
        setIsExploredSuccessfully(false);
      } else {
        setIsExploredSuccessfully(true);
        setShowMaxLevelMessage(false);
      }
    }
  }, [isUserLocationLoading, hasStartedUpgrade]);

  const handleUpgrade = () => {
    setIsExploredSuccessfully(false);
    setHasStartedUpgrade(true);
    setShowMaxLevelMessage(false);
    dispatch(upgradeUserLocation(upgrade.locationId));
  };

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-xl rounded-xl flex justify-center items-center z-[200]">
      {isUserLocationLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-transparent rounded-full w-full z-[210]">
          <div className="flex justify-center items-center">
            <div className="flex justify-center items-center h-56">
              <PropagateLoader color={"#FFB23F"} />
            </div>
          </div>
        </div>
      )}

      {!isUserLocationLoading &&
      (showMaxLevelMessage || isExploredSuccessfully) ? (
        <div
          className="absolute inset-0 flex justify-center items-center bg-transparent rounded-xl w-full z-[210]"
          onClick={onClose}
        >
          <div className="text-center tracking-wider">
            {upgradeUserLocationError === "location-max-level" ? (
              <p className="text-4xl text-red-500 font-bold">
                Failed to upgrade location. Max level reached
              </p>
            ) : upgradeUserLocationError === "insufficient-funds" ? (
              <p className="text-4xl text-red-500 font-bold">
                Failed to upgrade location level. Insufficient coins.
              </p>
            ) : (
              <p className="text-4xl text-yellow-400 font-bold">
                Location explored successfully!
              </p>
            )}
          </div>
        </div>
      ) : (
        !isUserLocationLoading && (
          <div
            className="relative px-[4rem] py-[8rem] rounded-xl w-[90%] max-w-[800px] bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url("../assets/images/clicker-character/upgrades-details-bg.png")`,
              backgroundPosition: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-20 right-20 text-white text-4xl"
              onClick={onClose}
              disabled={isUserLocationLoading}
            >
              &times;
            </button>

            {/* Modal Content */}
            <div className="flex flex-col items-center text-center space-y-4">
              <p className="text-2xl text-yellow-300 mt-2 font-semibold">
                <span className="inline-flex items-center">
                  <img src={logo} alt="region logo" className="w-6 h-6 mr-2" />
                </span>
              </p>

              <h2 className="text-4xl text-white font-LuckiestGuy uppercase tracking-wider">
                {t(upgrade.locationId)}
              </h2>

              <div className="flex flex-row items-center justify-between">
                <p className="text-sm font-sans mr-[1rem]">with</p>
                <img
                  src={"../assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="w-6 h-6 mr-2"
                />
                <p>{upgrade.nextLevelUpgradeCost}</p>
              </div>

              <p className="text-white text-base font-sans">
                {upgrade.description}
              </p>

              <div className="bg-[#001424] rounded-full flex justify-around items-center w-auto mt-4 px-[4rem] py-[1rem]">
                <div className="text-white flex flex-row items-center">
                  <p className="text-sm font-sans font-medium mr-[1rem]">
                    Explora Points
                  </p>
                  <img
                    src={"../assets/images/clicker-character/icon-2.png"}
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
                        src={"../assets/images/clicker-character/icon-2.png"}
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
                  <button
                    className="bg-[#ffdc61] text-white mt-8 px-8 py-2 rounded-full text-lg uppercase"
                    onClick={handleUpgrade}
                    disabled={isUserLocationLoading}
                  >
                    {isUserLocationLoading ? "Loading..." : "Go Ahead"}
                  </button>
                </>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

UpgradeDetailsModal.propTypes = {
  upgrade: PropTypes.object.isRequired,
  isMaxLevel: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpgradeDetailsModal;
