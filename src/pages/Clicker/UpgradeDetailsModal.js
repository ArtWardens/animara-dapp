import React from "react";
import PropTypes from "prop-types";

const UpgradeDetailsModal = ({ upgrade, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-transparent backdrop-blur-xl flex justify-center items-center z-[200]"
      onClick={onClose}
    >
      <div
        className="relative px-[4rem] py-[8rem] rounded-lg w-[90%] max-w-[800px] bg-no-repeat bg-contain"
        style={{
          backgroundImage: `url("../assets/images/clicker-character/upgrades-details-bg.png")`,
          backgroundPosition: "center",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Close Button */}
        <button className="absolute top-20 right-20 text-white text-4xl" onClick={() => {
            console.log("clicked");
            onClose();
        }}>
          &times;
        </button>

        {/* Modal Content */}
        <div className="flex flex-col items-center text-center space-y-4">
          <p className="text-2xl text-yellow-300 mt-2 font-semibold">
            <span className="inline-flex items-center">
              <img
                src={upgrade.logo}
                alt={upgrade.name}
                className="w-6 h-6 mr-2"
              />
            </span>
          </p>

          <h2 className="text-4xl text-white font-LuckiestGuy uppercase tracking-wider">
            {upgrade.name}
          </h2>

          <div className="flex flex-row items-center justify-between">
            <p className="text-sm font-sans mr-[1rem]">with</p>
            <img
              src={"../assets/images/clicker-character/gem.png"}
              alt="gem"
              className="w-6 h-6 mr-2"
            />
            <p>{upgrade.cost}</p>
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
                {upgrade.points}
              </p>
            </div>
          </div>

          <button className="bg-[#ffdc61] text-white mt-8 px-8 py-2 rounded-full text-lg uppercase">
            Go Ahead
          </button>
        </div>
      </div>
    </div>
  );
};

UpgradeDetailsModal.propTypes = {
  upgrade: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UpgradeDetailsModal;
