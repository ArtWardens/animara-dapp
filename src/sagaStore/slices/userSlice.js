import { createSlice, current } from '@reduxjs/toolkit';
import { useAppSelector } from '../../hooks/storeHooks';
import {
  addToLocalStorage,
} from "../../utils/localStorage";
import {
    StaminaRechargeTypeBasic,
    StaminaRechargeTypeInvite,
  } from "../../utils/constants"

const userInitialState = {
  authLoading: false,
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
  localCoins: 0,
  localStamina: 0,
  error: null,
  getOneTimeTaskListLoading: false,
  getOneTimeTaskListSuccess: false,
  oneTimeTaskList: [],
  taskIdToComplete: '',
  getEarlyBirdOneTimeTaskListLoading: false,
  getEarlyBirdOneTimeTaskListSuccess: false,
  earlyBirdOneTimeTask: [],
  settleTapSessionLoading: false,
  rechargeStaminaLoading: false,
  rechargeOpType: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState: userInitialState,
  reducers: {
    signupWithEmail: (state, { payload }) => {
      state.authLoading = true;
    },
    signupWithEmailSuccess: (state, { payload }) => {
      state.authLoading = false;
    },
    signupWithEmailError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.authLoading = false;
    },
    completeSignUpWithEmail: (state, { payload }) => {
      state.authLoading = true;
    },
    completeSignUpWithEmailSuccess: (state, { payload }) => {
      state.authLoading = false;
    },
    completeSignUpWithEmailError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.authLoading = false;
    },
    loginWithEmail: (state, { payload }) => {
      state.authLoading = true;
    },
    loginWithEmailSuccess: (state, { payload }) => {
      addToLocalStorage("uid", payload.uid);
      state.user = payload;
      state.isAuthenticated = true;
      state.authLoading = false;
    },
    loginWithEmailError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.authLoading = false;
    },
    loginWithGoogle: (state, { payload }) => {
      state.authLoading = true;
    },
    loginWithGoogleSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.authLoading = false;
      state.user = payload;
    },
    loginWithGoogleError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.authLoading = false;
    },
    loginWithTwitter: (state, { payload }) => {
      state.authLoading = true;
    },
    loginWithTwitterSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.authLoading = false;
      state.user = payload;
    },
    loginWithTwitterError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.authLoading = false;
    },
    loginWithTelegram: (state, { payload }) => {
      state.authLoading = true;
    },
    loginWithTelegramSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.authLoading = false;
      state.user = payload;
    },
    loginWithTelegramError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.authLoading = false;
    },
    logOut: (state) => {
      state.authLoading = true;
    },
    logOutSuccess: (state) => {
      state.user = null;
      state.localCoins = 0;
      state.localStamina = 0;
      state.isAuthenticated = false;
      state.authLoading = false;
    },
    logOutError: (state) => {
      state.authLoading = false;
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
      state.user = payload;
    },
    updateProfileError: (state, { payload }) => {
      state.error = payload;
      state.updateProfileLoading = false;
    },
    setError: (state, { payload }) => {
      state.error = payload;
      state.authLoading = false;
    },
    getUser: (state, { payload }) => {
      state.getUserLoading = true;
    },
    getUserSuccess: (state, { payload }) => {
      state.getUserLoading = false;
      state.user = payload;
      state.localStamina = payload.stamina;
      state.localCoins = payload.coins;
    },
    getUserError: (state, { payload }) => {
      state.getUserLoading = false;
      state.user = payload;
    },
    updateDailyLogin: (state) => {
      state.updatePopupLoading = true;
      state.updatePopupSuccess = false;
    },
    updateDailyLoginSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      state.localCoins = payload.updatedCoins;
      state.user = {
        ...currentUser,
        coins:  payload.updatedCoins,
        loggedInToday: true,
        loginDays: payload.newLoginDay,
      }
      state.updatePopupLoading = false;
      state.updatePopupSuccess = true;
      state.isOpenDailyPopup = true;
    },
    updateDailyLoginError: (state, { payload }) => {
      state.updatePopupLoading = false;
      state.updatePopupSuccess = false;
      state.error = payload;
      const currentUser = current(state.user);
      state.user = {
        ...currentUser,
        loggedInToday: true,
      }
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
    completeOneTimeTask: (state, { payload }) => {
      state.taskIdToComplete = payload.taskId;
    },
    completeOneTimeTaskSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      let taskList = state.user.completedTask;
      taskList.push(payload.completedTaskId);
      state.user = {
        ...currentUser,
        coins: payload.updatedCoins,
        completedTask: taskList
      }
      state.taskIdToComplete = '';
    },
    completeOneTimeTaskError: (state, { payload }) => {
      state.taskIdToComplete = '';
      state.error = payload;
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
    consumeStamina: (state, { payload }) => {
      const prevStamina = state.localStamina;
      const newStamina = prevStamina - payload.staminaToConsume;
      state.localStamina = newStamina;
      const prevCoins = state.localCoins;
      const newCoins = prevCoins + payload.coinToGain;
      state.localCoins = newCoins;
    },
    settleTapSession: (state) => {
      state.settleTapSessionLoading = true;
    },
    settleTapSessionSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      state.user = {
        ...currentUser,
        coins: payload.newCoinAmt,
        stamina: payload.newStamina,
      }
      console.log(`slice payload.newStamina ${payload.newStamina} state.user.stamina ${state.user.stamina}`);
      state.localStamina = payload.newStamina;
      state.localCoins = payload.newCoinAmt;
      state.settleTapSessionLoading = true;
    },
    settleTapSessionError: (state, { payload }) => {
      state.error = payload;
      state.settleTapSessionLoading = true;
    },
    rechargeStamina: (state, { payload }) => {
      state.rechargeStaminaLoading = true;
      state.rechargeOpType = payload.opType;
    },
    rechargeStaminaSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      if (state.rechargeOpType === StaminaRechargeTypeBasic){
        state.user = {
          ...currentUser,
          stamina: payload.newStamina,
          staminaRechargeRemaining: payload.newRechargeRemaining,
        }
      }else if (state.rechargeOpType === StaminaRechargeTypeInvite){
        state.user = {
          ...currentUser,
          stamina: payload.newStamina,
          inviteRechargeRemaining: payload.newRechargeRemaining,
        }
      } 
      state.localStamina = payload.newStamina;
      state.rechargeStaminaLoading = false;
    },
    rechargeStaminaError: (state, { payload }) => {
      state.error = payload;
      state.rechargeStaminaLoading = false;
    },
  },
});

