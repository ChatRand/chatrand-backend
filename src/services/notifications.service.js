const {sendMessage} = require('./telegramBot.service');
const {emitWebsocketEvent} = require('./websocket.service');

/* eslint-disable max-len */
const sendNotification = async (notificationObject, receiver, type=null) => {
  try {
    switch (receiver.client) {
      case 'web':
        emitWebsocketEvent(receiver.socketInstance, receiver.id, notificationObject.message, type);
        break;
      case 'telegram':
        await sendMessage(receiver.id, notificationObject.message);
        break;
    }
  } catch (e) {
    console.log('err', e);
  }
};

module.exports = {
  sendNotification,
};
