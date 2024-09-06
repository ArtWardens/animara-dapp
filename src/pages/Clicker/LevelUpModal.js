import React from "react";
import PropTypes from "prop-types";
import { useUserDetails } from "../../sagaStore/slices/userSlice.js";

const LevelUpModal = ({ onClose, coinReward }) => {
  const currentUser = useUserDetails();

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[200]">
      <div
        className={`flex flex-col px-[4rem] py-[8rem] rounded-xl w-[45%] transition-all duration-1000 opacity-100 scale-100`}
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
          onClick={onClose}
        >
          &times;
        </button>

        <div className="text-center tracking-wider">
          <p
            className="text-4xl text-yellow-400 font-normal tracking-wider"
            style={{
              WebkitTextStrokeWidth: "1.5px",
              WebkitTextStrokeColor: "var(--COlor-11, #FFF)",
              textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
            }}
          >
            LEVEL UP!
          </p>
          {currentUser?.level < currentUser?.maxLevel ? (
            <>
              <div className="mt-[2rem]">
                <p className="text-[2rem] text-white font-bold tracking-wider mb-[1rem]">
                  LV{currentUser.level - 1} -&gt; LV{currentUser.level}
                </p>
                <p className="text-[1.25rem] text-white font-bold tracking-wider">
                  YOU GAINED
                </p>
              </div>
              <div className="gap-2 flex items-center justify-center">
                <img
                  className="w-[2.5rem] h-[2.5rem] object-contain my-auto"
                  src={"/assets/images/clicker-character/gem.webp"}
                  alt="gem"
                />
                <p
                  className="text-[2.25rem] text-[#FFAA00] tracking-normal overflow-hidden text-left ml-3"
                  style={{
                    WebkitTextStrokeWidth: "1.75px",
                    WebkitTextStrokeColor: "var(--Color-11, #FFF)",
                  }}
                >
                  {coinReward}
                </p>
              </div>
            </>
          ) : (
            <div className="mt-[2rem]">
              <p className="text-[2rem] text-white font-bold tracking-wider mb-[1rem]">
                Your LEVEL IS MAXED OUT!
              </p>
            </div>
          ) }
          
        </div>

        <div className="w-full flex items-center justify-center">
          <button
            className="bg-[#ffdc61] text-white mt-[1rem] px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]"
            onClick={onClose}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

LevelUpModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  coinReward: PropTypes.number.isRequired,
};

export default LevelUpModal;