export const {
  logOut,
  logOutSuccess,
  logOutError,
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
  completeOneTimeTask,
  completeOneTimeTaskSuccess,
  completeOneTimeTaskError,
  consumeStamina,
  settleTapSession,
  settleTapSessionSuccess,
  settleTapSessionError,
  rechargeStamina,
  rechargeStaminaSuccess,
  rechargeStaminaError,
} = userSlice.actions;

export const useAuthLoading = () => useAppSelector((state) => state.user.authLoading);
export const useLoginLoading = () => useAppSelector((state) => state.user.authLoading);
export const useLoginError = () => useAppSelector((state) => state.user.error);
export const useSignupError = () => useAppSelector((state) => state.user.error);
export const useCompleteSignupWithEmailLoading = () => useAppSelector((state) => state.user.authLoading);
export const useCompleteSignupWithEmailError = () => useAppSelector((state) => state.user.error);
export const useLoginWithGoogleLoading = () => useAppSelector((state) => state.user.authLoading);
export const useLoginWithGoogleError = () => useAppSelector((state) => state.user.error);
export const useLoginWithTwitterLoading = () => useAppSelector((state) => state.user.authLoading);
export const useLoginWithTwitterError = () => useAppSelector((state) => state.user.error);
export const useLoginWithTelegramLoading = () => useAppSelector((state) => state.user.authLoading);
export const useLoginWithTelegramError = () => useAppSelector((state) => state.user.error);
export const useResetPasswordError = () => useAppSelector((state) => state.user.error);
export const useResetPasswordLoading = () => useAppSelector((state) => state.user.resetPasswordLoading);
export const useUpdateProfileLoading = () => useAppSelector((state) => state.user.updateProfileLoading);
export const useUserDetails = () => useAppSelector((state) => state.user.user);
export const useUserDetailsLoading = () => useAppSelector((state) => state.user.getUserLoading);
export const useLeaderBoardDetails = () => useAppSelector((state) => state.user.leaderBoard);
export const useLeaderBoardLoading = () => useAppSelector((state) => state.user.getLeaderBoardLoading);
export const useLeaderBoardLoadSuccess = () => useAppSelector((state) => state.user.getLeaderBoardSuccess);
export const useIsOpenDailyPopup = () => useAppSelector((state) => state.user.isOpenDailyPopup);
export const useOneTimeTaskList = () => useAppSelector((state) => state.user.oneTimeTaskList);
export const useTaskIdToComplete = () => useAppSelector((state) => state.user.taskIdToComplete);
export const useOneTimeTaskListSuccess = () => useAppSelector((state) => state.user.getOneTimeTaskListSuccess);
export const useEarlyBirdOneTimeTaskList = () => useAppSelector((state) => state.user.earlyBirdOneTimeTask);
export const useEarlyBirdOneTimeTaskListSuccess = () => useAppSelector((state) => state.user.getEarlyBirdOneTimeTaskListSuccess);
export const useUserAuthenticated = () => useAppSelector((state) => state.user.isAuthenticated);
export const useLocalCoins = () => useAppSelector((state) => state.user.localCoins);
export const useLocalStamina = () => useAppSelector((state) => state.user.localStamina);
export const useRechargeLoading = () => useAppSelector((state) => state.user.rechargeStaminaLoading);

const userReducer = userSlice.reducer;

export default userReducer;
