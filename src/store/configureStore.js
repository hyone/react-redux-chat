import createHistory from 'history/lib/createBrowserHistory';
import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import createLogger from 'redux-logger';
import { actionTypes } from 'redux-form';
const { BLUR, CHANGE, FOCUS, TOUCH } = actionTypes;
import contains from 'lodash/collection/contains';

import rootReducer from 'reducers';
import routes from 'routes';

const loggerMiddleware = createLogger({
  predicate: (getState, action) => {
    return !contains([
      BLUR, CHANGE, FOCUS, TOUCH
    ], action.type)
  }
});
const createStoreWithMiddleware = compose(
  applyMiddleware(thunkMiddleware),
  reduxReactRouter({ routes, createHistory }),
  applyMiddleware(loggerMiddleware)
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
