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
  dailyLoginLoading: false,
  getLeaderBoardLoading: false,
  getLeaderBoardSuccess: false,
  leaderBoard: [],
  getNewLeaderBoardLoading: false,
  getNewLeaderBoardSuccess: false,
  newLeaderBoard: null,
  updatePopupSuccess: false,
  isAuthenticated: false,
  isOpenDailyPopup: false,
  user: null,
  localCoins: 0,
  localStamina: 0,
  snapshotCoins: 0,
  snapshotStamina: 0,
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
  userLocationsLoading: false,
  userLocations: null,
  upgradeUserLocationErrorCode: '',
  newlyUnlockedLocations: [],
  dailyComboMatched: ["", "", ""],
  referralStatLoading: false,
  referralCount: 0,
  nftPurchasedReferralCount: 0,
  basicClaimable: 0,
  nftClaimable: 0,
  bindWalletLoading: false,
  mintingNFT: false,
  nftMinted: null,
  mintDate: null,
  lockDate: null,
  earlyBirdDate: null,
  levelUpCoinReward: 0,
  claimCashbackLoading: false,
  getUserLastPeriodicBatchTimeLoading: false,
  userLastPeriodicBatchTime: null,
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
    },
    loginWithTwitterError: (state, { payload }) => {
      state.isAuthenticated = false;
      state.error = payload;
      state.authLoading = false;
    },
    checkLoginWithRedirect: (state, { payload }) => {
      state.authLoading = true;
    },
    checkLoginWithRedirectSuccess: (state, { payload }) => {
      state.isAuthenticated = true;
      state.authLoading = false;
    },
    checkLoginWithRedirectError: (state, { payload }) => {
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
      state.authLoading = true;
    },
    resetPasswordSuccess: (state, { payload }) => {
      state.resetPasswordLoading = false;
      state.authLoading = false;
    },
    resetPasswordError: (state, { payload }) => {
      state.error = payload;
      state.resetPasswordLoading = false;
      state.authLoading = false;
    },
    updateProfile: (state, { payload }) =>{
      state.updateProfileLoading = true;
      state.updateProfile = payload;
    },
    updateProfileSuccess: (state, { payload }) => {
      state.updateProfileLoading = false;
      state.user = payload;
      state.localStamina = payload.stamina;
      state.localCoins = payload.coins;
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
      state.userLastPeriodicBatchTime = payload.periodicBatchTime;
    },
    getUserError: (state, { payload }) => {
      state.getUserLoading = false;
    },
    updateDailyLogin: (state) => {
      state.dailyLoginLoading = true;
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
      state.dailyLoginLoading = false;
      state.updatePopupSuccess = true;
      state.isOpenDailyPopup = true;
    },
    updateDailyLoginError: (state, { payload }) => {
      state.dailyLoginLoading = false;
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
    getNewLeaderBoard: (state, { payload }) => {
      state.getNewLeaderBoardLoading = true;
      state.getNewLeaderBoardSuccess = false;
    },
    getNewLeaderBoardSuccess: (state, { payload }) => {
      state.getNewLeaderBoardLoading = false;
      state.newLeaderBoard = payload.leaderboardData;
      state.getNewLeaderBoardSuccess = true;
    },
    getNewLeaderBoardError: (state, { payload }) => {
      state.getNewLeaderBoardLoading = false;
      state.error = payload;
      state.getNewLeaderBoardSuccess = true;
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
      state.snapshotCoins = state.localCoins;
      state.snapshotStamina = state.localStamina;
    },
    settleTapSessionSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      const coinDiff = state.localCoins - state.snapshotCoins;
      const staminaDiff = state.localStamina - state.snapshotStamina;
      state.user = {
        ...currentUser,
        coins: payload.newCoins + coinDiff,
        stamina: payload.newStamina + staminaDiff,
        canGetDepletionReward: payload.canGetDepletionReward
      }
      state.localCoins = payload.newCoins + coinDiff;
      state.localStamina = payload.newStamina + staminaDiff;
      state.settleTapSessionLoading = false;
    },
    settleTapSessionError: (state, { payload }) => {
      // check & handle desync error
      if (payload.error === "too-fast"){
        // reset stamina and coin amt to server values
        state.user.stamina = payload.stamina;
        state.user.coins = payload.coins;

        state.localStamina = payload.stamina;
        state.localCoins = payload.coins;
      }
      state.error = payload;
      state.settleTapSessionLoading = false;
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
          canGetDepletionReward: payload.canGetDepletionReward
        }
      }else if (state.rechargeOpType === StaminaRechargeTypeInvite){
        state.user = {
          ...currentUser,
          stamina: payload.newStamina,
          inviteRechargeRemaining: payload.newRechargeRemaining,
          canGetDepletionReward: payload.canGetDepletionReward
        }
      } 
      state.localStamina = payload.newStamina;
      state.rechargeStaminaLoading = false;
    },
    rechargeStaminaError: (state, { payload }) => {
      state.error = payload;
      state.rechargeStaminaLoading = false;
    },
    getUserLocations: (state, { payload }) => {
      state.userLocationsLoading = true;
    },
    getUserLocationsSuccess: (state, { payload }) => {
      state.userLocations = payload.userLocations;
      state.dailyComboMatched = payload.dailyComboMatched;
      state.userLocationsLoading = false;
    },
    getUserLocationsError: (state, { payload }) => {
      state.userLocations = payload;
      state.userLocationsLoading = false;
    },
    upgradeUserLocation: (state, { payload }) => {
      state.userLocationsLoading = true;
    },
    upgradeUserLocationSuccess: (state, { payload }) => {
      // Ensure the array is empty before setting new values
      state.newlyUnlockedLocations = [];
      state.upgradeUserLocationErrorCode = "";

      // Update explored location details 
      const locationIndex = state.userLocations.findIndex(
        (location) => location.locationId === payload.locationId
      );

      if (locationIndex !== -1) {
        state.userLocations[locationIndex] = {
          ...state.userLocations[locationIndex],
          level: payload.locationLvl,
          currentExploraPts: payload.locationExploraPts,
          nextLevelUpgradeCost: payload.nextLevelUpgradeCost,
          nextLevelExploraPts: payload.nextLevelExploraPts,
        };
      }

      // Update unlocked locations details
      if (payload.unlockedLocations && payload.unlockedLocations.length > 0) {
        payload.unlockedLocations.forEach((unlockedLocation) => {
          const unlockedLocationIndex = state.userLocations.findIndex(
            (location) => location.locationId === unlockedLocation.locationId
          );

          if (unlockedLocationIndex !== -1) {
            // Update the level to 0 for the unlocked location
            state.userLocations[unlockedLocationIndex].level = 0;
            state.userLocations[unlockedLocationIndex].nextLevelUpgradeCost = unlockedLocation.nextLevelUpgradeCosts;
            state.userLocations[unlockedLocationIndex].nextLevelExploraPts = unlockedLocation.nextLevelExploraPoints;

            // Add to newlyUnlockedLocations array
            state.newlyUnlockedLocations.push(unlockedLocation.locationId);
          }
        });
      }

      state.dailyComboMatched = payload.completedDailyCombos;

      // Update user details
      const currentUser = current(state.user);
      state.user = {
        ...currentUser,
        level: payload.updatedUserLvl,
        profitPerHour: payload.updatedExploraPts,
        coins: payload.updatedCoins,
      }
      state.localCoins = payload.updatedCoins;
      state.levelUpCoinReward = payload.levelUpCoinReward;
      state.userLocationsLoading = false;
    },
    upgradeUserLocationError: (state, { payload }) => {
      state.upgradeUserLocationErrorCode = payload;
      state.userLocationsLoading = false;
    },
    getReferralStats: (state, { payload }) => {
      state.referralStatLoading = true;
    },
    getReferralStatsSuccess: (state, { payload }) => {
      state.referralCount = payload.referralCount;
      state.nftPurchasedReferralCount = payload.nftPurchasedReferralCount;
      state.basicClaimable = payload.basicClaimable;
      state.nftClaimable = payload.nftClaimable;
      state.referralStatLoading = false;
    },
    getReferralStatsError: (state, { payload }) => {
      state.error = payload;
      state.referralStatLoading = false;
    },
    bindWallet: (state, { payload }) => {
      state.bindWalletLoading = true;
    },
    bindWalletSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      state.user = {
        ...currentUser,
        walletAddr: payload.walletAddr
      }
      state.bindWalletLoading = false;
    },
    bindWalletError: (state, { payload }) => {
      state.bindWalletLoading = false;
    },
    unbindWallet: (state, { payload }) => {
      state.bindWalletLoading = true;
    },
    unbindWalletSuccess: (state, { payload }) => {
      const currentUser = current(state.user);
      state.user = {
        ...currentUser,
        walletAddr: ''
      }
      state.bindWalletLoading = false;
    },
    unbindWalletError: (state, { payload }) => {
      state.bindWalletLoading = false;
    },
    mintNFT: (state, { payload }) => {
      state.mintingNFT = true;
      state.nftMinted = null;
    },
    mintNFTSuccess: (state, { payload }) => {
      state.nftMinted = payload;
    },
    mintNFTError: (state, { payload }) => {
      state.mintingNFT = false;
    },
    resetMintedNFT: (state, { payload }) => {
      state.nftMinted = null;
      state.mintingNFT = false;
    },
    claimCashback: (state, { payload }) => {
      state.claimCashbackLoading = true;
    },
    claimCashbackSuccess: (state, { payload }) => {
      state.basicClaimable = payload.updatedBasicClaimable;
      state.nftClaimable = payload.updatedNFTClaimable;
      state.claimCashbackLoading = false;
    },
    claimCashbackError: (state, { payload }) => {
      state.claimCashbackLoading = false;
    },
    fetchDates: (state, { payload }) => {
    },
    fetchDatesSuccess: (state, { payload }) => {
      state.mintDate = payload.mint;
      state.lockDate = payload.lock;
      state.earlyBirdDate = payload.earlyBird;
    },
    fetchDatesError: (state, { payload }) => {
    },
    checkUserLastPeriodicBatchTime: (state, { payload }) => {
      state.getUserLastPeriodicBatchTimeLoading = true;
    },
    checkUserLastPeriodicBatchTimeSuccess: (state, { payload }) => {
      state.userLastPeriodicBatchTime = payload.periodicBatchTime;
      state.getUserLastPeriodicBatchTimeLoading = false;
    },
    checkUserLastPeriodicBatchTimeError: (state, { payload }) => {
      state.error = payload;
      state.getUserLastPeriodicBatchTimeLoading = false;
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
  checkLoginWithRedirect,
  checkLoginWithRedirectSuccess,
  checkLoginWithRedirectError,
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
  getNewLeaderBoard,
  getNewLeaderBoardSuccess,
  getNewLeaderBoardError,
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
  updateCompleteOneTimeTaskSuccess,
  getUserLocations,
  getUserLocationsSuccess,
  getUserLocationsError,
  upgradeUserLocation,
  upgradeUserLocationSuccess,
  upgradeUserLocationError,
  getReferralStats,
  getReferralStatsSuccess,
  getReferralStatsError,
  bindWallet,
  bindWalletSuccess,
  bindWalletError,
  unbindWallet,
  unbindWalletSuccess,
  unbindWalletError,
  mintNFT,
  mintNFTSuccess,
  mintNFTError,
  resetMintedNFT,
  claimCashback,
  claimCashbackSuccess,
  claimCashbackError,
  fetchDates,
  fetchDatesSuccess,
  fetchDatesError,
  checkUserLastPeriodicBatchTime,
  checkUserLastPeriodicBatchTimeSuccess,
  checkUserLastPeriodicBatchTimeError,
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
export const useNewLeaderBoardDetails = () => useAppSelector((state) => state.user.newLeaderBoard);
export const useNewLeaderBoardLoading = () => useAppSelector((state) => state.user.getNewLeaderBoardLoading);
export const useNewLeaderBoardLoadSuccess = () => useAppSelector((state) => state.user.getNewLeaderBoardSuccess);
export const useIsOpenDailyPopup = () => useAppSelector((state) => state.user.isOpenDailyPopup);
export const useDailyLoginLoading = () => useAppSelector((state) => state.user.updatePopupLoading);
export const useOneTimeTaskList = () => useAppSelector((state) => state.user.oneTimeTaskList);
export const useTaskIdToComplete = () => useAppSelector((state) => state.user.taskIdToComplete);
export const useOneTimeTaskListSuccess = () => useAppSelector((state) => state.user.getOneTimeTaskListSuccess);
export const useEarlyBirdOneTimeTaskList = () => useAppSelector((state) => state.user.earlyBirdOneTimeTask);
export const useEarlyBirdOneTimeTaskListSuccess = () => useAppSelector((state) => state.user.getEarlyBirdOneTimeTaskListSuccess);
export const useUserAuthenticated = () => useAppSelector((state) => state.user.isAuthenticated);
export const useSettleTapSessionLoading = () => useAppSelector((state) => state.user.settleTapSessionLoading);
export const useLocalCoins = () => useAppSelector((state) => state.user.localCoins);
export const useLocalStamina = () => useAppSelector((state) => state.user.localStamina);
export const useRechargeLoading = () => useAppSelector((state) => state.user.rechargeStaminaLoading);
export const useUserLocation = () => useAppSelector((state) => state.user.userLocations);
export const useUserLocationLoading = () => useAppSelector((state) => state.user.userLocationsLoading);
export const useUpgradeUserLocationError = () => useAppSelector((state) => state.user.upgradeUserLocationErrorCode);
export const useNewlyUnlockedLocations = () => useAppSelector((state) => state.user.newlyUnlockedLocations);
export const useDailyComboMatched = () => useAppSelector((state) => state.user.dailyComboMatched);
export const useReferralStatLoading = () => useAppSelector((state) => state.user.referralStatLoading);
export const useReferralCount = () => useAppSelector((state) => state.user.referralCount);
export const useNFTPurchasedReferralCount = () => useAppSelector((state) => state.user.nftPurchasedReferralCount);
export const useBasicClaimable = () => useAppSelector((state) => state.user.basicClaimable);
export const useNftClaimable = () => useAppSelector((state) => state.user.nftClaimable);
export const useBindWalletLoading = () => useAppSelector((state) => state.user.bindWalletLoading);
export const useMintingNFT = () => useAppSelector((state) => state.user.mintingNFT);
export const useNFTMinted = () => useAppSelector((state) => state.user.nftMinted);
export const useClaimCashbackLoading = () => useAppSelector((state) => state.user.claimCashbackLoading);
export const useMintDate = () => useAppSelector((state) => state.user.mintDate);
export const useLockDate = () => useAppSelector((state) => state.user.lockDate);
export const useEarlyBirdDate = () => useAppSelector((state) => state.user.earlyBirdDate);
export const useLevelUpCoinReward = () => useAppSelector((state) => state.user.levelUpCoinReward);
export const useUserLastPeriodicBatchTimeLoading = () => useAppSelector((state) => state.user.getUserLastPeriodicBatchTimeLoading);
export const useUserLastPeriodicBatchTime = () => useAppSelector((state) => state.user.userLastPeriodicBatchTime);

const userReducer = userSlice.reducer;

export default userReducer;
