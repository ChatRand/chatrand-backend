/* eslint-disable max-len */
const {serverLogger} = require('../helpers/logger/serverLogger.js');
const {sendMessage} = require('../services/chatMessages.service');

const registerSocketSubscribers = (socket, socketId, queue, matchedUsers) => {
  socket.on('searchForMatch', (data) => {
    queue.addUser({
      id: socketId,
      client: 'web',
    });
    socket.emit('searching', {
      message: 'we are looking for a match for you',
    });

    // Get the matched users here and send them messages
    const matchedUsersList = queue.matchUser(socketId, matchedUsers);

    if (matchedUsersList.length == 2) {
      matchedUsersList.forEach((user) => {
        if (user.currentSocket) {
          socket.emit('matched', {
            message: 'You have been matched! you can chat now.',
          });
          serverLogger.info(`Sent 'matched' confirmation message to socket with socket id: ${user.id}`);
        } else {
          socket.to(user.id).emit('matched', {
            message: 'You have been matched! you can chat now.',
          });
          serverLogger.info(`Sent 'matched' confirmation message to socket with socket id: ${user.socketId}`);
        }
      });
    }
  });

  socket.on('anonymousMessage', (data) => {
    if (matchedUsers.getOnePair(socketId)) {
      const senderId = socketId;
      const sender = matchedUsers.getOnePair(senderId);

      sendMessage(data.message, sender);
      serverLogger.info(`User with socket id: '${sender.user.socketId}' sent message to user with socket id: '${sender.matchedTo.socketId}'`);
    }
  });

  socket.on('typing', (data) => {
    if (matchedUsers.getOnePair(socketId)) {
      const receiver = matchedUsers.getOnePair(socketId).matchedTo.id;
      socket.to(receiver).emit('typing');
    }
  });

  socket.on('leaveChat', (data) => {
    if (matchedUsers.checkPairAvailability(socketId)) {
      const matchedTo = matchedUsers.getOnePair(socketId).matchedTo.id;

      matchedUsers.unmatchUsers(socketId, matchedTo);

      socket.to(matchedTo).emit('left', {
        message: 'The user has left the chat feel free to look for new match.',
      });
      serverLogger.info(`User with socket id: '${socketId}' left the chat he/she had with user with socket id: '${matchedTo}'`);
    }
  });

  socket.on('disconnect', (reason) => {
    if (queue.checkUserAvailability(socketId)) {
      queue.removeUser(socketId);
    }

    if (matchedUsers.checkPairAvailability(socketId)) {
      const matchedTo = matchedUsers.getOnePair(socketId).matchedTo.id;

      matchedUsers.unmatchUsers(socketId, matchedTo);

      socket.to(matchedTo).emit('left', {message: 'The user has left the chat feel free to look for new match.'});
      serverLogger.info(`User with socket id: '${socketId}' left the chat he/she had with user with socket id: '${matchedTo}'`);
    }
  });
};

module.exports = {
  registerSocketSubscribers,
};
