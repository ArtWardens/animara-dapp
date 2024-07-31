import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useNavigatorOnline from 'use-navigator-online';
import ClickerPage from './pages/Clicker/ClickerPage';
import LoginPage from './pages/Login/LoginPage';
import SignupPage from "./pages/Signup/SignupPage";
import EditProfilePage from "./pages/EditProfile/EditProfilePage";
import ReferralPage from "./pages/Referral/ReferralPage";
import EarlyBirdPage from "./pages/EarlyBird/EarlyBirdPage";
import LockPage from "./pages/Lock/LockPage";
import VerifyEmailPage from "./pages/VerifyEmail/VerifyEmailPage";
import LimitedAccessPage from "./pages/VerifyEmail/LimitedAccessPage";
// import MintPage from "./pages/Mint/MintPage";
import AppLayout from './components/AppLayout';
import { GlobalProvider } from './context/ContextProvider';
import rootSaga from './sagas';
import { useAppDispatch } from './hooks/storeHooks';
import { appInit, systemUpdateNetworkConnection } from './sagaStore/slices';
import { runSaga } from './sagaStore/store';

import './i18n';
import ClickerController from './components/ClickerController';

export const App = () => {
  const dispatch = useAppDispatch();

  const { isOnline, isOffline, backOnline, backOffline } = useNavigatorOnline();

  useEffect(() => {
    runSaga(rootSaga);
    dispatch(appInit());
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

  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/limited-access" element={<LimitedAccessPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/edit-profile" element={<ClickerController Children={EditProfilePage}/>} />
            <Route path="/clicker" element={<ClickerController Children={ClickerPage}/>} />
            <Route path="/referral" element={<ClickerController Children={ReferralPage} />} />
            <Route path="/early-bird" element={<ClickerController Children={EarlyBirdPage} />} />
            <Route path="/amipals-lock" element={<ClickerController Children={LockPage} />} />
            {/* <Route path="/mint" element={<MintPage />} /> */}
            
          </Route>
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};