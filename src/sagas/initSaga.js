import { takeLatest } from 'redux-saga/effects';
import { appInit } from '../sagaStore/slices';
import { initData } from '../utils/localStorage';

function* initSaga() {
  console.log('2?');
  if (!initData.getItem()) {
    try {
      const detectTimeZone = () => {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      };
      const initializeInit = {
        timeZone: detectTimeZone(),
        displayMode: 'light',
        userId: null,
        language: 'en',
      };
      yield initData.setItem(initializeInit);
    } catch (e) {
      console.error(e);
    }
  }
}

export function* initSagaTakeEvery() {
  yield takeLatest(appInit.type, initSaga);
}
