import { call, put, select, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { logOut, login, loginSuccess, getUser, getUserSuccess, getUserError, logOutSuccess } from '../sagaStore/slices';
import { addToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from '../utils/localStorage';
import { handleSignIn } from '../firebase/auth';
import { handleGetUserData } from '../firebase/user';

export function* loginSaga({ payload }) {
    const { email, password } = payload;
    const data = yield call(handleSignIn, { email, password });
    if(data.uid){
        addToLocalStorage("userId", data.uid);
        const userData = yield call(handleGetUserData, data.uid);
        yield put(loginSuccess(userData));
    };
}

export function* getUserSaga() {
    const userId = getFromLocalStorage("userId");
    if(userId){
        addToLocalStorage("userId", userId);
        const userData = yield call(handleGetUserData, userId);
        yield put(getUserSuccess(userData));
    }else{
        yield put(getUserError(null));
    }
}

export function* logOutSaga() {
    removeFromLocalStorage("userId");
    yield put(logOutSuccess(null));
}

export function* userSagaWatcher() {
    yield takeLatest(login.type, loginSaga);
    yield takeLatest(getUser.type, getUserSaga);
    yield takeLatest(logOut.type, logOutSaga);
}