import express from 'express'
import path from 'path'

const port = (process.env.PORT || 8080)


export function startServer(store) {
	const app = express();
  const indexPath = path.join(__dirname, 'index.html')
  const publicPath = express.static(path.join(__dirname, 'public'))

  app.use('/public', publicPath)
  app.get('/', function (_, res) { res.sendFile(indexPath) })

  const io = require('socket.io').listen(app.listen(port));

  store.subscribe(
  	() => io.emit('state', store.getState().toJS())
  );

  io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());
    socket.on('action', store.dispatch.bind(store));
  });
}
