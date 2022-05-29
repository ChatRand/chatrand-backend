const {sendMessage} = require('./telegramBot.service');
const {emitWebsocketEvent} = require('./websocket.service');

/* eslint-disable max-len */
const sendNotification = (notificationObject, receiver, socket = null, type=null) => {
  try {
    switch (receiver.client) {
      case 'web':
        emitWebsocketEvent(socket, receiver.id, notificationObject.message, type);
        break;
      case 'telegram':
        sendMessage(receiver.id, notificationObject.message);
        break;
    }
  } catch (e) {
    console.log('err', e);
  }
};

module.exports = {
  sendNotification,
};
