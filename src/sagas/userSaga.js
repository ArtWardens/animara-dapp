import { toast } from "react-toastify";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  signUpWithEmailImpl,
  getIdTokenResult,
  loginWithEmailImpl,
  loginWithGoogleImpl,
  loginWithTwitterImpl,
  loginWithTelegramImpl,
  resetPasswordImpl,
  checkLoginWithRedirectImpl,
  logoutImpl,
  getCurrentUserIdImpl,
} from "../firebase/auth";
import {
  updateUserProfileImpl,
  getUserDataImpl,
  dailyLoginImpl,
  getReferralStatsImpl,
  registerNFTImpl,
} from "../firebase/user";
import { handleGetLeaderboard, getLeaderboardImpl } from "../firebase/leaderboard";
import {
  handleGetOneTimeTaskList,
  handleCompletedOneTimeTask,
} from "../firebase/oneTimeTask";
import {
  checkUserLastPeriodicBatchTimeImpl,
} from "../firebase/periodicTask";
import {
  settleTapSessionImpl,
  rechargeEnergyImpl,
  rechargeEnergyByInviteImpl,
  getUserLocationImpl,
  upgradeUserLocationImpl,
  bindWalletImpl,
  unbindWalletImpl,
} from '../firebase/clicker';
import {
  claimCashbackImpl,
  cancelCashbackClaimImpl,
} from '../firebase/cashback.js'
import {
  closeDailyPopup,
  closeDailyPopupSuccess,
  getEarlyBirdOneTimeTaskList,
  getEarlyBirdOneTimeTaskListError,
  getEarlyBirdOneTimeTaskListSuccess,
  getLeaderBoard,
  getLeaderBoardError,
  getLeaderBoardSuccess,
  getNewLeaderBoard,
  getNewLeaderBoardError,
  getNewLeaderBoardSuccess,
  getOneTimeTaskList,
  getOneTimeTaskListError,
  getOneTimeTaskListSuccess,
  getUser,
  getUserError,
  getUserSuccess,
  resetPassword,
  resetPasswordSuccess,
  resetPasswordError,
  logOut,
  logOutSuccess,
  logOutError,
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
  completeOneTimeTask,
  completeOneTimeTaskSuccess,
  completeOneTimeTaskError,
  updateDailyLogin,
  updateDailyLoginSuccess,
  updateDailyLoginError,
  signupWithEmail,
  signupWithEmailSuccess,
  signupWithEmailError,
  loginWithTelegram,
  loginWithTelegramSuccess,
  loginWithTelegramError,
  updateProfile,
  updateProfileSuccess,
  updateProfileError,
  consumeStamina,
  settleTapSession,
  settleTapSessionSuccess,
  settleTapSessionError,
  rechargeStamina,
  rechargeStaminaSuccess,
  rechargeStaminaError,
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
  claimCashback,
  claimCashbackSuccess,
  claimCashbackError,
  fetchDates,
  fetchDatesSuccess,
  fetchDatesError,
  checkUserLastPeriodicBatchTime,
  checkUserLastPeriodicBatchTimeSuccess,
  checkUserLastPeriodicBatchTimeError,
} from "../sagaStore/slices";
import {
  StaminaRechargeTypeBasic,
  StaminaRechargeTypeInvite,
} from "../utils/constants"
import {
  calculateCountdownRemaining,
  getCooldownTime,
  setCooldownTime,
  setDashboardData,
} from "../utils/getTimeRemaining";
import { mintImpl, fetchMintedNFTImpl } from "../web3/mintNFT.tsx";
import { finalizeCashbackTxnImpl } from "../web3/claimCashback.js";
import { fetchAllDatesImpl } from "../firebase/countDown.js";

export function* signupWithEmailSaga({ payload }) {
  try {
    const { email, password, username, referralCode } = payload;
    const result = yield call(
      signUpWithEmailImpl,
      email,
      password,
      username,
      referralCode
    );
    switch (result) {
      case 1:
        yield put(signupWithEmailSuccess());
        toast.success("Signup Successful");
        // redirect to page saying check verification email
        break;
      case -1:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("Please provide your info");
        break;
      case -2:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("Invalid Referral Code");
        break;
      case -3:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("Invalid referral code");
        break;
      case -4:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("Registration failed. Please try again");
        break;
      case -5:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("Failed to send verification email. Please try again later.");
        break;
      case -6:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("Another user has registered from this IP address.");
        break;
      case -7:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("An account with this email already exists. Try log in instead.");
        break;
      default:
        yield put(signupWithEmailError("Error signing up"));
        toast.error("Unexpected error occured");
        break;
    }
  } catch (error) {
    yield put(signupWithEmailError(error));
    toast.error("Unexpected error occured");
  }
}

