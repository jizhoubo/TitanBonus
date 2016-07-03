import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import io from 'socket.io-client';

import reducer from './reducers/index';
import {setState} from './actions/index';
import remoteActionMiddleware from './remote_action_middleware';
import App from './components/app';

const socket = io.connect();
socket.on('state', state => {
	  store.dispatch(setState(state));
	}
);

const createStoreWithMiddleware = applyMiddleware(
  remoteActionMiddleware(socket)
)(createStore);
const store = createStoreWithMiddleware(reducer);


ReactDOM.render(
  <Provider store={store}>  
  	<App />   
  </Provider>,
  document.getElementById('main')
);
