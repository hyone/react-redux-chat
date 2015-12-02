import expect from 'expect';
import get from 'lodash/object/get';

import {
  LOAD_CHANNELS,
  LOAD_CHANNELS_SUCCESS,
  LOAD_CHANNELS_ERROR
} from 'constants/actionTypes/channels';
import { default as channelsReducer, initialState } from 'reducers/channels';

describe('channels reducer', () => {
  context('when action.type is not found', () => {
    it('should return initial state', () => {
      expect(channelsReducer(undefined, {})).toEqual(initialState);
    });
  });

  context('when action.type is LOAD_CHANNELS', () => {
    const action = {
      type: LOAD_CHANNELS
    };
    it('loading should be true', () => {
      const expectedState = {
        ...initialState,
        loading: true
      };
      expect(channelsReducer(undefined, action)).toEqual(expectedState);
    });
  });

  context('when action.type is LOAD_CHANNELS_SUCCESS', () => {
    const action = {
      type: LOAD_CHANNELS_SUCCESS,
      payload: {
        channel1: { id: 'channel1' },
        channel2: { id: 'channel2' }
      },
      meta: {
        timestamp: Date.now()
      }
    };

    it('loading should be false', () => {
      expect(
        get(channelsReducer(undefined, action), 'loading')
      ).toEqual(false);
    });

    it('entities should have channels', () => {
      expect(
        channelsReducer(undefined, action).entities
      ).toEqual(action.payload);
    });

    it('updatedAt should be set', () => {
      expect(
        get(channelsReducer(undefined, action), 'updatedAt')
      ).toEqual(action.meta.timestamp);
    });
  });

  context('when action.type is LOAD_CHANNELS_ERROR', () => {
    const action = {
      type: LOAD_CHANNELS_ERROR
    };
    it('loading should be false', () => {
      expect(
        get(channelsReducer(undefined, action), 'loading')
      ).toEqual(false);
    });
  });
});
