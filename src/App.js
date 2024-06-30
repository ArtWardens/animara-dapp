import './i18n';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useNavigatorOnline from 'use-navigator-online';

import AppLayout from './components/AppLayout';

import ClickerMain from './pages/Clicker/ClickerMain';
import Login from './pages/Login/Login';
import Signup from "./pages/Signup/Signup";
import EditProfile from "./pages/EditProfile/EditProfile";

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
          <Route element={<AppLayout />}>
            <Route path="/" element={<Login />}/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/clicker" element={<ClickerMain />} />
            <Route path="/edit-profile" element={<EditProfile />} />
          </Route>
        </Routes>
      </GlobalProvider>
    </BrowserRouter>
  );
};