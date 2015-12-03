import React from 'react';
import expect from 'expect';
import {
  findRenderedComponentWithType,
  renderIntoDocument
} from 'react-addons-test-utils';

import MessageList from 'components/MessageList';
import MessagesLoading from 'components/MessagesLoading';

describe('MessageList Component', () => {
  let props;
  let component;
  beforeEach(() => {
    component = renderIntoDocument(<MessageList { ...props } />);
  });

  context('when messages is loading', () => {
    props = {
      auth: {},
      loading: true,
      messages: [],
      users: {}
    };

    it('should render loading component', () => {
      expect(() => {
        findRenderedComponentWithType(component, MessagesLoading);
      }).toNotThrow();
    });
  });
});
