import { combineReducers } from 'redux';

import {
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAILURE,
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNIN_ERROR,
  SIGNOUT_SUCCESS
} from 'constants/actionTypes/auth';
import {
  UNAUTH,
  AUTH_ALLOW,
  AUTH_DENY,
  AUTH_SIGNOUT
} from 'constants/authStatus';

export const initialState = {
  authenticating: false,
  authenticated: UNAUTH,
  id: null,
  user: {}
};

function authenticating(state = initialState.authenticating, action) {
  switch (action.type) {
    case AUTHENTICATE:
    case SIGNIN:
      return true;
    case AUTHENTICATE_SUCCESS:
    case AUTHENTICATE_FAILURE:
    case SIGNIN_SUCCESS:
    case SIGNIN_ERROR:
      return false;
    default:
      return state;
  }
}

function authenticated(state = initialState.authenticated, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
      return (action.payload.expires * 1000 > action.meta.timestamp) ? AUTH_ALLOW : AUTH_DENY;
    case SIGNIN_SUCCESS:
      return AUTH_ALLOW;
    case AUTHENTICATE_FAILURE:
    case SIGNIN_ERROR:
      return AUTH_DENY;
    case SIGNOUT_SUCCESS:
      return AUTH_SIGNOUT;
    default:
      return state;
  }
}

function id(state = initialState.id, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
    case SIGNIN_SUCCESS:
      return action.payload.uid
    default:
      return state;
  }
}

function user(state = initialState.user, action) {
  switch (action.type) {
    case AUTHENTICATE_SUCCESS:
    case SIGNIN_SUCCESS: {
      const provider = action.payload.auth.provider;
      switch (provider) {
        case 'github':
        case 'twitter': {
          const data = action.payload[provider];
          return {
            name: data.username,
            avatar: data.profileImageURL
          }
        }
      }
    }
    // eslint-disable-next-line no-fallthrough
    default:
      return state;
  }
}

export default combineReducers({
  authenticating,
  authenticated,
  id,
  user
});
