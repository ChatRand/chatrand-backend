const {emitWebsocketEvent} = require('./websocket.service');
const telegramService = require('./telegramBot.service');

const sendMessage = (message, sender, socket = null) => {
  switch (sender.matchedTo.client) {
    case 'web':
      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      emitWebsocketEvent(sender.matchedTo.socketInstance, sender.matchedTo.id, {
        message: message,
        time: currentTime,
      }, 'message');
      break;
    case 'telegram':
      telegramService.sendMessage(sender.matchedTo.id, message);
  }
};

module.exports = {
  sendMessage,
};
