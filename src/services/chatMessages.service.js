const {emitWebsocketEvent} = require('./websocket.service');

const sendMessage = (message, sender, socket = null) => {
  switch (sender.matchedTo.client) {
    case 'web':
      const receiverId = sender.matchedTo.id;

      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      emitWebsocketEvent(socket, receiverId, {
        message: message,
        time: currentTime,
      }, 'message');
      break;
    case 'telegram':
  }
};

module.exports = {
  sendMessage,
};
