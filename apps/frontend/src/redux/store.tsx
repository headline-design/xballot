import initializers from './initializers';
import { configureStore } from '@reduxjs/toolkit';
import { PreloadedState, Store } from 'redux';
import logger from 'redux-logger';
import auth from './auth/authReducers';
import algorand from './algorand/algorandReducers';
import application from './application/applicationReducers';
import loaders from './ui/loaders';
import theme from './ui/theme';
import global from './global/global';
import user from './user/userReducers';

let store: Store;

export function configureReduxStores(preloadedState?: PreloadedState<any>) {
  const reducer = {
    auth: auth,
    algorand: algorand,
    loaders: loaders,
    user: user,
    application: application,
    theme: theme,
    global: global,
  };
  store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      process.env.NODE_ENV !== 'production'
        ? getDefaultMiddleware().concat(logger)
        : getDefaultMiddleware(),
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState,
  });

  for (const initializer of initializers) {
    initializer(store);
  }

  return store;
}

export default function getStore() {
  return store;
}

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
