import React, { Component, PropTypes } from 'react';

import { APPLICATION_NAME } from '../config';
import { AUTH_ALLOW } from '../constants/authStatus';

export default class Navigation extends Component {
  static propTypes = {
    auth: PropTypes.shape({
      authenticated: PropTypes.string.isRequired,
      user: PropTypes.object.isRequired
    }),
    onClickSignoutButton: PropTypes.func.isRequired
  }

  render() {
    const { onClickSignoutButton } = this.props;
    const { authenticated, authenticating, user } = this.props.auth;

    return (
      <div className="navigation navbar navbar-default navbar-fixed-top" role="navigation">
        <a className="navbar-brand header-title" href="/">{ APPLICATION_NAME }</a>

        { authenticating &&
            <a className="navbar-brand pull-right">
              <b className="fa fa-lg fa-spin fa-refresh" />
            </a>
        }

        { authenticated === AUTH_ALLOW &&
            <ul className="nav navbar-nav pull-right">
                <li className="nav-item">
                  <a id="dropdown-user" href="#" className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <b className="fa fa-lg fa-user" />
                    { user.name }
                  </a>
                  <ul className="dropdown-menu" aria-labelledby="dropdown-user">
                    <li className="dropdown-item" >
                      <a href="#" onClick={ onClickSignoutButton }>
                        <b className="glyphicon glyphicon-log-out"></b>
                        Log out
                      </a>
                    </li>
                  </ul>
                </li>
            </ul>
        }
      </div>
    );
  }
}
