import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import {
  POST_SIGNOUT_PATH,
  SIGNIN_PATH
} from 'config';
import {
  AUTH_ALLOW,
  AUTH_DENY,
  AUTH_SIGNOUT
} from 'constants/authStatus';
import * as authActions from 'actions/auth';
import * as usersActions from 'actions/users';

@connect(state => ({
  auth: state.auth,
  router: state.router
}), { ...authActions, ...usersActions })
export default class RequireAuth extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    children: PropTypes.object,
    history: PropTypes.object.isRequired,
    router: PropTypes.shape({
      location: PropTypes.object.isRequired
    }).isRequired,
    // actions
    initAuth: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.initAuth();
  }

  componentWillReceiveProps(nextProps) {
    const { auth: nextAuth } = nextProps;

    // Just after the user has signed out
    if (nextAuth.authenticated === AUTH_SIGNOUT) {
      return this.handleAfterSignout();
    }
    // Just after authentication has failed
    else if (nextAuth.authenticated === AUTH_DENY) {
      return this.handleNotAuthenticated();
    }
  }

  handleAfterSignout() {
    const { history } = this.props;
    history.replaceState(null, POST_SIGNOUT_PATH);
  }

  handleNotAuthenticated() {
    const { history, router: { location: { pathname } } } = this.props;
    return history.replaceState(null, SIGNIN_PATH, {
      // prevent inifinte loop
      redirectTo: pathname != SIGNIN_PATH ? pathname : ''
    });
  }

  render() {
    const { auth, children } = this.props;

    return (
      <div>{ auth.authenticated === AUTH_ALLOW && children }</div>
    )
  }
}
