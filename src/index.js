import Firebase from 'firebase';
import React from 'react';
import { render } from 'react-dom';

import { FIREBASE_URL } from 'config';
import configureStore from 'store/configureStore';
import { Root } from 'containers/root';

const store = configureStore({
  firebase: new Firebase(FIREBASE_URL)
});

render(
  <Root store={ store } />,
  document.getElementById('app-container')
);
