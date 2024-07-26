import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import './assets/globals.css';
import reportWebVitals from './reportWebVitals';
import { store } from './sagaStore/store';
// import { ClickerController } from './components/ClickerController';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
    {/* <ClickerController /> */}
  </Provider>,
);

reportWebVitals();
