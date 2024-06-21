import { createSlice } from '@reduxjs/toolkit';

import { useAppSelector } from '../../hooks/storeHooks';

const userInitialState = {
  loading: false,
  isAuthenticated: false,
  user: [],
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    login: (state, { payload }) => {
      state.loading = true;
    },
    loginSuccess: (state) => {
      state.isAuthenticated = true;
      state.loading = false;
    },
    loginError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    logOut: () => {},
    clearLoginError: (state) => {
      state.error = null;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    resetUser: (state) => {
      state.loading = false;
      state.user = userInitialState.user;
    },
  },
});

export const { logOut, login, loginSuccess, loginError, setError, resetUser, clearLoginError } = userSlice.actions;

export const useLoginLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginError = () => useAppSelector((state) => state.user.error);
export const useUserDetails = () => useAppSelector((state) => state.user.user);

export const useUserAuthenticated = () => useAppSelector((state) => state.user.isAuthenticated);

const userReducer = userSlice.reducer;
export default userReducer;
