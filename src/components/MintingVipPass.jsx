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
                            src="/assets/icons/gift.png"
                            alt="gift icon"
                            className="w-6 h-6 ml-[1rem] transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-sm font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="mr-[1rem]"> 
                            <img
                            src="/assets/icons/gem.png"
                            alt="gem icon"
                            className="w-6 h-6 ml-[1rem] transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-sm font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="mr-[1rem]"> 
                            <img
                            src="/assets/icons/coin.png"
                            alt="coin icon"
                            className="w-6 h-6 ml-[1rem] transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col">
                            <h3 className="text-white text-xl font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-sm font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>

                    <div className="flex flex-row items-center">
                        <div className="mr-[1rem]"> 
                            <img
                            src="/assets/icons/star.png"
                            alt="star icon"
                            className="w-6 h-6 ml-[1rem] transition-transform duration-200 hover:scale-110 "
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
                <div className="flex flex-col space-y-4">
                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/gift.png"
                            alt="gift icon"
                            className="w-6 h-6 mb-2 transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col text-center">
                            <h3 className="text-white text-lg font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-xs font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/gem.png"
                            alt="gem icon"
                            className="w-6 h-6 mb-2 transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col text-center">
                            <h3 className="text-white text-lg font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-xs font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/coin.png"
                            alt="coin icon"
                            className="w-6 h-6 mb-2 transition-transform duration-200 hover:scale-110 "
                            />
                        </div>

                        <div className="flex flex-col text-center">
                            <h3 className="text-white text-lg font-normal leading-normal">Referral Bonus</h3>
                            <p className="text-[#c4c4c4] text-xs font-normal font-outfit leading-[14px]">Earn rewards through the referral program.</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className=""> 
                            <img
                            src="/assets/icons/star.png"
                            alt="star icon"
                            className="w-6 h-6 mb-2 transition-transform duration-200 hover:scale-110 "
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