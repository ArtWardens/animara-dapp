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
  logoutImpl,
  getCurrentUserIdImpl,
} from "../firebase/auth";
import {
  updateUserProfileImpl,
  getUserDataImpl,
  dailyLoginImpl,
  getReferralStatsImpl,
} from "../firebase/user";
import { handleGetLeaderboard } from "../firebase/leaderboard";
import {
  handleGetOneTimeTaskList,
  handleCompletedOneTimeTask,
} from "../firebase/oneTimeTask";
import {
  settleTapSessionImpl,
  rechargeEnergyImpl,
  rechargeEnergyByInviteImpl,
  getUserLocationImpl,
  upgradeUserLocationImpl,
} from '../firebase/clicker';
import {
  closeDailyPopup,
  closeDailyPopupSuccess,
  getEarlyBirdOneTimeTaskList,
  getEarlyBirdOneTimeTaskListError,
  getEarlyBirdOneTimeTaskListSuccess,
  getLeaderBoard,
  getLeaderBoardError,
  getLeaderBoardSuccess,
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

export function* signupWithEmailSaga({ payload }) {
  try {
    const { email, password, name, referralCode } = payload;
    const result = yield call(
      signUpWithEmailImpl,
      email,
      password,
      name,
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
        toast.error("Another user has registered from this address.");
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
    const user = yield call(loginWithEmailImpl, payload);
    if (user?.uid) {
      const token = yield call(getIdTokenResult, user);
      if (
        !user.emailVerified ||
        token.claims.limitedAccess === true
      ) {
        //redirect user to login page
        window.location.href = '/limited-access';  
        return;
      }
      const userData = yield call(getUserDataImpl, user.uid);
      yield put(loginWithEmailSuccess(userData));

      toast.success("Signed in");
    } else {
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

export function* resetPasswordSaga(action) {
  try {
    const email = action.payload; 
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
    // toast.error("failed to edit profile");
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
    toast.success("Location level loaded successfully. ");
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
      yield put(
        getReferralStatsError("Failed to get referral stats. Please try again. ")
      );
    }
  } catch (error) {
    yield put(getReferralStatsSuccess(error));
  }
}

export function* userSagaWatcher() {
  yield takeLatest(signupWithEmail.type, signupWithEmailSaga);
  yield takeLatest(loginWithEmail.type, loginWithEmailSaga);
  yield takeLatest(loginWithGoogle.type, loginWithGoogleSaga);
  yield takeLatest(loginWithTwitter.type, loginWithTwitterSaga);
  yield takeLatest(loginWithTelegram.type, loginWithTelegramSaga);
  yield takeLatest(resetPassword.type, resetPasswordSaga);
  yield takeLatest(getUser.type, getUserSaga);
  yield takeLatest(logOut.type, logOutSaga);
  yield takeLatest(updateDailyLogin.type, updateDailyLoginSaga);
  yield takeLatest(getLeaderBoard.type, getLeaderBoardSaga);
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
}
