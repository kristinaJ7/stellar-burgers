/*import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './services/store';
import App from './components/app/app';

const root = ReactDOM.createRoot(document.getElementById('root')!);


root.render(
  <React.StrictMode>
    <Provider store={store}>
     <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
*/

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './services/store';
import App from './components/app/app';

// Создаём элемент modal-root, если его ещё нет
const modalRoot =
  document.getElementById('modal-root') ?? document.createElement('div');
if (!document.getElementById('modal-root')) {
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
}

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter future={{ v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
