/* eslint-disable no-console */

import Firebase from 'firebase';

import {
  LOAD_USER,
  LOAD_USER_SUCCESS,
  LOAD_USER_ERROR,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR
} from 'constants/actionTypes/users';

export function loadUser(userId) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.child(`users/${userId}`);

    dispatch({ type: LOAD_USER });

    ref.on(
      'value',
      snapshot => {
        return dispatch({
          type: LOAD_USER_SUCCESS,
          payload: snapshot.val(),
          meta: {
            timestamp: Date.now()
          }
        });
      },
      error => {
        console.error('loadUser:', error);
        return dispatch({
          type: LOAD_USER_ERROR,
          payload: error
        });
      }
    );
  }
}

export function registerUser() {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();
    const ref = firebase.child(`users/${auth.id}`);

    dispatch({ type: REGISTER_USER });

    ref.set({
      ...auth.user,
      id: auth.id,
      updatedAt: Firebase.ServerValue.TIMESTAMP
    }, error => {
      if (error) {
        console.error('registerUser:', error);
        return dispatch({
          type: REGISTER_USER_ERROR,
          payload: error
        });
      }

      return dispatch({ type: REGISTER_USER_SUCCESS });
    });
  }
}
