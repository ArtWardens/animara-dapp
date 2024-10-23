import React, { useState} from "react";
import PropTypes from "prop-types";
import { useUserDetails } from "../../sagaStore/slices/userSlice.js";
import { useEffect } from "react";

const LevelUpModal = ({ onClose, coinReward }) => {
  const [showModal, setShowModal] = useState(false);
  const currentUser = useUserDetails();

  useEffect(() => {
    const timerModal = setTimeout(() => {
      setShowModal(true);
    }, 250);

    return () => {
      clearTimeout(timerModal);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center z-[200]">
      {/* Desktop level up message */}
      <div
        className={`hidden xl:flex flex-col px-[4rem] py-[8rem] rounded-xl w-full max-w-[800px] transition-all duration-300 opacity-100 scale-100 ${showModal ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}
        style={{
          backgroundImage: `url("/assets/images/clicker-character/successfull-bg.webp")`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

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

      {/* Mobile level up message */}
      <div
        className={`min-h-[600px] flex xl:hidden flex-col items-center justify-center px-[6rem] py-[8rem] rounded-xl transition-all duration-300 ${showModal ? `opacity-100 scale-100` : `opacity-0 scale-0`}`}
        style={{
          backgroundImage: `url("/assets/images/clicker-character/successfull-mobile-bg.png")`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >

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
              <div className="flex items-center justify-center">
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
