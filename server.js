const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let messageCount = 0;
let messageTimer;

wss.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);

    if (typeof message !== 'string') {
      message = message.toString();
    }

    if (message.match(/^[a-zA-Z\s]+$/)) {
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

wss.on('close', () => {
  console.log('Server shutting down');

  // Очищаем таймер перед закрытием сервера
  clearInterval(messageTimer);
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
