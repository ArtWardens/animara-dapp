import React from 'react';

const MintingWarningNotice = ({ onClose }) => {
    return(
        <div className="w-full h-full fixed inset-0 flex items-center justify-center backdrop-blur-xl over">
            {/* Desktop view */}
            <div className="min-h-[500px] hidden lg:flex flex-col items-center justify-center p-[6rem]"
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
            <div className="max-w-[400px] flex lg:hidden flex-col items-center justify-center p-[4rem] xs:p-[5.5rem]"
                style={{
                    backgroundImage: `url("/assets/images/clicker-character/upgrades-details-mobile-bg.png")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <div className="font-outfit font-normal text-white text-base text-center">
                    <p>Important Notice</p>
                </div>

                <div className="font-normal text-white text-xl xl:text-2xl text-center uppercase my-[1rem]">
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
        </div>
    );
  };
  
  export default MintingWarningNotice;