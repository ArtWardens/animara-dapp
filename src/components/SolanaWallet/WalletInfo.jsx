import React, { useMemo } from 'react';
import { PropTypes } from "prop-types";
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { WalletIcon } from './WalletIcon.tsx';

function WalletInfo({ label }){
  const { publicKey, walletIcon, walletName } = useWalletMultiButton({
    onSelectWallet() {
    },
  });

  const content = useMemo(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      return base58.slice(0, 4) + '..' + base58.slice(-4);
    }else{
      return 'no wallet detected'
    }
  }, [publicKey]);

  return (
    <div className="flex flex-col w-full items-center p-6 gap-6">
      {publicKey ?
        <div className='flex flex-col gap-2 w-full items-center justify-center'>
          {/* title */}
          <span className='w-full text-center'>{label}</span>

          {/* wallet info */}
          <div className="flex items-center justify-center gap-2">
            {/* wallet icon */}
            {walletIcon && walletName ? (
                <WalletIcon 
                    wallet={{ adapter: { icon: walletIcon, name: walletName }}}
                    className="w-6" />
            ) : <></>}

            {/* content */}
            <span className='h-full text-center'>{content}</span>
          </div>
      </div>
      :
      <span className='h-full text-center'>{content}</span>
      }
    </div>
  );
}

WalletInfo.propTypes = {
  label: PropTypes.string
}

export default WalletInfo;
