import * as React from 'react';
// import * as ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { rootReducer } from './models';

import Home from './components/Home';
import Login from './components/Login';
import App from './components/App';

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  rootReducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(thunkMiddleware)
  ));

const divStyle = {
  height: '1080px',
};

const container = document.getElementById('content');
const root = createRoot(container!);
// root.render(
//   <Provider store={store}>
//     <div style={divStyle}>
//       < App />
//     </div>
//   </Provider>,
// );

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/app' element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
);
