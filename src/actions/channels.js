import Firebase from 'firebase';

import {
  LOAD_CHANNELS,
  LOAD_CHANNELS_SUCCESS,
  LOAD_CHANNELS_ERROR,
  ADD_CHANNEL,
  ADD_CHANNEL_SUCCESS,
  ADD_CHANNEL_ERROR
} from 'constants/actionTypes/channels';

export function addChannel(channelName) {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.child(`channels/${channelName}`);

    dispatch({ type: ADD_CHANNEL });

    ref.once(
      'value',
      snapshot => {
        if (snapshot.exists()) {
          return dispatch({
            type: ADD_CHANNEL_ERROR,
            payload: new Error(`channel #${channelName} already exists`)
          });
        }

        ref.set({
          id: channelName,
          createdAt: Firebase.ServerValue.TIMESTAMP
        }, error => {
          if (!error) {
            dispatch({
              type: ADD_CHANNEL_SUCCESS
            });
          } else {
            dispatch({
              type: ADD_CHANNEL_ERROR,
              payload: error
            });
          }
        });
      }
    );
  }
}

export function registerChannelsListeners() {
  return (dispatch, getState) => {
    const { firebase } = getState();
    const ref = firebase.child(`channels`);

    dispatch({ type: LOAD_CHANNELS });

    ref.on(
      'value',
      snapshot => {
        return dispatch({
          type: LOAD_CHANNELS_SUCCESS,
          payload: snapshot.val(),
          meta: {
            timestamp: Date.now()
          }
        })
      },
      error => {
        return dispatch({
          type: LOAD_CHANNELS_ERROR,
          payload: error
        });
      }
    );
  }
}
