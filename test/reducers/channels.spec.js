import expect from 'expect';

import {
  LOAD_CHANNELS,
  LOAD_CHANNELS_SUCCESS,
  LOAD_CHANNELS_ERROR
} from 'constants/actionTypes/channels';
import {
  // default as channelsReducer,
  initialState,
  entities,
  loading,
  updatedAt
} from 'reducers/channels';

describe('channels reducer', () => {
  describe('loading', () => {
    context('when action.type is LOAD_CHANNELS', () => {
      const action = {
        type: LOAD_CHANNELS
      };
      it('should be true', () => {
        expect( loading(undefined, action) ).toEqual(true);
      });
    });

    context('when action type is LOAD_CHANNELS_SUCCESS', () => {
      const action = {
        type: LOAD_CHANNELS_SUCCESS
      };
      it('should be false', () => {
        expect( loading(undefined, action) ).toEqual(false);
      });
    });

    context('when action type is LOAD_CHANNELS_ERROR', () => {
      const action = {
        type: LOAD_CHANNELS_ERROR
      };
      it('should be false', () => {
        expect( loading(undefined, action) ).toEqual(false);
      });
    });

    context('when action type is not found', () => {
      const action = {};
      context('and with no state', () => {
        const state = undefined;
        it('should return initial state', () => {
          expect( loading(state, action) ).toEqual(initialState.loading);
        });
      });
    });
  });

  describe('entities', () => {
    context('when action type is LOAD_CHANNELS_SUCCESS', () => {
      const action = {
        type: LOAD_CHANNELS_SUCCESS,
        payload: {
          channel1: { id: 'channel1' },
          channel2: { id: 'channel2' }
        }
      };

      it('entities should have channels', () => {
        expect( entities(undefined, action) ).toEqual(action.payload);
      });
    });

    context('when action type is not found', () => {
      const action = {};
      context('and with no state', () => {
        const state = undefined;
        it('should return initial state', () => {
          expect( entities(state, action) ).toEqual(initialState.entities);
        });
      })
    });
  });

  describe('updatedAt', () => {
    context('when action type is LOAD_CHANNELS_SUCCESS', () => {
      const action = {
        type: LOAD_CHANNELS_SUCCESS,
        meta: {
          timestamp: Date.now()
        }
      };

      it('should be set', () => {
        expect( updatedAt(undefined, action) ).toEqual(action.meta.timestamp);
      });
    });

    context('when action type is not found', () => {
      const action = {};
      context('and with no state', () => {
        const state = undefined;
        it('should return initial state', () => {
          expect( updatedAt(state, action) ).toEqual(initialState.updatedAt);
        });
      })
    });
  });
});
