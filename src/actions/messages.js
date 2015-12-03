/* eslint-disable no-console */

import Firebase from 'firebase';

import {
  LOAD_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_ERROR,
  POST_MESSAGE,
  POST_MESSAGE_SUCCESS,
  POST_MESSAGE_ERROR,
  RECEIVE_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE_ERROR
} from 'constants/actionTypes/messages';

export function postMessage(channel, text) {
  return (dispatch, getState) => {
    const { auth, firebase } = getState();

    dispatch({ type: POST_MESSAGE });

    firebase.child(`messages/${channel}`)
      .push({
        text,
        userId: auth.id,
        timestamp: Firebase.ServerValue.TIMESTAMP
      }, error => {
        if (!error) {
          dispatch({
            type: POST_MESSAGE_SUCCESS
          });
        } else {
          console.error('postMessage:', error);
          dispatch({
            type: POST_MESSAGE_ERROR,
            payload: error
          });
        }
      });
  }
}

export function loadMessages(channel) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.child(`messages/${channel}`);

    dispatch({
      type: LOAD_MESSAGES,
      channel
    });

    ref.limitToLast(50).once(
      'value',
      snapshot => {
        return dispatch({
          type: LOAD_MESSAGES_SUCCESS,
          channel,
          payload: snapshot.val(),
          meta: {
            timestamp: Date.now()
          }
        });
      },
      error => {
        return dispatch({
          type: LOAD_MESSAGES_ERROR,
          channel,
          payload: error
        });
      }
    );
  }
}

export function registerMessagesListeners(channel) {
  return (dispatch, getState) => {
    const { firebase, messages } = getState();
    const ref = firebase.child(`messages/${channel}`);

    ref.limitToLast(5).on(
      'child_added',
      snapshot => {
        const channelMessages = messages[channel];
        const key = snapshot.key();
        // If incoming is new message:
        if (!channelMessages || !channelMessages.entities[key]) {
          return dispatch({
            type: RECEIVE_MESSAGE_SUCCESS,
            channel,
            payload: { [snapshot.key()]: snapshot.val() },
            meta: {
              timestamp: Date.now()
            }
          });
        }

      },
      error => {
        return dispatch({
          type: RECEIVE_MESSAGE_ERROR,
          channel,
          payload: error
        });
      }
    );
  }
}
