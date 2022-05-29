/* eslint-disable max-len */
const {serverLogger} = require('../helpers/logger/serverLogger.js');
const {sendMessage} = require('../services/chatMessages.service');
const {sendNotification} = require('../services/notifications.service.js');
const {emitWebsocketEvent} = require('../services/websocket.service');

const registerSocketSubscribers = (socket, socketId, queue, matchedUsers) => {
  socket.on('searchForMatch', (data) => {
    queue.addUser({
      id: socketId,
      client: 'web',
    });

    emitWebsocketEvent(socket, socketId, 'We are looking for a match for you', 'searching');


    // Get the matched users here and send them messages
    const matchedUsersList = queue.matchUser(matchedUsers);
    if (matchedUsersList.length == 2) {
      matchedUsersList.forEach((user) => {
        console.log(user);
        sendNotification({
          message: 'You have been matched! you can chat now',
        }, user, socket, 'matched');
        serverLogger.info(`Sent 'matched' confirmation message to ${user.client} with ${user.client} id: ${user.id}`);
      });
    }
  });

  socket.on('cancelSearch', (data) => {
    queue.removeUser(socketId);
  });

  socket.on('anonymousMessage', (data) => {
    if (matchedUsers.getOnePair(socketId)) {
      const senderId = socketId;
      const sender = matchedUsers.getOnePair(senderId);

      sendMessage(data.message, sender, socket);
      serverLogger.info(`User with socket id: '${sender.user.id}' sent message to user with socket id: '${sender.matchedTo.id}'`);
    }
  });

  socket.on('typing', (data) => {
    if (matchedUsers.getOnePair(socketId) && matchedUsers.getOnePair(socketId).matchedTo.client == 'web') {
      const receiver = matchedUsers.getOnePair(socketId).matchedTo;
      sendNotification({}, receiver, socket, 'typing');
    }
  });

  socket.on('leaveChat', (data) => {
    if (matchedUsers.checkPairAvailability(socketId)) {
      const matchedTo = matchedUsers.getOnePair(socketId).matchedTo;

      matchedUsers.unmatchUsers(socketId, matchedTo);

      sendNotification({
        message: 'The user has left the chat. Feel free to look for new match',
      }, matchedTo,
      socket,
      'left');
      serverLogger.info(`User with socket id: '${socketId}' left the chat he/she had with user with socket id: '${matchedTo}'`);
    }
  });

  socket.on('disconnect', (reason) => {
    if (queue.checkUserAvailability(socketId)) {
      queue.removeUser(socketId);
    }

    if (matchedUsers.checkPairAvailability(socketId)) {
      const matchedTo = matchedUsers.getOnePair(socketId).matchedTo;

      matchedUsers.unmatchUsers(socketId, matchedTo.id);

      sendNotification({
        message: 'The user has left the chat. Feel free to look for new match',
      }, matchedTo,
      socket,
      'left');
      serverLogger.info(`User with socket id: '${socketId}' left the chat he/she had with user with socket id: '${matchedTo}'`);
    }
  });
};

module.exports = {
  registerSocketSubscribers,
};
