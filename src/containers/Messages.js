import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import uniq    from 'lodash/array/uniq';
import forEach from 'lodash/collection/forEach';
import sortBy  from 'lodash/collection/sortBy';
import isEmpty from 'lodash/lang/isEmpty';
import values  from 'lodash/object/values';

import * as channelsActions from '../actions/channels';
import * as messagesActions from '../actions/messages';
import * as usersActions from '../actions/users';
import { messageInitialState } from '../reducers/messages';
import ChannelList from '../components/ChannelList';
import MessageList from '../components/MessageList';
import MessageForm from '../components/MessageForm';

import '../styles/Messages.scss';

@connect(mapStateToProps, {
  ...channelsActions,
  ...messagesActions,
  ...usersActions
})
export default class MessagesContainer extends Component {
  static propTypes = {
    channels: PropTypes.shape({
      entities: PropTypes.object.isRequired
    }).isRequired,
    messages: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      entities: PropTypes.object.isRequired
    }),
    users: PropTypes.shape({
      entities: PropTypes.object.isRequired
    }).isRequired,
    activeChannel: PropTypes.string,
    // actions
    registerChannelsListeners: PropTypes.func.isRequired,
    registerMessagesListeners: PropTypes.func.isRequired,
    loadMessages: PropTypes.func.isRequired,
    loadUser: PropTypes.func.isRequired
  }

  componentWillMount() {
    const {
      activeChannel,
      messages,
      registerChannelsListeners
    } = this.props;

    registerChannelsListeners();
    this.handleChangeChannel(activeChannel, messages);
  }

  componentWillReceiveProps(nextProps) {
    const {
      activeChannel,
      messages
    } = this.props;
    const {
      activeChannel: nextActiveChannel,
      messages: nextMessages
    } = nextProps;

    // when message list are updated
    if (messages &&
        nextMessages &&
        messages.entities !== nextMessages.entities) {
      this.handleUpdateMessages(messages.entities, nextMessages.entities);

      // when channel's messages have initially loaded.
      if (!messages.loaded && nextMessages.loaded) {
        this.handleLoadedMessages();
      }
    }

    // when move to an another channel
    if (nextActiveChannel && activeChannel !== nextActiveChannel) {
      this.handleChangeChannel(nextActiveChannel, nextMessages);
    }
  }

  handleChangeChannel(newChannel, newMessages) {
    if (isEmpty(newMessages.entities)) {
      this.props.loadMessages(newChannel);
    }
  }

  handleLoadedMessages() {
    const { activeChannel, registerMessagesListeners } = this.props;
    // listen incoming messages
    registerMessagesListeners(activeChannel);
  }

  handleUpdateMessages(oldMessages, newMessages) {
    const userIds = uniq(values(newMessages).map(v => v.userId));
    this.loadUsers(userIds);
  }

  handlePostMessage() {
    this.scrollMessageListToBottom();
  }

  loadUsers(userIds) {
    const {
      users: { entities: users },
      loadUser
    } = this.props;

    userIds.forEach((userId) => {
      if (!users[userId]) {
        loadUser(userId);
      }
    })
  }

  render() {
    const {
      activeChannel, auth,
      channels, messages, users,
      postMessage
    } = this.props;

    if (!auth.authenticated) {
      return (<div></div>);
    }

    const messageList = sortBy(
      forEach(messages.entities, (m, k) => { m.id = k }),
      m => m.timestamp
    );

    return (
      <div className="messages-container">
        <div className="">
          <div className="sidebar">
            <ChannelList
              channels={ channels.entities } />
          </div>
          <div className="main">
            <MessageList
              auth={ auth }
              loading={ messages.loading }
              messages={ messageList }
              users={ users.entities } />
            <div className="main-footer">
              { activeChannel &&
                  <MessageForm
                    auth={ auth }
                    submitAction={ (text) => postMessage(activeChannel, text) } />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    auth, form, channels, messages, users,
    router: { params: { channelName } }
  } = state;

  return {
    auth, form, channels, users,
    activeChannel: channelName,
    messages: messages[channelName] || messageInitialState
  };
}
