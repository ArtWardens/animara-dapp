import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { store } from './sagaStore/store';
import reportWebVitals from './reportWebVitals';
import './globals.css';
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <React.Suspense fallback="loading">
    <App />
    </React.Suspense>
  </Provider>,
);

reportWebVitals();
