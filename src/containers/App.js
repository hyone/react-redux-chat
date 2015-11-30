import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import Navigation from '../components/Navigation';

import '../styles/App.scss';

@connect(state => ({
  auth: state.auth
}), authActions)
export default class App extends Component {
  static propTypes = {
    auth: PropTypes.shape({
      authenticated: PropTypes.string.isRequired
    }).isRequired,
    children: PropTypes.object,
    // actions
    signout: PropTypes.func.isRequired
  }

  render() {
    const { auth, children, signout } = this.props;

    return (
      <div id="app-wrapper">
        <header className="header">
          <Navigation
            auth={ auth }
            onClickSignoutButton={ signout } />
        </header>

        <div className="main-content container">
          { children }
        </div>
      </div>
    );
  }
}
