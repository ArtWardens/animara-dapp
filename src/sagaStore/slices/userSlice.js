import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from '../../hooks/storeHooks';

const userInitialState = {
  loading: false,
  getUserLoading: false,
  isAuthenticated: false,
  user: null,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    login: (state, { payload }) => {
      state.loading = true;
    },
    loginSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = payload;
    },
    loginError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    logOut: () => {

    },
    logOutSuccess: (state, { payload }) => {
      state.user = payload;
    },
    clearLoginError: (state) => {
      state.error = null;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
    getUser: (state, { payload }) => {
      state.getUserLoading = true;
    },
    getUserSuccess: (state, { payload }) => {
      state.getUserLoading = false;
      state.user = payload;
    },
    getUserError: (state, { payload }) => {
      state.getUserLoading = false;
      state.user = payload
    }
  },
});

export const { logOut, logOutSuccess, login, loginSuccess, loginError, setError, clearLoginError, getUser, getUserSuccess, getUserError } = userSlice.actions;

export const useLoginLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginError = () => useAppSelector((state) => state.user.error);
export const useUserDetails = () => useAppSelector((state) => state.user.user);

export const useUserAuthenticated = () => useAppSelector((state) => state.user.isAuthenticated);

const userReducer = userSlice.reducer;
export default userReducer;
