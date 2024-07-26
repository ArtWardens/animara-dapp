import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import {
  signUpWithEmailImpl,
  loginWithEmailImpl,
  loginWithGoogleImpl,
  loginWithTwitterImpl,
  resetPasswordImpl,
} from "../firebase/auth";
import { updateUserProfileImpl, handleGetUserData, handleUpdateDailyLogin } from '../firebase/user';
import { handleGetLeaderboard } from '../firebase/leaderboard';
import { handleGetOneTimeTaskList, handleUpdateCompletedTask } from '../firebase/oneTimeTask';
import {
  closeDailyPopup,
  closeDailyPopupSuccess,
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
  loginWithEmail,
  loginWithEmailSuccess,
  loginWithEmailError,
  loginWithGoogle,
  loginWithGoogleSuccess,
  loginWithGoogleError,
  loginWithTwitter,
  loginWithTwitterSuccess,
  loginWithTwitterError,
  updateCompleteOneTimeTask,
  updateCompleteOneTimeTaskSuccess,
  updateDailyLogin,
  updateDailyLoginSuccess,
  signupWithEmail,
  signupWithEmailSuccess,
  signupWithEmailError,
} from '../sagaStore/slices';
import {
  calculateCountdownRemaining,
  getCooldownTime,
  setCooldownTime,
  setDashboardData,
} from '../utils/getTimeRemaining';
import { addToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../utils/localStorage';

export function* signupWithEmailSaga({ payload }) {
  try {
    const { email, password, name, referralCode } = payload;
    const result = yield call(signUpWithEmailImpl, email, password, name, referralCode);
    switch (result){
      case 1:
        yield put(signupWithEmailSuccess());
        toast.success('Signup Successful');
        break;
      case -1:
        yield put(signupWithEmailError('Error signing up'));
        toast.error('Please provide your info');
        break;
      case -2:
        yield put(signupWithEmailError('Error signing up'));
        toast.error('Invalid Referral Code');
        break;
      default:
        yield put(signupWithEmailError('Error signing up'));
        toast.error('Unexpected error occured');
        break;
    }
  } catch (error) {
    yield put(signupWithEmailError(error));
    toast.error('Unexpected error occured');
  }
}

export function* loginWithEmailSaga({ payload }) {
  try {
    const user = yield call(loginWithEmailImpl, payload);
    if (user?.uid) {
      addToLocalStorage('userId', user.uid);
      const userData = yield call(handleGetUserData, user.uid);
      yield put(loginWithEmailSuccess(userData));
      toast.success('Signed in');
    } else {
      yield put(loginWithEmailError('invalid uid'));
      console.error('invalid uid');
    }
  } catch (error) {
    console.error(error);
    toast.error('Error signing in');
    yield put(loginWithEmailError(error));
  }
}

export function* loginWithGoogleSaga() {
  try {
    const user = yield call(loginWithGoogleImpl);
    if (user?.uid) {
      addToLocalStorage('userId', user.uid);
      const userData = yield call(handleGetUserData, user.uid);
      yield put(loginWithGoogleSuccess(userData));
      toast.success('Signed in with Google');
    } else {
      yield put(loginWithGoogleError('failed to sign in with Google'));
      console.error('failed to sign in with Google');
    }
  } catch (error) {
    console.error(error);
    toast.error('failed to sign in with Google');
    yield put(loginWithGoogleError(error));
  }
}

export function* loginWithTwitterSaga() {
  try {
    const user = yield call(loginWithTwitterImpl);
    if (user?.uid) {
      addToLocalStorage('userId', user.uid);
      const userData = yield call(handleGetUserData, user.uid);
      yield put(loginWithTwitterSuccess(userData));
      toast.success('Signed in with Twitter');
    } else {
      yield put(loginWithTwitterError('failed to sign in with Twitter'));
      console.error('failed to sign in with Twitter');
    }
  } catch (error) {
    console.error(error);
    toast.error('failed to sign in with Twitter');
    yield put(loginWithTwitterError(error));
  }
}

export function* resetPasswordSaga() {
  try {
    yield call(resetPasswordImpl);
    yield put(resetPasswordSuccess());

  } catch (error) {
    toast.error('failed to reset password');
    yield put(resetPasswordError(error));
  }
}

export function* updateUserProfileSaga({ payload }) {
  try {
    const { fulllName, inviteCode, photoString } = payload;
    yield call(updateUserProfileImpl, fulllName, inviteCode, photoString);
    yield put(resetPasswordSuccess());
  } catch (error) {
    toast.error('failed to reset password');
    yield put(resetPasswordError(error));
  }
}

export function* getUserSaga() {
  const userId = getFromLocalStorage('userId');
  if (userId) {
    addToLocalStorage('userId', userId);
    const userData = yield call(handleGetUserData, userId);
    yield put(getUserSuccess(userData));
  } else {
    yield put(getUserError(null));
  }
}

export function* updateDailyLoginSaga(action) {
  const data = action.payload.data;
  try {
    yield call(handleUpdateDailyLogin, data);
    yield put(updateDailyLoginSuccess(data));
  } catch (error) {
    console.log('Error setting user data: ', error);
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
      console.error('Error retrieving leaderboard: ', error);
      yield put(getLeaderBoardError(error));
    }
  }
}

export function* getOneTimeTaskListSaga() {
  try {
    const taskList = yield call(handleGetOneTimeTaskList, null);
    yield put(getOneTimeTaskListSuccess(taskList));
  } catch (error) {
    console.error('Error retrieving oneTimeTaskList: ', error);
    yield put(getOneTimeTaskListError(error));
  }
}

export function* updateCompleteOneTimeTaskSaga(action) {
  try {
    yield call(handleUpdateCompletedTask, action.payload);
    yield put(updateCompleteOneTimeTaskSuccess(action.payload));
  } catch (error) {
    console.error('Error updating oneTimeTaskList: ', error);
  }
}

export function* logOutSaga() {
  removeFromLocalStorage('userId');
  yield put(logOutSuccess(null));
}

export function* closeDailyPopupSaga() {
  yield put(closeDailyPopupSuccess());
}

export function* userSagaWatcher() {
  yield takeLatest(signupWithEmail.type, signupWithEmailSaga);
  yield takeLatest(loginWithEmail.type, loginWithEmailSaga);
  yield takeLatest(loginWithGoogle.type, loginWithGoogleSaga);
  yield takeLatest(loginWithTwitter.type, loginWithTwitterSaga);
  // yield takeLatest(loginWithTelegram.type, loginWithTelegramSaga);
  yield takeLatest(resetPassword.type, resetPasswordSaga);
  yield takeLatest(getUser.type, getUserSaga);
  yield takeLatest(logOut.type, logOutSaga);
  yield takeLatest(updateDailyLogin.type, updateDailyLoginSaga);
  yield takeLatest(getLeaderBoard.type, getLeaderBoardSaga);
  yield takeLatest(closeDailyPopup.type, closeDailyPopupSaga);
  yield takeLatest(getOneTimeTaskList.type, getOneTimeTaskListSaga);
  yield takeLatest(updateCompleteOneTimeTask.type, updateCompleteOneTimeTaskSaga);
}
