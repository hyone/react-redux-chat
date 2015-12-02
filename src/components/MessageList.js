import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import last from 'lodash/array/last';

import MessageItem from './MessageItem';
import MesssagesLoading from './MessagesLoading';

import '../styles/MessageList.scss';

export default class MessageList extends Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    messages: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const { auth, messages } = this.props;
    const { messages: nextMessages } = nextProps;

    // when message list are updated
    if (messages &&
        nextMessages &&
        messages.length !== nextMessages.length) {
      // when I post message just now
      const latestMessage = last(nextMessages);
      if (latestMessage && latestMessage.userId === auth.id) {
        this.scrollToBottom();
      }
    }
  }

  componentWillUpdate() {
    const node = findDOMNode(this);
    this.shouldScrollToBottom =
      node.scrollTop + node.offsetHeight === node.scrollHeight;
  }

  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const node = findDOMNode(this);
    node.scrollTop = node.scrollHeight;
  }

  render() {
    const {
      loading,
      messages,
      users
    } = this.props;

    return (
      <div className="messages-list">
        { loading && <MesssagesLoading /> }
        <ul ref="list">
          { messages.map((message) =>
              <li key={ message.id }>
                <MessageItem { ...message } user={ users[message.userId] } />
              </li>) }
        </ul>
      </div>
    );
  }
}
