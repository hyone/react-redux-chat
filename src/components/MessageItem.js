import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import 'styles/MessageItem.scss';

export default class MessageItem extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.number.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired
    })
  }

  render() {
    const { text, timestamp, user } = this.props;

    return (
      <div className="message-item">
        { user &&
            <span className="avatar">
              <img src={ user.avatar } />
            </span> }
        { user &&
            <span className="name">{ user.name }</span>
        }
        <span className="info">{ `${moment(timestamp).format('MM/DD HH:mm')}` }</span>
        <div className="text">{ text }</div>
      </div>
    );
  }
}
