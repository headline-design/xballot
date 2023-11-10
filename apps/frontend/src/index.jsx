import React from 'react';
import { createRoot } from 'react-dom/client';
import { configureReduxStores } from './redux/store';
import { Provider } from 'react-redux';
import AppProvider from 'AppProvider';

const store = configureReduxStores();

const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProvider />
    </Provider>
  </React.StrictMode>,
);
