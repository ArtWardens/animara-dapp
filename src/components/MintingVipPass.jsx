import React from 'react';

const MintingVipPass = ({ onClose }) => {
    return(
        <div className="w-full h-full fixed inset-0 flex items-center justify-center backdrop-blur-xl z-[50]">
            {/* Desktop view */}
            <div className="min-h-[600px] hidden lg:flex flex-col items-center justify-center p-[6rem]"
                style={{
                    backgroundImage: `url("/assets/images/clicker-character/upgrades-details-bg.webp")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    maxWidth: "900px", 
                    maxHeight: "600px", 
                }}
            >
                <div className="font-normal text-2xl text-center leading-normal tracking-wider uppercase mb-[2rem]">
                    <p> VIP value pass</p>
                </div>

                {/* Content */}
                <div className="flex flex-col space-y-[1.5rem]">
                    <div className="flex flex-row items-center">
                        <div className="mr-[1rem]"> 
                            <img
                            src="/assets/icons/ticket.webp"
                            alt="gift icon"
                            className="w-12 h-auto ml-[1rem] transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-normal leading-normal">Game Character </h3>
                            <p className="text-[#c4c4c4] text-sm font-normal font-outfit leading-[14px]">Use your NFT as a unique in-game character.</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="mr-[1rem]"> 
                            <img
                            src="/assets/icons/coin.webp"
                            alt="gem icon"
                            className="w-12 h-auto ml-[1rem] transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-normal leading-normal">Token Presales</h3>
                            <p className="text-[#c4c4c4] text-sm font-normal font-outfit leading-[14px]">Gain priority access to token presales and receive 75,000 AniTokens.</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="mr-[1rem]"> 
                            <img
                            src="/assets/icons/booster.webp"
                            alt="coin icon"
                            className="w-12 h-auto ml-[1rem] transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-normal leading-normal">Booster</h3>
                            <p className="text-[#c4c4c4] text-sm font-normal font-outfit leading-[14px]">Accelerate your progress in our Tap to Earn system with exclusive boosters.</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="mr-[1rem]"> 
                            <img
                            src="/assets/icons/referral.webp"
                            alt="star icon"
                            className="w-12 h-auto ml-[1rem] transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-sm font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>
                </div>

                <button
                    className="bg-[#ffdc61] text-white mt-2 xl:mt-8 px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]"
                    onClick={onClose}
                >
                    okay
                </button>
            </div>

            {/* Mobile view */}
            <div className="min-w-[400px] min-h-[600px] flex lg:hidden flex-col items-center justify-center mt-[8rem] axs:mt-0 p-[4rem]"
                style={{
                    backgroundImage: `url("/assets/images/clicker-character/upgrades-details-mobile-bg.png")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    maxWidth: "900px", 
                    maxHeight: "600px", 
                }}
            >
                <div className="font-normal text-xl text-center leading-normal tracking-wider uppercase mb-2">
                    <p> VIP value pass</p>
                </div>

                {/* Content */}
                <div className="w-[60%] flex flex-col space-y-4">
                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/ticket.webp"
                            alt="gift icon"
                            className="w-8 h-auto mb-2 transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col text-center">
                            <h3 className="text-white text-lg font-normal leading-normal">Game Character </h3>
                            <p className="text-[#c4c4c4] text-xs font-normal font-outfit leading-[14px]">Use your NFT as a unique in-game character.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/coin.webp"
                            alt="gem icon"
                            className="w-8 h-auto mb-2 transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col text-center">
                            <h3 className="text-white text-lg font-normal leading-normal">Token Presales</h3>
                            <p className="text-[#c4c4c4] text-xs font-normal font-outfit leading-[14px]">Gain priority access to token presales and <br/> receive 75,000 AniTokens.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/booster.webp"
                            alt="coin icon"
                            className="w-8 h-auto mb-2 transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col text-center">
                            <h3 className="text-white text-lg font-normal leading-normal">Booster</h3>
                            <p className="text-[#c4c4c4] text-xs font-normal font-outfit leading-[14px]">Accelerate your progress in our Tap to Earn <br/> system with exclusive boosters.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/referral.webp"
                            alt="star icon"
                            className="w-8 h-auto mb-2 transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col text-center">
                            <h3 className="text-white text-lg font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-xs font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>
                </div>

                <button
                    className="bg-[#ffdc61] text-white mt-6 xl:mt-8 px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]"
                    onClick={onClose}
                >
                    okay
                </button>
            </div>
        </div>
    );
  };
  
  export default MintingVipPass;