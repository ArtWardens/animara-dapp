import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa6";
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { MoonLoader } from "react-spinners";
import { useAppDispatch } from "../../hooks/storeHooks.js";
import {
  useBindWalletLoading,
  useUserDetails,
  bindWallet,
  unbindWallet,
} from "../../sagaStore/slices/userSlice.js";
import { WalletIcon } from '../../components/SolanaWallet/WalletIcon.tsx';

const WalletBindingPanel = () => {
  const dispatch = useAppDispatch();
  const user = useUserDetails();
  const bindingWallet = useBindWalletLoading();
  const { visible: isModalVisible, setVisible: setModalVisible } = useWalletModal();
  const { publicKey, onDisconnect, walletIcon, walletName } = useWalletMultiButton({
    onSelectWallet() {
    },
  });
  const [connectingWallet, setConnectingWallet] = useState(false);
  const [disconnectingWallet, setDisconnectingWallet] = useState(false);
  const [showDisconnectPrompt, setShowDisconnectPrompt] = useState(false);

  const getWalletAddr = useCallback(()=>{
    if (!user){
      return `${window.location.origin}/signup`;
    }
    return user?.walletAddr;
  },[user]);

  // wallet button logic
  const handleConnectWallet = ()=>{
    setConnectingWallet(true);
    setModalVisible(true);
  }

  const handleDisbindWallet = () =>{
    setShowDisconnectPrompt(true);
  }

  const handleCloseDisconnectPrompt = () =>{
    setShowDisconnectPrompt(false);
  }

  const handleConfirmDisconnect = () =>{
    setDisconnectingWallet(true);
    dispatch(unbindWallet());
    setShowDisconnectPrompt(false);
  }

  // Copy wallet address
  const copyWalletAddr = () => {
    navigator.clipboard.writeText(getWalletAddr());
    toast.success('User wallet address copied to clipboard!');
  };

  // handle wallet connection state changes
  useEffect(()=>{
    if (isModalVisible){
      return;
    }
    if (connectingWallet){
      if (publicKey){
        dispatch(bindWallet(publicKey));
      }else{
        console.log(`no wallet selected`);
      }
    }else if (disconnectingWallet){
      onDisconnect();
      setDisconnectingWallet(false);
    }
  },[dispatch, publicKey, isModalVisible, onDisconnect, connectingWallet, disconnectingWallet]);  

  // reset state after api calls completes
  useEffect(()=>{
    if (!bindingWallet){
      setConnectingWallet(false);
      setDisconnectingWallet(false);
    }
  }, [bindingWallet]);

  return (
    <>
      {/* Desktop wallet panel */}
      <div className="w-full h-full hidden xl:block my-auto p-[1rem] xl:p-[9rem] rounded-2xl text-white text-center bg-contain" 
        style={{
              backgroundImage: `url("/assets/images/clicker-character/wallet-binding-bg.png")`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
      >
        {/* hint */}
        <div className="flex flex-col select-none hover:cursor-default">
          {/* title */}
          <span className="text-xl xl:text-3xl text-[#ffa900] mb-6">
            Wallet Binding
          </span>

          {/* disclaimer 1 */}
          <span className="text-sm xl:text-base font-outfit font-normal mb-6">
            Everything in Animara are linked to your wallet.<br/>
            You need to bind your wallet in order to:
          </span>

          {/* items */}
          <ul className="text-white text-center text-sm xl:text-2xl font-normal transition-all duration-300 uppercase  mx-auto max-w-md list-none list-inside">
            <li className="mb-2 ">
              <div className="flex flex-row items-center justify-center">
                <img
                  src={"/assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="w-6 h-6 mr-[1rem]"
                />
                Mint Animara NFT
              </div>
            </li>
            <li className="mb-2 ">
              <div className="flex flex-row items-center justify-center">
                  <img
                    src={"/assets/images/clicker-character/gem.png"}
                    alt="gem"
                    className="w-6 h-6 mr-[1rem]"
                  />
                  Claim Referral cashback
              </div>
            </li>
            <li className="mb-2 ">
              <div className="flex flex-row items-center justify-center">
                <img
                  src={"/assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="w-6 h-6 mr-[1rem]"
                />
                Unlock NFT related special access
              </div>
            </li>
          </ul>
        </div>

        {/* wallet info */}
        <div className="flex flex-col h-auto my-6">
          {/* wallet binding info */}
          {user?.walletAddr ?
            <div className="flex flex-col mb-6">
              <span className="text-amber-500 text-xl xl:text-2xl mb-6">
                Current Wallet
              </span>
              {!bindingWallet?
                <span className="flex flex-col xl:flex-row items-center justify-center gap-2">
                  <WalletIcon 
                    wallet={{ adapter: { icon: walletIcon, name: walletName }}}
                    className="w-6" />
                    <div className="flex items-center w-[60%] relative">
                      <input
                        type="text"
                        value={user?.walletAddr} 
                        readOnly={true}
                        className="w-full bg-[#00101b] rounded-lg p-3 text-sm font-medium font-outfit tracking-wide"
                      />
                      <button
                        type="button"
                        onClick={copyWalletAddr}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#FA0] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[64x] h-[30px] text-xs tracking-wide px-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200"
                        style={{
                          boxShadow: '0px 4px 4px 0px rgba(255, 210, 143, 0.61) inset',
                        }}
                      >
                        <FaCopy />
                        <span className="hover:text-shadow-[0px_2px_0.6px_rgba(240,139,0,0.66)]">
                          &nbsp;Copy
                        </span>
                      </button>
                    </div>
                </span>
                :
                <></>
              }
            </div>
            :
            <span className="text-sm xl:text-base">
              This account is NOT bound to any wallet
            </span>
          }
          
          <div className="flex w-full h-auto items-center justify-center mt-4">
            {user?.walletAddr === `${publicKey}` ?
              bindingWallet || disconnectingWallet ? 
                <MoonLoader color={"#FFB23F"} size={40} />
                :
                <button
                  disabled={bindingWallet}
                  className="bg-[#8f8f8f] rounded-3xl px-[2rem] py-[1rem] hover:scale-110 transition-all duration-300"
                  onClick={handleDisbindWallet}
                >
                  Disconnect
                </button>
              :
              bindingWallet || connectingWallet ? 
                <MoonLoader color={"#FFB23F"} size={40} />
                :
                <button
                  disabled={bindingWallet}
                  className="bg-amber-400 w-32 rounded-lg py-2 px-4 hover:scale-110 transition-all duration-300"
                  onClick={handleConnectWallet}
                >
                  Bind
                </button>
            }
          </div>
        </div>
      </div>

      {/* Mobile wallet panel */}
      <div className="w-full h-full block xl:hidden my-auto rounded-2xl text-white text-center bg-contain" 
        style={{
              backgroundImage: `url("/assets/images/clicker-character/wallet-binding-mobile-bg.png")`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
      >
        {/* hint */}
        <div className="flex flex-col select-none hover:cursor-default pt-[6rem]">
          {/* title */}
          <span className="text-xl xl:text-3xl text-[#ffa900] mb-6">
            Wallet Binding
          </span>

          {/* disclaimer 1 */}
          <span className="text-sm xl:text-base font-outfit font-normal mb-6">
            Everything in Animara are linked to your wallet.<br/>
            You need to bind your wallet in order to:
          </span>

          {/* items */}
          <ul className="text-white text-center text-sm xl:text-2xl font-normal transition-all duration-300 uppercase  mx-auto max-w-md list-none list-inside">
            <li className="mb-2 ">
              <div className="flex flex-row items-center justify-center">
                <img
                  src={"/assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="w-6 h-6 mr-[1rem]"
                />
                Mint Animara NFT
              </div>
            </li>
            <li className="mb-2 ">
              <div className="flex flex-row items-center justify-center">
                  <img
                    src={"/assets/images/clicker-character/gem.png"}
                    alt="gem"
                    className="w-6 h-6 mr-[1rem]"
                  />
                  Claim Referral cashback
              </div>
            </li>
            <li className="mb-2 ">
              <div className="flex flex-row items-center justify-center">
                <img
                  src={"/assets/images/clicker-character/gem.png"}
                  alt="gem"
                  className="w-6 h-6 mr-[1rem]"
                />
                Unlock NFT related special access
              </div>
            </li>
          </ul>
        </div>

        {/* wallet info */}
        <div className="flex flex-col h-auto my-6 pb-[6rem]">
          {/* wallet binding info */}
          {user?.walletAddr ?
            <div className="flex flex-col mb-6">
              <span className="text-amber-500 text-xl xl:text-2xl mb-6">
                Current Wallet
              </span>
              {!bindingWallet?
                <span className="flex flex-col items-center justify-center gap-2">
                    <div className="flex flex-row">
                      <WalletIcon 
                        wallet={{ adapter: { icon: walletIcon, name: walletName }}}
                        className="w-6 mr-2" 
                      />
                      <input
                          type="text"
                          value={user?.walletAddr} 
                          readOnly={true}
                          className="w-full bg-[#00101b] rounded-lg p-3 text-sm font-medium font-outfit tracking-wide"
                        />
                    </div>
                    <div className="flex flex-col items-center w-[60%] relative">
                      
                      <button
                        type="button"
                        onClick={copyWalletAddr}
                        className=" bg-[#FA0] shadow-[0px_4px_4px_0px_rgba(255,210,143,0.61)_inset] border-[1px] border-[#FFAA00] rounded-lg flex items-center justify-center w-[256px] h-[40px] text-xs tracking-wide px-2 hover:bg-[#FFC85A] hover:shadow-[0px_1px_2px_0px_rgba(198,115,1,0.66)] hover:border-[#FFC85A] cursor-pointer hover:scale-105 transition-transform duration-200"
                        style={{
                          boxShadow: '0px 4px 4px 0px rgba(255, 210, 143, 0.61) inset',
                        }}
                      >
                        <FaCopy />
                        <span className="hover:text-shadow-[0px_2px_0.6px_rgba(240,139,0,0.66)]">
                          &nbsp;Copy
                        </span>
                      </button>
                    </div>
                </span>
                :
                <></>
              }
            </div>
            :
            <span className="text-sm xl:text-base">
              This account is NOT bound to any wallet
            </span>
          }
          
          <div className="flex w-full h-auto items-center justify-center mt-4">
            {user?.walletAddr === `${publicKey}` ?
              bindingWallet || disconnectingWallet ? 
                <MoonLoader color={"#FFB23F"} size={40} />
                :
                <button
                  disabled={bindingWallet}
                  className="bg-[#8f8f8f] rounded-3xl px-[2rem] py-[1rem] hover:scale-110 transition-all duration-300"
                  onClick={handleDisbindWallet}
                >
                  Disconnect
                </button>
              :
              bindingWallet || connectingWallet ? 
                <MoonLoader color={"#FFB23F"} size={40} />
                :
                <button
                  disabled={bindingWallet}
                  className="bg-amber-400 w-32 rounded-lg py-2 px-4 hover:scale-110 transition-all duration-300"
                  onClick={handleConnectWallet}
                >
                  Bind
                </button>
            }
          </div>
        </div>
      </div>

      {/* Popup overlay and dialog */}
      {showDisconnectPrompt && (
        <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-all duration-500
            ${showDisconnectPrompt? `opacity-100` : `opacity-0`}
          `}
          >
          <div className="p-[4rem] rounded-lg shadow-lg text-white" style={{
              backgroundImage: `url("/assets/images/clicker-character/upgrades-details-bg.png")`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}>
            <h2 className="text-xl text-center mb-4 text-red-400">Unbind Wallet</h2>
            <p className="mb-6 font-outfit">
              Are you sure you want to unbind your wallet?<br/>
              All your NFT related benefits will be disabled.
            </p>
            <div className="flex justify-end">
              <button
                className="bg-[#ffa900] text-slate-100 mr-auto py-2 px-4 rounded-2xl hover:scale-110 transition-all duration-500"
                onClick={handleCloseDisconnectPrompt}
              >
                Keep my benefits
              </button>
              <button   
                className="bg-red-400 hover:bg-red-700 text-red-100 py-2 px-4 rounded-2xl hover:scale-110 transition-all duration-500"
                onClick={handleConfirmDisconnect}
              >
                Unbind
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WalletBindingPanel;