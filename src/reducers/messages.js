import { combineReducers } from 'redux';

import {
  LOAD_MESSAGES,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_ERROR,
  RECEIVE_MESSAGE_SUCCESS,
  RECEIVE_MESSAGE_ERROR
} from '../constants/actionTypes/messages';

export const messageInitialState = {
  loading: false,
  loaded: false,
  updatedAt: null,
  entities: {}
};

const messageReducer = combineReducers({
  entities,
  loading,
  loaded,
  updatedAt
});

export default function messagesReducer(state = {}, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
    case LOAD_MESSAGES_SUCCESS:
    case LOAD_MESSAGES_ERROR:
    case RECEIVE_MESSAGE_SUCCESS:
    case RECEIVE_MESSAGE_ERROR:
      const key = action.channel;
      return {
        ...state,
        [key]: messageReducer(state[key], action)
      };
    default:
      return state;
  }
}


function loading(state = messageInitialState.loading, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
      return true;
    case LOAD_MESSAGES_SUCCESS:
    case LOAD_MESSAGES_ERROR:
      return false
    default:
      return state;
  }
}

function loaded(state = messageInitialState.loaded, action) {
  switch (action.type) {
    case LOAD_MESSAGES:
    case LOAD_MESSAGES_ERROR:
      return false;
    case LOAD_MESSAGES_SUCCESS:
      return true;
    default:
      return state;
  }
}

function updatedAt(state = messageInitialState.updatedAt, action) {
  switch (action.type) {
    case LOAD_MESSAGES_SUCCESS:
    case RECEIVE_MESSAGE_SUCCESS:
      return action.meta.timestamp;
    default:
      return state;
  }
}

function entities(state = messageInitialState.entities, action) {
  switch (action.type) {
    case LOAD_MESSAGES_SUCCESS:
      return action.payload;
    case RECEIVE_MESSAGE_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
