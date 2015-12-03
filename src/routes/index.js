import React from 'react';
import { IndexRedirect, Route } from 'react-router';

import App         from 'containers/App';
import Messages    from 'containers/Messages';
import Login       from 'containers/Login';
import RequireAuth from 'containers/RequireAuth';
import { SIGNIN_PATH } from 'config';

export default (
  <Route path="/" component={ App }>
    <IndexRedirect to="/channels/general" />
    <Route path={ SIGNIN_PATH }
           component={ Login } />
    <Route component={ RequireAuth }>
      <Route path="/channels/:channelName"
             component={ Messages } />
    </Route>
  </Route>
);
