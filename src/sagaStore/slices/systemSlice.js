import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '../../hooks/storeHooks';

const initialState = {
  networkConnection: {
    isOnline: true,
    isOffline: false,
    backOnline: false,
    backOffline: false,
  },
  timeZone: '',
  page: {
    isActive: true,
    isCollapsed: false,
  },
  error: null,
  loading: false,
  isMobile: false,
  isIOS: false,
};

export const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    systemUpdateNetworkConnection: (state, { payload }) => {
      state.networkConnection = payload;
    },
    systemUpdatePageFocus: (state, { payload }) => {
      state.page.isActive = payload.isActive;
    },
    systemAddError: (state, { payload }) => {
      state.workSpaceError = payload;
    },
    systemDispatch: (state, action) => {},
    setTimezone: (state, { payload }) => {
      state.timeZone = payload;
    },
    setIsMobile: (state, { payload }) => {
      state.isMobile = payload;
    },
    setIsIOS: (state, { payload }) => {
      state.isIOS = payload;
    }
  },
});

export const { systemUpdateNetworkConnection, systemUpdatePageFocus, systemAddError, setTimezone, systemDispatch, setIsMobile, setIsIOS } =
  systemSlice.actions;

export const useSystemNetworkConnection = () => useAppSelector((state) => state.system);
export const useSystemPageActivityStatus = () => useAppSelector((state) => state.system.page.isActive);
export const useSystemIsOnline = () => useAppSelector((state) => state.system.networkConnection.isOnline);
export const useTimezone = () => useAppSelector((state) => state.system.timeZone);
export const useSystemError = () => useAppSelector((state) => state.system.error);
export const useIsMobile = () => useAppSelector((state) => state.system.isMobile);
export const useIsIOS = () => useAppSelector((state) => state.system.isIOS);

const systemReducer = systemSlice.reducer;
export default systemReducer;
