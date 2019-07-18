const WebSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});
server.listen(8080, function() {
  console.log((new Date()) + ' Server is listening on port 8080');
});

const ws = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
});

const clients = [];

ws.on('request', function(request){
  const connection = request.accept(null, request.origin);

  clients.push(connection);

  connection.on('message', function(message) {
    clients.forEach((connection) => {
      connection.sendUTF(message.utf8Data);
    });
  });

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
});
});