export function* loginWithEmailSaga({ payload }) {
  try {
    const result = yield call(loginWithEmailImpl, payload);
    if (result?.uid) {
      const token = yield call(getIdTokenResult, result);
      if (
        !result.emailVerified ||
        token.claims.limitedAccess === true
      ) {
        //redirect user to login page
        window.location.href = '/limited-access';  
        return;
      }
      const userData = yield call(getUserDataImpl, result.uid);
      yield put(loginWithEmailSuccess(userData));

      toast.success("Signed in");
    } else if (result === -1){
      toast.error("Invalid login credentials. Please try again.");
      yield put(loginWithEmailError("Invalid login credentials"));
    }else{
      yield put(loginWithEmailError("invalid uid"));
      console.error("invalid uid");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error signing in");
    yield put(loginWithEmailError(error));
  }
}

export function* loginWithGoogleSaga() {
  try {
    const user = yield call(loginWithGoogleImpl);
    if (user?.uid) {
      const userData = yield call(getUserDataImpl, user.uid);
      yield put(loginWithGoogleSuccess(userData));
      toast.success("Signed in with Google");
    } else {
      yield put(loginWithGoogleError("failed to sign in with Google"));
      console.error("failed to sign in with Google");
    }
  } catch (error) {
    toast.error("failed to sign in with Google");
    yield put(loginWithGoogleError(error));
  }
}

export function* loginWithTwitterSaga() {
  try {
    const user = yield call(loginWithTwitterImpl);
    if (user?.uid) {
      const userData = yield call(getUserDataImpl, user.uid);
      yield put(loginWithTwitterSuccess(userData));
      toast.success("Signed in with Twitter");
    } else {
      yield put(loginWithTwitterError("failed to sign in with Twitter"));
      console.error("failed to sign in with Twitter");
    }
  } catch (error) {
    console.error(error);
    if (error.code === 'auth/account-exists-with-different-credential') {
      toast.error("Account linked with Google, please Login with Google instead");
    } else {
      toast.error("Failed to sign in with Twitter");
    }
    yield put(loginWithTwitterError(error));
  }
}

export function* loginWithTelegramSaga(telegramUser) {
  try {
    const user = yield call(loginWithTelegramImpl, telegramUser);
    if (user?.uid) {
      const userData = yield call(getUserDataImpl, user.uid);
      yield put(loginWithTelegramSuccess(userData));
      toast.success("Signed in with Telegram");
    } else {
      yield put(loginWithTelegramError("failed to sign in with Telegram"));
      console.error("failed to sign in with Telegram");
    }
  } catch (error) {
    toast.error("Failed to sign in with Telegram");
    yield put(loginWithTelegramError(error));
  }
}

export function* checkLoginWithRedirectSaga() {
  try {
    const IsLoggedIn = yield call(checkLoginWithRedirectImpl);
    if (IsLoggedIn){
      yield put(checkLoginWithRedirectSuccess());
    }else{
      yield put(checkLoginWithRedirectError());
    }
  } catch (error) {
    yield put(checkLoginWithRedirectError(error));
  }
}

export function* resetPasswordSaga({ payload }) {
  try {
    const email = payload.email; 
    const result = yield call(resetPasswordImpl, email);
    if (result) {
      yield put(resetPasswordSuccess());
      toast.success("Password reset email sent successfully");
    } else {
      throw new Error("Failed to reset password");
    }
  } catch (error) {
    toast.error("Failed to reset password");
    yield put(resetPasswordError(error));
  }
}

export function* updateUserProfileSaga({ payload }) {
  try {
    const { fullName, inviteCode, phoneNumber, profilePicture } = payload;
    const result = yield call(updateUserProfileImpl, fullName, inviteCode, phoneNumber, profilePicture);
    yield put(updateProfileSuccess(result));
    toast.success("Profile updated successfully");

  } catch (error) {
    toast.error("failed to update profile");
    yield put(updateProfileError(error));
    toast.error("Failed to update profile. Please try again");
    console.log(error);
  }
}

export function* getUserSaga() {
  try{
    const uid = getCurrentUserIdImpl();
    const userData = yield call(getUserDataImpl, uid);
    yield put(getUserSuccess(userData));
  } catch (error){
    yield put(getUserError(error));
  }
}

export function* updateDailyLoginSaga() {
  try {
    const dailyLoginResult = yield call(dailyLoginImpl);
    yield put(updateDailyLoginSuccess(dailyLoginResult));
  } catch (error) {
    console.log("Failed to daily login with error: ", error);
    yield put (updateDailyLoginError(error));
  }
}

export function* getNewLeaderBoardSaga() {
  try {
    const leaderboardData = yield call(getLeaderboardImpl);
    yield put(getNewLeaderBoardSuccess(leaderboardData));
    return leaderboardData;
  } catch (error) {
    yield put(getNewLeaderBoardError(error));
    toast.error("Failed to retrieve leaderboard. Please try again. ");
  }
}

// OLD LEADERBOARD BACKUP
export function* getLeaderBoardSaga(action) {
  const cooldownEndTime = getCooldownTime();
  if (calculateCountdownRemaining(cooldownEndTime) !== 0) {
    const dashboardData = yield call(handleGetLeaderboard, action.payload);
    yield put(getLeaderBoardSuccess(dashboardData));
    // Retrieve data every 30 seconds
  } else {
    try {
      const newCooldownEndTime = new Date();
      newCooldownEndTime.setSeconds(newCooldownEndTime.getSeconds() + 30);
      setCooldownTime(newCooldownEndTime);
      const dashboardData = yield call(handleGetLeaderboard, action.payload);
      setDashboardData(dashboardData);
      yield put(getLeaderBoardSuccess(dashboardData));
    } catch (error) {
      console.error("Error retrieving leaderboard: ", error);
      yield put(getLeaderBoardError(error));
    }
  }
}

export function* getOneTimeTaskListSaga() {
  try {
    const taskList = yield call(handleGetOneTimeTaskList, null);
    const filterOneTimeTask = taskList?.filter((item) => item?.taskType === "normal")
    yield put(getOneTimeTaskListSuccess(filterOneTimeTask));
  } catch (error) {
    console.error('Error retrieving oneTimeTaskList: ', error);
    yield put(getOneTimeTaskListError(error));
  }
}

export function* getEarlyBirdOneTimeTaskListSaga() {
  try {
    const taskList = yield call(handleGetOneTimeTaskList);
    const filterOneTimeTask = taskList?.filter((item) => item?.taskType === "earlybird")
    yield put(getEarlyBirdOneTimeTaskListSuccess(filterOneTimeTask));
  } catch (error) {
    console.error('Error retrieving earlyBirdOneTimeTaskList: ', error);
    yield put(getEarlyBirdOneTimeTaskListError(error));
  }
}

export function* updateOneTimeTaskSaga({ payload }) {
  try {
    const result = yield call(handleCompletedOneTimeTask, payload.taskId);
    yield put(completeOneTimeTaskSuccess(result));
  } catch (error) {
    console.error('Error completing one time task: ', error);
    yield put(completeOneTimeTaskError(error));
  }
}

export function* logOutSaga() {
  try{
    console.log(`saga logging out`);
    yield call(logoutImpl);
    console.log(`saga logged out`);
    yield put(logOutSuccess());
  }catch (error){
    yield put(logOutError(error));
  }
}

export function* closeDailyPopupSaga() {
  yield put(closeDailyPopupSuccess());
}

export function* consumeStaminaSaga(){
  // empty
}

export function* settleTapSessionSaga({ payload }) {
  try{
    const result = yield call(settleTapSessionImpl, payload);
    yield put(settleTapSessionSuccess(result));
  }catch (error){
    // to localize
    toast.error('Failed to sync game progress');
    yield put(settleTapSessionError(error));
  }
}

export function* rechargeStaminaSaga({ payload }) {
  try{
    let result;
    const opType = payload.opType;
    if (opType === StaminaRechargeTypeBasic){
      result = yield call(rechargeEnergyImpl);
    }else if (opType === StaminaRechargeTypeInvite){
      result = yield call(rechargeEnergyByInviteImpl);
    }else{
      yield put(rechargeStaminaError({ message: 'invalid-regcharge-type'}));
    }
    yield put(rechargeStaminaSuccess(result));
  }catch (error){
    // to localize
    if (error === 'insufficient-recharge'){
      toast.error('Out of recharge');
    }else{
      toast.error('Failed to Recharge Stamina');
    }
    yield put(rechargeStaminaError(error));
  }
}

export function* upgradeUserLocationsSaga(locationId) {
  try {
    const upgradeUserLocation = yield call(upgradeUserLocationImpl, locationId);   
    yield put(upgradeUserLocationSuccess(upgradeUserLocation));
    toast.success("Location level upgraded successfully. ");
  } 
  catch (error) {
    if (error === "insufficient-funds") {
      toast.error(
        "Insufficient coins owned to upgrade this location. "
      );
    } 
    else if (error === "location-max-level") {
      toast.error(
        "Max level reached for this location. "
      );
    } 
    else {
      toast.error("Failed to upgrade location. Please try again. ");
    }
    yield put(upgradeUserLocationError(error));
  }
}

export function* getUserLocationsSaga() {
  try {
    const userLocation = yield call(getUserLocationImpl);
    yield put(getUserLocationsSuccess(userLocation));
    return userLocation;
  } 
  catch (error) {
    yield put(getUserLocationsError(error));
    toast.error("Failed to load location. Please try again. ");
  }
}

export function* getReferralStatsSaga() {
  try {
    const referralStats = yield call(getReferralStatsImpl);
    if (referralStats) {
      yield put(getReferralStatsSuccess(referralStats));
    } else {
      yield put(getReferralStatsError("Failed to get referral stats. Please try again."));
    }
  } catch (error) {
    yield put(getReferralStatsError(error));
  }
}

export function* bindWalletSaga({ payload }) {
  try {
    const result = yield call(bindWalletImpl, payload);
    if (result) {
      yield put(bindWalletSuccess(result));
    } else {
      yield put(
        bindWalletError("Failed to connect wallet. Please try again.")
      );
    }
  } catch (error) {
    yield put(bindWalletError(error));
  }
}

export function* unbindWalletSaga() {
  try {
    const result = yield call(unbindWalletImpl);
    if (result) {
      yield put(unbindWalletSuccess(result));
    } else {
      yield put(
        unbindWalletError("Failed to connect wallet. Please try again.")
      );
    }
  } catch (error) {
    yield put(unbindWalletError(error));
  }
}

export function* mintNFTSaga({ payload }) {
  try {
    const successfulMints = yield call(mintImpl, 
      payload.umi,
      payload.buttonGuard,
      payload.candyMachine,
      payload.candyGuard,
      payload.ownedTokens,
      payload.guards
    );
    const result = yield call(fetchMintedNFTImpl, payload.umi, successfulMints);
    // const result = [
    //   {
    //     "mint":"HqCnQZrEM8gNtLJ4azavUp4kHfMX46mHeiUxeGoQ5aMH",
    //     "offChainMetadata":{
    //       "name":"NFT Name #{ID}",
    //       "symbol":"NFT",
    //       "description":"NFT collection description",
    //       "image":"https://pentajeucms-bucket.s3.ap-southeast-1.amazonaws.com/test/animara/images/0.png",
    //       "attributes":[
    //         {
    //           "trait_type":"Background",
    //           "value":"Black"
    //         },
    //         {
    //           "trait_type":"Rarity",
    //           "value":"Normal"
    //         }
    //       ],
    //       "properties":{
    //         "files":[
    //           {
    //             "uri":"https://pentajeucms-bucket.s3.ap-southeast-1.amazonaws.com/test/animara/images/0.png",
    //             "type":"image/png"
    //           }
    //         ],
    //         "category":null
    //       }
    //     }
    //   }
    // ]
    yield call(registerNFTImpl);
    yield put(mintNFTSuccess(result[0]));
  } catch (error) {
    yield put(mintNFTError(error));
  }
}

export function* claimCashbackSaga({ payload }) {
  let claimId;
  try {
    const result = yield call(claimCashbackImpl);
    const serializedTxn = result.serializedTxn;
    claimId = result.claimId;
    const finalizationResult = yield call(finalizeCashbackTxnImpl, payload.sendTransaction, serializedTxn, process.env.REACT_APP_RPC_TIMEOUT);
    if (finalizationResult){
      toast.success('Cashback claimed successfully!');
      yield put(claimCashbackSuccess(result));
    }else{
      toast.warn('Cashback claimed! It may take some time to reflect in your wallet.');
      yield put(claimCashbackSuccess({updatedBasicClaimable: 0, updatedNFTClaimable: 0}));
    }
  } catch (error) {
    if (error === "external-error"){
      toast.error('Cashback claim not avaiable at the moment. Try again later');
    } else if (error.error?.code === 4001) {
      // this error happens when user cancels transaction
      toast.warn('Claim cancelled');
    } else if (error.error?.code === -32603) {
      // this error happens when user do not have enough sol to submit transaction
      toast.warn('Insufficient SOL to send transaction');
    } else {
      toast.error('Failed to claim cashback');
    }
    // cancel claim in db if already created
    if (claimId){
      console.log(`cancelling cashback`);
      yield call(cancelCashbackClaimImpl, claimId);
    }
    yield put(claimCashbackError(error));
  }
}

export function* fetchDatesSaga() {
  try {
    console.log(`fetchDatesSaga`);
    const dates = yield call(fetchAllDatesImpl);
    yield put(fetchDatesSuccess(dates));
  } catch (error) {
    toast.error("Failed to fetch dates");
    yield put(fetchDatesError(error));
  }
}

export function* checkUserLastPeriodicBatchTimeSaga() {
  try {
    const userBatchTime = yield call(checkUserLastPeriodicBatchTimeImpl);
    yield put(checkUserLastPeriodicBatchTimeSuccess(userBatchTime));
    return userBatchTime;
  } 
  catch (error) {
    yield put(checkUserLastPeriodicBatchTimeError(error));
    toast.error("Failed to check user batch time. Please try again. ");
  }
}

export function* userSagaWatcher() {
  yield takeLatest(signupWithEmail.type, signupWithEmailSaga);
  yield takeLatest(loginWithEmail.type, loginWithEmailSaga);
  yield takeLatest(loginWithGoogle.type, loginWithGoogleSaga);
  yield takeLatest(loginWithTwitter.type, loginWithTwitterSaga);
  yield takeLatest(loginWithTelegram.type, loginWithTelegramSaga);
  yield takeLatest(resetPassword.type, resetPasswordSaga);
  yield takeLatest(checkLoginWithRedirect.type, checkLoginWithRedirectSaga);
  yield takeLatest(getUser.type, getUserSaga);
  yield takeLatest(logOut.type, logOutSaga);
  yield takeLatest(updateDailyLogin.type, updateDailyLoginSaga);
  yield takeLatest(getLeaderBoard.type, getLeaderBoardSaga);
  yield takeLatest(getNewLeaderBoard.type, getNewLeaderBoardSaga);
  yield takeLatest(closeDailyPopup.type, closeDailyPopupSaga);
  yield takeLatest(getOneTimeTaskList.type, getOneTimeTaskListSaga);
  yield takeLatest(getEarlyBirdOneTimeTaskList.type, getEarlyBirdOneTimeTaskListSaga);
  yield takeLatest(completeOneTimeTask.type, updateOneTimeTaskSaga);
  yield takeLatest(updateProfile.type, updateUserProfileSaga);
  yield takeLatest(consumeStamina.type, consumeStaminaSaga);
  yield takeLatest(settleTapSession.type, settleTapSessionSaga);
  yield takeLatest(rechargeStamina.type, rechargeStaminaSaga);
  yield takeLatest(getUserLocations.type, getUserLocationsSaga);
  yield takeLatest(upgradeUserLocation.type, upgradeUserLocationsSaga);
  yield takeLatest(getReferralStats.type, getReferralStatsSaga);
  yield takeLatest(bindWallet.type, bindWalletSaga);
  yield takeLatest(unbindWallet.type, unbindWalletSaga);
  yield takeLatest(mintNFT.type, mintNFTSaga);
  yield takeLatest(claimCashback.type, claimCashbackSaga);
  yield takeLatest(fetchDates.type, fetchDatesSaga);
  yield takeLatest(checkUserLastPeriodicBatchTime.type, checkUserLastPeriodicBatchTimeSaga);
}
