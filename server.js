var path = require('path');
var express = require('express');

const port = (process.env.PORT || 8080);
var app = express();
const indexPath = path.join(__dirname, 'index.html')
const publicPath = express.static(path.join(__dirname, 'static'))

app.use('/static', publicPath)
app.get('/', function (_, res) { res.sendFile(indexPath) })



app.listen(port);
