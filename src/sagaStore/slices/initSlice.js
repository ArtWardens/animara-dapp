import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '../../hooks/storeHooks';

export const initInitialState = {
  loading: true,
  status: false,
  error: null,
};

export const initSlice = createSlice({
  name: 'init',
  initialState: initInitialState,
  reducers: {
    appInit: () => {},
    appInitSuccess(state, action) {
      state.loading = false;
      state.status = action.payload;
    },
    appInitError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    setAppLoading(state, { payload }) {
      state.loading = payload;
    },
  },
});

export const { appInit, appInitSuccess, setAppLoading, appInitError } = initSlice.actions;

export const useInitLoading = () => useAppSelector((state) => state.init.loading);
export const useInitData = () => useAppSelector((state) => state);

const initReducer = initSlice.reducer;
export default initReducer;
