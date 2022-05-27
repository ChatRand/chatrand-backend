const {sendMessage} = require('./telegramBot.service');
const {emitWebsocketEvent} = require('./websocket.service');

/* eslint-disable max-len */
const sendNotification = (notificationObject, receiver, socket = null, type=null) => {
  console.log(notificationObject, receiver);

  switch (receiver.client) {
    case 'web':
      emitWebsocketEvent(socket, receiver.id, notificationObject, type);
    case 'telegram':
      sendMessage(receiver.telegramId, notificationObject.message);
  }
};

module.exports = {
  sendNotification,
};
