/* eslint-disable no-console */

import {
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  AUTHENTICATE_FAILURE,
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNIN_ERROR,
  SIGNOUT_SUCCESS
} from '../constants/actionTypes/auth';

function authenticate(provider) {
  return (dispatch, getState) => {
    const { firebase } = getState();

    dispatch({
      type: SIGNIN
    });

    firebase.authWithOAuthPopup(provider, (error, authData) => {
      if (error) {
        dispatch({
          type: SIGNIN_ERROR,
          payload: error,
          meta: {
            timestamp: Date.now()
          }
        });
        console.error('authWithOAuthPopup: ', error);
        return;
      }

      dispatch({
        type: SIGNIN_SUCCESS,
        payload: authData,
        meta: {
          timestamp: Date.now()
        }
      });
    });
  }
}

export function initAuth() {
  return (dispatch, getState) => {
    const { firebase } = getState();

    dispatch({ type: AUTHENTICATE });

    firebase.onAuth((payload) => {
      if (payload) {
        dispatch({
          type: AUTHENTICATE_SUCCESS,
          payload,
          meta: {
            timestamp: Date.now()
          }
        });
      } else {
        dispatch({
          type: AUTHENTICATE_FAILURE,
          meta: {
            timestamp: Date.now()
          }
        });
      }
    });
  }
}

export function signinWithGithub() {
  return authenticate('github');
}

export function signinWithTwitter() {
  return authenticate('twitter');
}

export function signout() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    firebase.unauth();
    dispatch({
      type: SIGNOUT_SUCCESS
    });
  };
}
