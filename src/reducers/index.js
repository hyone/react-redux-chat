import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { reducer as form } from 'redux-form';

import auth     from './auth';
import firebase from './firebase';
import channels from './channels';
import messages from './messages';
import users    from './users';

const reducer = combineReducers({
  auth,
  firebase,
  form,
  router,
  channels,
  messages,
  users
});
export default reducer;
