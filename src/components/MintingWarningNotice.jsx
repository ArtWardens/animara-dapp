import React from 'react';

const MintingWarningNotice = ({ onClose }) => {
    return(
        <div className="w-full h-full fixed inset-0 flex items-center justify-center backdrop-blur-xl z-[50]">
            {/* Desktop view */}
            <div className="min-h-[500px] min-w-[500px] hidden lg:flex flex-col items-center justify-center p-[6rem]"
                style={{
                    backgroundImage: `url("/assets/images/clicker-character/upgrades-details-bg.webp")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    maxWidth: "800px", 
                    maxHeight: "600px", 
                }}
            >
                <div className="font-outfit font-normal text-white text-base text-center">
                    <p>Important Notice</p>
                </div>

                <div className="font-normal text-white text-2xl text-center uppercase my-2 xl:my-[2rem]">
                    <h1>NFT Transfers and Violation Policy</h1>
                </div>

                <div className="font-outfit font-normal text-[#c4c4c4] text-sm text-center">
                    <p>Each NFT in this presale includes exclusive <span className="text-[#ffa900] font-bold">Anitoken airdrop rewards</span>.
                    To ensure fairness, <span className="text-white font-bold">any attempt to manipulate scores through NFT transfers will be flagged as a violation</span>. Such actions will be automatically detected and marked as "witch behavior," resulting in account restrictions.</p>
                </div>

                <button
                    className="bg-[#ffdc61] text-white mt-8 px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]"
                    onClick={onClose}
                >
                    okay
                </button>
            </div>

            {/* Mobile view */}
            <div className="min-w-[400px] min-h-[600px] flex lg:hidden flex-col mt-[8rem] p-[4rem] md:p-[8rem]"
                style={{
                    backgroundImage: `url("/assets/images/clicker-character/upgrades-details-mobile-bg.webp")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "100%",
                    maxWidth: "600px", 
                    maxHeight: "1200px", 
                }}
            >
                <div className="flex flex-col items-center justify-center my-auto">
                    <div className="font-outfit font-normal text-white text-base text-center">
                        <p>Important Notice</p>
                    </div>

                    <div className="font-normal text-white text-xl xl:text-2xl text-center uppercase my-[1rem]">
                        <h1>NFT Transfers and Violation Policy</h1>
                    </div>

                    <div className="font-outfit font-normal text-[#c4c4c4] text-sm text-center">
                        <p>Each NFT in this presale includes exclusive <br/><span className="text-[#ffa900] font-bold">Anitoken airdrop rewards</span>.<br/>
                        To ensure fairness, <span className="text-white font-bold">any attempt to manipulate <br/> scores through NFT transfers will be flagged <br/> as a violation</span>. Such actions will be automatically <br/> detected and marked as "witch <br/> behavior," resulting in account restrictions.</p>
                    </div>

                    <button
                        className="bg-[#ffdc61] text-white mt-8 px-8 py-2 rounded-full text-lg uppercase flex items-center justify-center hover:shadow-[0px_4px_4px_0px_#FFFBEF_inset]"
                        onClick={onClose}
                    >
                        okay
                    </button>
                </div>
            </div>
        </div>
    );
  };
  
  export default MintingWarningNotice;