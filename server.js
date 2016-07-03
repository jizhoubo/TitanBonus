import express from 'express'
import path from 'path'
import {getClientStateFromServerState} from './core';

const port = (process.env.PORT || 8080)


export function startServer(store) {
	const app = express();
  const indexPath = path.join(__dirname, 'index.html')
  const publicPath = express.static(path.join(__dirname, 'public'))

  app.use('/public', publicPath)
  app.get('/', function (_, res) { res.sendFile(indexPath) })

  if (process.env.NODE_ENV !== 'production') {
	  const webpack = require('webpack')
	  const webpackDevMiddleware = require('webpack-dev-middleware')
	  const webpackHotMiddleware = require('webpack-hot-middleware')
	  const config = require('./webpack.dev.config.js')
	  const compiler = webpack(config)

	  app.use(webpackHotMiddleware(compiler))
	  app.use(webpackDevMiddleware(compiler, {
	    noInfo: true,
	    publicPath: config.output.publicPath
	  }))
	}

  const io = require('socket.io').listen(app.listen(port));

  store.subscribe(
  	() => {
			const clientState = getClientStateFromServerState(store.getState().toJS());
  		io.emit('state', clientState);
  	}
  );

  io.on('connection', (socket) => {
    const clientState = getClientStateFromServerState(store.getState().toJS());
		io.emit('state', clientState);
    socket.on('action', store.dispatch.bind(store));
  });
}
