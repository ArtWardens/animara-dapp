import { all } from 'redux-saga/effects';

import { initSagaTakeEvery } from './initSaga';
import { systemSagaWatcher } from './systemSaga';
import { userSagaWatcher } from './userSaga';

export default function* rootSaga() {
  yield all([systemSagaWatcher(), userSagaWatcher(), initSagaTakeEvery()]);
}
