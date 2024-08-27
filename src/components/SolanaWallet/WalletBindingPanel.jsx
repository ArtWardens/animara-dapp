import React, { useEffect, useState } from "react";
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
      {/* wallet panel */}
      <div className="w-full lx:w-1/2 my-auto p-12 bg-slate-800 rounded-2xl text-white text-center">
        {/* hint */}
        <div className="flex flex-col select-none hover:cursor-default">
          {/* title */}
          <span className="text-3xl text-amber-500 mb-6">
            Wallet Binding
          </span>

          {/* disclaimer 1 */}
          <span className="font-outfit text-lg mb-6">
            Everything in Animara are linked to your wallet.<br/><br/>
            You need to bind your wallet in order to:
          </span>

          {/* items */}
          <ul className="font-outfit text-left mx-auto max-w-md list-decimal list-inside">
            <li className="mb-2 text-lg font-bold hover:text-amber-500 transition-all duration-300">Mint Animara NFT</li>
            <li className="mb-2 text-lg font-bold hover:text-amber-500 transition-all duration-300">Claim Referral cashback, and</li>
            <li className="mb-2 text-lg font-bold hover:text-amber-500 transition-all duration-300">Unlock NFT related special access.</li>
          </ul>
        </div>

        {/* wallet info */}
        <div className="flex flex-col h-auto my-6">
          {/* wallet binding info */}
          {user?.walletAddr ?
            <div className="flex flex-col mb-6">
              <span className="text-amber-500">
                This account is bound to wallet
              </span>
              {!bindingWallet?
                <span className="flex items-center justify-center gap-2">
                  <WalletIcon 
                    wallet={{ adapter: { icon: walletIcon, name: walletName }}}
                    className="w-6" />
                  {user?.walletAddr} 
                </span>
                :
                <></>
              }
            </div>
            :
            <span>
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
                  className="bg-amber-400 w-32 rounded-lg py-2 px-4 hover:scale-110 transition-all duration-300"
                  onClick={handleDisbindWallet}
                >
                  Unbind
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
          `}>
          <div className="bg-slate-700 p-8 rounded-lg shadow-lg text-white">
            <h2 className="text-xl mb-4 text-red-400">Unbind Wallet</h2>
            <p className="mb-6 font-outfit">
              Are you sure you want to unbind your wallet?<br/>
              All your NFT related benefits will be disabled.
            </p>
            <div className="flex justify-end">
              <button
                className="bg-amber-400 text-slate-100 mr-auto py-2 px-4 rounded hover:scale-110 transition-all duration-500"
                onClick={handleCloseDisconnectPrompt}
              >
                Keep my benefits
              </button>
              <button   
                className="bg-red-400 hover:bg-red-700 text-red-100 py-2 px-4 rounded hover:scale-110 transition-all duration-500"
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