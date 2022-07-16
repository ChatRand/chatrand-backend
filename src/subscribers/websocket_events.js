/* eslint-disable max-len */
// const {serverLogger} = require('../helpers/logger/serverLogger.js');
const {sendNotification} = require('../services/notifications.service.js');
const centralService = require('../services/central.service');

const registerSocketSubscribers = (socket, socketId, queue, matchedUsers) => {
  socket.on('searchForMatch', (data) => {
    const userData = {
      id: socketId,
      client: 'web',
      socketInstance: socket,
    };

    centralService.joinQueue(userData);

    // emitWebsocketEvent(socket, socketId, 'We are looking for a match for you', 'searching');
    sendNotification({
      message: 'We are looking for a match for you',
    }, {
      id: userData.id,
      client: userData.client,
    }, socket, 'searching');

    // Look for match for users
    centralService.lookForMatch(socket);
  });

  socket.on('cancelSearch', (data) => {
    queue.removeUser(socketId);
  });

  socket.on('anonymousMessage', (data) => {
    // Send messages
    centralService.sendMessage(socketId, data.message, socket);
  });

  socket.on('typing', (data) => {
    if (matchedUsers.getOnePair(socketId) && matchedUsers.getOnePair(socketId).matchedTo.client == 'web') {
      const receiver = matchedUsers.getOnePair(socketId).matchedTo;
      sendNotification({}, receiver, 'typing');
    }
  });

  socket.on('leaveChat', (data) => {
    // Leave chat
    centralService.leaveMatch(socketId, socket);
  });

  socket.on('disconnect', (reason) => {
    // Leave chat
    centralService.leaveMatch(socketId, socket);
  });
};

module.exports = {
  registerSocketSubscribers,
};
