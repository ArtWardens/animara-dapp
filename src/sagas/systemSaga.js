import i18n from 'i18next';
import { put, select, takeLatest } from 'redux-saga/effects';

import { toast } from 'react-toastify';
import { systemAddError, systemUpdateNetworkConnection, systemUpdatePageFocus } from '../sagaStore/slices';

export function* updateNetworkConnectionSaga() {
  const isBackOnline = yield select((state) => state.system.networkConnection.backOnline);
  // console.log('why two times');
  try {
    yield put(
      isBackOnline ? toast.success(i18n.t('common:connectionRestored')) : toast.error(i18n.t('common:noConnection')),
    );
    if (isBackOnline) {
      yield put({ type: systemUpdatePageFocus.type, payload: { isActive: true } });
    }
  } catch (error) {
    if (error instanceof Error) {
      yield put(systemAddError(error));
    } else {
      console.error(error);
    }
  }
}

export function* systemSagaWatcher() {
  yield takeLatest(systemUpdateNetworkConnection.type, updateNetworkConnectionSaga);
}
