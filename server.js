const WebSocket = require('ws');
const WebSocketServer = WebSocket.Server;

const server = new WebSocket.Server({ port: 8443 });

let messageCount = 0;
let messageTimer;

server.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    if (typeof message !== 'string') {
      message = message.toString();
    }

    if (message.match(/^[A-Za-z]+$/)) {
      messageCount++;
      socket.send('Your message is valid.');
    } else {
      socket.send('Sorry, message is invalid');
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });

  // Устанавливаем таймер для регулярной отправки сообщений с количеством сообщений
  messageTimer = setInterval(() => {
    socket.send(`Total messages sent: ${messageCount}`);
  }, 15000);
});

server.on('close', () => {
  console.log('Server shutting down');

  // Очищаем таймер перед закрытием сервера
  clearInterval(messageTimer);
});
