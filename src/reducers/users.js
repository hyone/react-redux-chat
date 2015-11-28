import { combineReducers } from 'redux';

import {
  LOAD_USER,
  LOAD_USER_SUCCESS,
  LOAD_USER_ERROR
} from '../constants/actionTypes/users';

export const initialState = {
  loading: false,
  updatedAt: null,
  entities: {}
};

export default combineReducers({
  entities,
  loading,
  updatedAt
});

function loading(state = initialState.loading, action) {
  switch (action.type) {
    case LOAD_USER:
      return true;
    case LOAD_USER_SUCCESS:
    case LOAD_USER_ERROR:
      return false;
    default:
      return state;
  }
}

function updatedAt(state = initialState.updatedAt, action) {
  switch (action.type) {
    case LOAD_USER_SUCCESS:
      return action.meta.timestamp;
    default:
      return state;
  }
}

function entities(state = initialState.entities, action) {
  switch (action.type) {
    case LOAD_USER_SUCCESS:
      return { ...state, [action.payload.id]: action.payload };
    default:
      return state;
  }
}
