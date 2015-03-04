var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

var chat = io.of('/chat');

chat.on('connection', function (socket) {

  socket.on('open', function(id) {
      /* join in room */ 
      socket.join(id);
  });

  socket.on('send', function(data) {
      /* send to */
      socket.broadcast.to(data.to).emit('conversation', {
          from: data.from,
          message: data.message
      });
  });

  socket.on('disconnect', function () {
    console.log('on user disconected');
  });
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});