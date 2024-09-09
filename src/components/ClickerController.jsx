import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useWalletMultiButton } from '@solana/wallet-adapter-base-ui';
import { useAppDispatch } from '../hooks/storeHooks';
import { useNavigate } from 'react-router-dom/dist';
import { getUser, fetchDates, useMintDate } from '../sagaStore/slices';
import { useUserDetails, useBindWalletLoading, useUserAuthenticated, useAuthLoading } from '../sagaStore/slices';
import { toast } from 'react-toastify';

const ClickerController = ({ Children }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useUserAuthenticated();
  const isAuthLoading = useAuthLoading();
  const currentUser = useUserDetails();
  const mintDate = useMintDate();
  const bindingWallet = useBindWalletLoading();
  const {
    publicKey,
    connecting: connectingWallet,
    connected: walletConnected,
  } = useWalletMultiButton({
    onSelectWallet() {},
  });
  const { visible: isModalVisible, setVisible: setModalVisible } = useWalletModal();

  // prevent unauthenticated access
  // auto featch user details if authenticated
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        dispatch(getUser());
        if (!mintDate) {
          dispatch(fetchDates());
        }
      } else {
        navigate('/login');
      }
    }
  }, [dispatch, isAuthLoading, isAuthenticated, navigate, mintDate]);

  // check to make sure user is using correct wallet
  useEffect(() => {
    if (!currentUser) {
      return;
    }
    if (connectingWallet) {
      return;
    }

    if (!connectingWallet && isModalVisible) {
      return;
    }

    // skip enhforcing wallet binding if is mobile
    if (
      /android|iPad|iPhone|iPod/i.test(navigator.userAgent) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
    ) {
      return;
    }

    // extract wallet address
    // Note: has to use public key as a string or else its an object
    const walletAddr = `${publicKey || ''}`;

    // if wallet match then done
    if (currentUser?.walletAddr && walletAddr === currentUser?.walletAddr) {
      setModalVisible(false);
      toast('Wallet sync complete');
    } else if (!bindingWallet && currentUser?.walletAddr !== '') {
      toast(`Please connect to wallet (address: ${currentUser?.walletAddr}) to continue`);
      setModalVisible(true);
    } else if (connectingWallet) {
      console.log(`unbinding wallet`);
    } else {
      console.log(`account not bound to any wallet yet`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.walletAddr, publicKey, connectingWallet, walletConnected, isModalVisible]);

  useEffect(() => {}, [publicKey]);
  return (
    <div className="overflow-hidden">
      <Children />
    </div>
  );
};

ClickerController.propTypes = {
  Children: PropTypes.func,
};

export default ClickerController;
