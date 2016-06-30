import React from 'react'
import { render } from 'react-dom'
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
import App from './components/app'

const socket = io(`${location.protocol}//${location.hostname}:8080`);
socket.on('state', state =>
  console.log(state)
);

render(<App/>, document.getElementById('main'))
