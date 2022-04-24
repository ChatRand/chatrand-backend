const {emitWebsocketEvent} = require('./websocket.service');

/* eslint-disable max-len */
const sendNotification = (notificationObject, receiver, socket = null, type=null) => {
  switch (receiver.client) {
    case 'web':
      emitWebsocketEvent(socket, receiver.id, notificationObject, type);
  }
};

module.exports = {
  sendNotification,
};
