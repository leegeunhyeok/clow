import React from 'react';
import ReactDOM from 'react-dom';
import confitureStore from 'src/store';
import App from './App';
import './index.scss';
import * as serviceWorker from 'src/serviceWorker';
import { Provider } from 'react-redux';

const store = confitureStore();

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
