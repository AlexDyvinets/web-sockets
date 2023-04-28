const output = document.getElementById('output');
const input = document.getElementById('input');
const sendButton = document.getElementById('send');
const connectButton = document.getElementById('connect');
const disconnectButton = document.getElementById('disconnect');

let socket = null;

function showMessage(message) {
  const p = document.createElement('p');
  p.innerText = message;
  output.appendChild(p);
}

sendButton.addEventListener('click', () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    const message = input.value.trim();
    if (message.match(/^[a-zA-Z\s]+$/)) {
      socket.send(message);
    } else {
      showMessage('Sorry, message is invalid');
    }
    input.value = '';
  } else {
    showMessage('You are not connected to the server');
  }
});

connectButton.addEventListener('click', () => {
  if (!socket || socket.readyState === WebSocket.CLOSED) {
    socket = new WebSocket('ws://web-socket-app.herokuapp.com');
    socket.addEventListener('open', () => {
      showMessage('Connected to the server');
    });
    socket.addEventListener('message', (event) => {
      const message = event.data;
      showMessage(`Server says: ${message}`);
    });
    socket.addEventListener('close', () => {
      showMessage('Disconnected from the server');
    });
  } else {
    showMessage('You are already connected to the server');
  }
});

disconnectButton.addEventListener('click', () => {
  if (socket && socket.readyState !== WebSocket.CLOSED) {
    socket.close();
  } else {
    showMessage('You are not connected to the server');
  }
});

input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});
