import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { DEFAULT_POST_SIGNIN_PATH } from '../config';
import { AUTH_ALLOW } from '../constants/authStatus';
import * as authActions from '../actions/auth';
import * as usersActions from '../actions/users';

@connect(state => ({
  auth: state.auth,
  router: state.router
}), { ...authActions, ...usersActions })
export default class Login extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    router: PropTypes.shape({
      location: PropTypes.object.isRequired
    }).isRequired,
    // actions
    registerUser: PropTypes.func.isRequired,
    signinWithTwitter: PropTypes.func.isRequired
  }

  componentWillReceiveProps(nextProps) {
    const { auth } = this.props;
    const { auth: nextAuth } = nextProps;

    // Just after the user has signed in
    if (auth.authenticated !== AUTH_ALLOW &&
        nextAuth.authenticated === AUTH_ALLOW) {
      this.handleAfterSignin();
    }
  }

  handleAfterSignin() {
    const { history, router, registerUser } = this.props;
    registerUser();
    // redirect
    const redirectTo = router.location.query.redirectTo || DEFAULT_POST_SIGNIN_PATH;
    return history.replaceState(null, redirectTo);
  }

  render() {
    const {
      signinWithTwitter
    } = this.props;

    return (
      <div className="row">
        <div className="col-sm-offset-3 col-sm-6">
          <div className="login-panel text-center">
            <h2>Login</h2>
            <div>
              <button className="login-button" onClick={ signinWithTwitter }>Twitter</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
