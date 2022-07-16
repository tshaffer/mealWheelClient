import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { createStore, applyMiddleware, compose } from 'redux';

import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import App from './components/App';
import { rootReducer } from './models';

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
root.render(
  <Provider store={store}>
    <div style={divStyle}>
      < App />
    </div>
  </Provider>,
);
