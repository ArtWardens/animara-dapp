import initReducer from './initSlice';
import systemReducer from './systemSlice';
import userReducer from './userSlice';

export const rootReducers = {
  init: initReducer,
  user: userReducer,
  system: systemReducer,
};
