import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useNavigatorOnline from 'use-navigator-online';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from "./pages/Signup/SignupPage";
import EditProfilePage from "./pages/EditProfile/EditProfilePage";
import ReferralPage from "./pages/Referral/ReferralPage";
import EarlyBirdPage from "./pages/EarlyBird/EarlyBirdPage";
import VerifyEmailPage from "./pages/VerifyEmail/VerifyEmailPage";
import LimitedAccessPage from "./pages/VerifyEmail/LimitedAccessPage";
import MintPage from "./pages/Mint/MintPage";
// import ClickerPage from "./pages/Clicker/ClickerPage";
import LockPage from "./pages/Lock/LockPage.js";
import AppLayout from './components/AppLayout';
import { GlobalProvider } from './context/ContextProvider';
import rootSaga from './sagas';
import { useAppDispatch } from './hooks/storeHooks';
import { appInit, systemUpdateNetworkConnection, setIsMobile, setIsIOS } from './sagaStore/slices';
import { runSaga } from './sagaStore/store';
import "@solana/wallet-adapter-react-ui/styles.css";
import './globals.css';

// Import Solana wallet packages
import { WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UmiProvider } from "./web3/UmiProvider.tsx";

import './i18n';
import ClickerController from './components/ClickerController';
import Error404Page from './pages/Error404/Error404.js';
import NoInternetConnection from './components/NoInternetConnection.jsx';

export const App = () => {
  const dispatch = useAppDispatch();
  const { isOnline, isOffline, backOnline, backOffline } = useNavigatorOnline();

  let endpoint = "https://api.devnet.solana.com";
  if (process.env.REACT_APP_RPC) {
    endpoint = process.env.REACT_APP_RPC;
  }
  const wallets = useMemo(
    () => [
    ],
    []
  );

  useEffect(() => {
    runSaga(rootSaga);
    dispatch(appInit());

    // detect platform
    dispatch(setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    ));
  }, [dispatch]);

  useEffect(() => {
    if (backOnline || backOffline) {
      if (backOffline) {
        localStorage.setItem('lastPageActivityTimeStamp', JSON.stringify(new Date().getTime()));
      }
      dispatch({
        type: systemUpdateNetworkConnection.type,
        payload: {
          isOnline,
          isOffline,
          backOnline,
          backOffline,
        },
      });
    }
  }, [backOnline, backOffline, dispatch, isOnline, isOffline]);

  // setup to track if this page is mobile
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <NoInternetConnection>
      <WalletProvider wallets={wallets} autoConnect>
        <UmiProvider endpoint={endpoint}>
          <WalletModalProvider>
            <BrowserRouter>
              <GlobalProvider>
                <Routes>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/limited-access" element={<LimitedAccessPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/edit-profile" element={<ClickerController Children={EditProfilePage} />} />
                    <Route path="/anitap" element={<ClickerController Children={LockPage} />} />
                    <Route path="/referral" element={<ClickerController Children={ReferralPage} />} />
                    <Route path="/early-bird" element={<ClickerController Children={EarlyBirdPage} />} />
                    <Route path="/mint" element={<ClickerController Children={MintPage} />} />
                    <Route path="*" element={<Error404Page />} />
                  </Route>
                </Routes>
              </GlobalProvider>
            </BrowserRouter>
          </WalletModalProvider>
        </UmiProvider>
      </WalletProvider>
    </NoInternetConnection>
  );
};