import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import map from 'lodash/collection/map';

export default class ChannelList extends Component {
  static propTypes = {
    channels: PropTypes.object.isRequired
  }

  render() {
    const { channels } = this.props;

    return (
      <div className="channels-list">
        <h3>CHANNELS</h3>
        <div className="list-group">
          { map(channels, (channel, channelId) =>
              <Link key={ channelId }
                    className="list-group-item"
                    activeClassName="active"
                    to={ `/channels/${channelId}` } >
                <i className="note">#</i> { channelId }
              </Link>
            ) }
        </div>
      </div>
    );
  }
}
