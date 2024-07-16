import { createSlice, current } from '@reduxjs/toolkit';
import { useAppSelector } from '../../hooks/storeHooks';

const userInitialState = {
  loading: false,
  getUserLoading: false,
  updatePopupLoading: false,
  getLeaderBoardLoading: false,
  getLeaderBoardSuccess: false,
  leaderBoard: [],
  updatePopupSuccess: false,
  isAuthenticated: false,
  isOpenDailyPopup: false,
  user: null,
  error: null,
  getOneTimeTaskListLoading: false,
  getOneTimeTaskListSuccess: false,
  oneTimeTaskList: [],
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
    logOut: () => {},
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
      state.user = payload;
    },
    updateDailyLogin: (state, { payload }) => {
      state.updatePopupLoading = true;
      state.updatePopupSuccess = false;
    },
    updateDailyLoginSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      state.user = {
        ...currentUser,
        coins: currentUser.coins + payload.coins,
        loggedInToday: true,
        loginDays: currentUser.loginDays + 1,
      }
      state.updatePopupLoading = false;
      state.updatePopupSuccess = true;
      state.isOpenDailyPopup = true;
    },
    updateDailyLoginError: (state, { payload }) => {
      state.updatePopupLoading = false;
      state.updatePopupSuccess = false;
      state.error = payload;
    },
    closeDailyPopup: () => {
    },
    closeDailyPopupSuccess: (state, { payload }) => {
      state.isOpenDailyPopup = false;
    },
    getLeaderBoard: (state, { payload }) => {
      state.getLeaderBoardLoading = true;
      state.getLeaderBoardSuccess = false;
    },
    getLeaderBoardSuccess: (state, { payload }) => {
      state.getLeaderBoardLoading = false;
      state.leaderBoard = payload;
      state.getLeaderBoardSuccess = true;
    },
    getLeaderBoardError: (state, { payload }) => {
      state.getLeaderBoardLoading = false;
      state.error = payload;
      state.getLeaderBoardSuccess = true;
    },
    getOneTimeTaskList: (state, { payload }) => {
      state.getOneTimeTaskListLoading = true;
      state.getOneTimeTaskListSuccess = false;
    },
    getOneTimeTaskListSuccess: (state, { payload }) => {
      state.getOneTimeTaskListLoading = false;
      state.oneTimeTaskList = payload;
      state.getOneTimeTaskListSuccess = true;
    },
    getOneTimeTaskListError: (state, { payload }) => {
      state.getOneTimeTaskListLoading = false;
      state.error = payload;
      state.getOneTimeTaskListSuccess = false;
    },
    updateCompleteOneTimeTask: () => {},
    updateCompleteOneTimeTaskSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      state.user = {
        ...currentUser,
        coins: currentUser.coins + payload.coins,
        completedTask: payload.completedTask
      }
    },
  },
});

export const {
  logOut,
  logOutSuccess,
  login,
  loginSuccess,
  loginError,
  setError,
  clearLoginError,
  getUser,
  getUserSuccess,
  getUserError,
  updateDailyLogin,
  updateDailyLoginSuccess,
  updateDailyLoginError,
  closeDailyPopup,
  closeDailyPopupSuccess,
  getLeaderBoard,
  getLeaderBoardSuccess,
  getLeaderBoardError,
  getOneTimeTaskList,
  getOneTimeTaskListSuccess,
  getOneTimeTaskListError,
  updateCompleteOneTimeTask,
  updateCompleteOneTimeTaskSuccess
} = userSlice.actions;

export const useLoginLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginError = () => useAppSelector((state) => state.user.error);
export const useUserDetails = () => useAppSelector((state) => state.user.user);
export const useLeaderBoardDetails = () => useAppSelector((state) => state.user.leaderBoard);
export const useLeaderBoardLoading = () => useAppSelector((state) => state.user.getLeaderBoardLoading);
export const useLeaderBoardLoadSuccess = () => useAppSelector((state) => state.user.getLeaderBoardSuccess);
export const useIsOpenDailyPopup = () => useAppSelector((state) => state.user.isOpenDailyPopup);
export const useOneTimeTaskList = () => useAppSelector((state) => state.user.oneTimeTaskList);
export const useOneTimeTaskListSuccess = () => useAppSelector((state) => state.user.getOneTimeTaskListSuccess);

export const useUserAuthenticated = () => useAppSelector((state) => state.user.isAuthenticated);

const userReducer = userSlice.reducer;
export default userReducer;
