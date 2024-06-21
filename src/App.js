import './i18n';

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import useNavigatorOnline from 'use-navigator-online';

import AppLayout from './components/AppLayout';

import TestMain from './pages/Clicker/TestMain';
import Home from './pages/Home/index';
import Login from './pages/Login/index';
import Signup from './pages/Signup/index';

import { useEffect } from 'react';
import { GlobalProvider } from './context/ContextProvider';
import { useAppDispatch } from './hooks/storeHooks';
import { appInit, systemUpdateNetworkConnection } from './sagaStore/slices';
import { runSaga } from './sagaStore/store';
import rootSaga from './sagas';

export const App = () => {
  const dispatch = useAppDispatch();

  const { isOnline, isOffline, backOnline, backOffline } = useNavigatorOnline();

  useEffect(() => {
    runSaga(rootSaga);
    dispatch(appInit());
  }, []);

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
  }, [backOnline, backOffline]);

  return (
    <BrowserRouter>
      <GlobalProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/test" element={<TestMain />} />
          </Route>
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};
