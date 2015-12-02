import React, { Component } from 'react';

import '../styles/MessagesLoading.scss';

export default class MessagesLoading extends Component {
  render() {
    return (
      <div className="loading-wrapper">
        <div className="loading">
          <b className="fa fa-lg fa-spin fa-refresh" />
        </div>
      </div>
    );
  }
}
