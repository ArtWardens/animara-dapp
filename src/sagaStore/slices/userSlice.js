import { createSlice, current } from '@reduxjs/toolkit';
import { useAppSelector } from '../../hooks/storeHooks';

const userInitialState = {
  loading: false,
  resetPasswordLoading: false,
  updateProfile: [],
  updateProfileLoading: false,
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
  getEarlyBirdOneTimeTaskListLoading: false,
  getEarlyBirdOneTimeTaskListSuccess: false,
  earlyBirdOneTimeTask: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    signupWithEmail: (state, { payload }) => {
      state.loading = true;
    },
    signupWithEmailSuccess: (state, { payload }) => {
      state.loading = false;
    },
    signupWithEmailError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    completeSignUpWithEmail: (state, { payload }) => {
      state.loading = true;
    },
    completeSignUpWithEmailSuccess: (state, { payload }) => {
      state.loading = false;
    },
    completeSignUpWithEmailError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    loginWithEmail: (state, { payload }) => {
      state.loading = true;
    },
    loginWithEmailSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = payload;
    },
    loginWithEmailError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    loginWithGoogle: (state, { payload }) => {
      state.loading = true;
    },
    loginWithGoogleSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = payload;
    },
    loginWithGoogleError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    loginWithTwitter: (state, { payload }) => {
      state.loading = true;
    },
    loginWithTwitterSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = payload;
    },
    loginWithTwitterError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    loginWithTelegram: (state, { payload }) => {
      state.loading = true;
    },
    loginWithTelegramSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = payload;
    },
    loginWithTelegramError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.loading = false;
    },
    logOut: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    logOutSuccess: (state, { payload }) => {
      state.user = payload;
    },
    clearLoginError: (state) => {
      state.error = null;
    },
    resetPassword: (state) =>{
      state.resetPasswordLoading = true;
    },
    resetPasswordSuccess: (state, { payload }) => {
      state.resetPasswordLoading = false;
      state.user = payload;
    },
    resetPasswordError: (state, { payload }) => {
      state.error = payload;
      state.resetPasswordLoading = false;
    },
    updateProfile: (state, { payload }) =>{
      state.updateProfileLoading = true;
      state.updateProfile = payload;
    },
    updateProfileSuccess: (state, { payload }) => {
      state.updateProfileLoading = false;
      console.log(payload);
      state.user = payload;
    },
    updateProfileError: (state, { payload }) => {
      state.error = payload;
      state.updateProfileLoading = false;
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
    getEarlyBirdOneTimeTaskList: (state, { payload }) => {
      state.getEarlyBirdOneTimeTaskListLoading = true;
      state.getEarlyBirdOneTimeTaskListSuccess = false;
    },
    getEarlyBirdOneTimeTaskListSuccess: (state, { payload }) => {
      state.getEarlyBirdOneTimeTaskListLoading = false;
      state.earlyBirdOneTimeTask = payload;
      state.getEarlyBirdOneTimeTaskListSuccess = true;
    },
    getEarlyBirdOneTimeTaskListError: (state, { payload }) => {
      state.getEarlyBirdOneTimeTaskListLoading = false;
      state.error = payload;
      state.getEarlyBirdOneTimeTaskListSuccess = false;
    },
  },
});

export const {
  logOut,
  logOutSuccess,
  signupWithEmail,
  signupWithEmailSuccess,
  signupWithEmailError,
  completeSignUpWithEmail,
  completeSignUpWithEmailSuccess,
  completeSignUpWithEmailError,
  loginWithEmail,
  loginWithEmailSuccess,
  loginWithEmailError,
  loginWithGoogle,
  loginWithGoogleSuccess,
  loginWithGoogleError,
  loginWithTwitter,
  loginWithTwitterSuccess,
  loginWithTwitterError,
  loginWithTelegram,
  loginWithTelegramSuccess,
  loginWithTelegramError,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordError,
  updateProfile,
  updateProfileSuccess,
  updateProfileError,
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
  getEarlyBirdOneTimeTaskList,
  getEarlyBirdOneTimeTaskListSuccess,
  getEarlyBirdOneTimeTaskListError,
  updateCompleteOneTimeTask,
  updateCompleteOneTimeTaskSuccess
} = userSlice.actions;

export const useAuthLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginError = () => useAppSelector((state) => state.user.error);
export const useSignupError = () => useAppSelector((state) => state.user.error);
export const useCompleteSignupWithEmailLoading = () => useAppSelector((state) => state.user.loading);
export const useCompleteSignupWithEmailError = () => useAppSelector((state) => state.user.error);
export const useLoginWithGoogleLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginWithGoogleError = () => useAppSelector((state) => state.user.error);
export const useLoginWithTwitterLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginWithTwitterError = () => useAppSelector((state) => state.user.error);
export const useLoginWithTelegramLoading = () => useAppSelector((state) => state.user.loading);
export const useLoginWithTelegramError = () => useAppSelector((state) => state.user.error);
export const useResetPasswordError = () => useAppSelector((state) => state.user.error);
export const useResetPasswordLoading = () => useAppSelector((state) => state.user.resetPasswordLoading);
export const useUpdateProfileLoading = () => useAppSelector((state) => state.user.updateProfileLoading);
export const useUserDetails = () => useAppSelector((state) => state.user.user);
export const useLeaderBoardDetails = () => useAppSelector((state) => state.user.leaderBoard);
export const useLeaderBoardLoading = () => useAppSelector((state) => state.user.getLeaderBoardLoading);
export const useLeaderBoardLoadSuccess = () => useAppSelector((state) => state.user.getLeaderBoardSuccess);
export const useIsOpenDailyPopup = () => useAppSelector((state) => state.user.isOpenDailyPopup);
export const useOneTimeTaskList = () => useAppSelector((state) => state.user.oneTimeTaskList);
export const useOneTimeTaskListSuccess = () => useAppSelector((state) => state.user.getOneTimeTaskListSuccess);
export const useEarlyBirdOneTimeTaskList = () => useAppSelector((state) => state.user.earlyBirdOneTimeTask);
export const useEarlyBirdOneTimeTaskListSuccess = () => useAppSelector((state) => state.user.getEarlyBirdOneTimeTaskListSuccess);
export const useUserAuthenticated = () => useAppSelector((state) => state.user.isAuthenticated);

const userReducer = userSlice.reducer;

export default userReducer;
