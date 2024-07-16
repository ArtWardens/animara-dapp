import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';
import { auth } from '../firebase/firebaseConfig';
import { handleGetUserData, handleUpdateDailyLogin } from '../firebase/user';
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
  logOut,
  logOutSuccess,
  login,
  loginError,
  loginSuccess,
  updateCompleteOneTimeTask,
  updateCompleteOneTimeTaskSuccess,
  updateDailyLogin,
  updateDailyLoginSuccess,
} from '../sagaStore/slices';
import {
  calculateCountdownRemaining,
  getCooldownTime,
  setCooldownTime,
  setDashboardData,
} from '../utils/getTimeRemaining';
import { addToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../utils/localStorage';
import { handleGetLeaderboard } from '../firebase/leaderboard';
import { handleGetOneTimeTaskList, handleUpdateCompletedTask } from '../firebase/oneTimeTask';

export function* loginSaga({ payload }) {
  try {
    const { email, password } = payload;
    const data = yield call(signInWithEmailAndPassword, auth, email, password);
    if (data.user.uid) {
      addToLocalStorage('userId', data.user.uid);
      const userData = yield call(handleGetUserData, data.user.uid);
      yield put(loginSuccess(userData));
      toast.success('Signed in');
    } else {
      yield put(loginError('invalid uid'));
      console.error('invalid uid');
    }
  } catch (error) {
    console.error(error);
    toast.error('Error signing in');
    yield put(loginError(error));
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
  yield takeLatest(login.type, loginSaga);
  yield takeLatest(getUser.type, getUserSaga);
  yield takeLatest(logOut.type, logOutSaga);
  yield takeLatest(updateDailyLogin.type, updateDailyLoginSaga);
  yield takeLatest(getLeaderBoard.type, getLeaderBoardSaga);
  yield takeLatest(closeDailyPopup.type, closeDailyPopupSaga);
  yield takeLatest(getOneTimeTaskList.type, getOneTimeTaskListSaga);
  yield takeLatest(updateCompleteOneTimeTask.type, updateCompleteOneTimeTaskSaga);
}
