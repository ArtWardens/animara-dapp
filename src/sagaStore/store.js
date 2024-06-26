import { combineReducers, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootReducers } from './slices';

export const reducers = rootReducers;

export const createDynamicReducer = (asyncReducers = {}) => {
  return combineReducers({
    ...asyncReducers,
    ...reducers,
  });
};

export const reducer = combineReducers(reducers);

const sagaMiddleware = createSagaMiddleware();

const initStore = () => {
  const store = configureStore({
    reducer: createDynamicReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        thunk: false,
      }).concat(sagaMiddleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

  store.asyncReducers = {};
  store.injectReducer = (key, reducer) => {
    store.asyncReducers[key] = reducer;
    store.replaceReducer(createDynamicReducer(store.asyncReducers));
    return store;
  };

  return store;
};

export const store = initStore();

export const runSaga = sagaMiddleware.run;
