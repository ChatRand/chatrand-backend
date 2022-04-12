/* eslint-disable max-len */
const {serverLogger} = require('../helpers/logger/serverLogger.js');
const registerSocketSubscribers = (socket, socketId, queue, matchedUsers) => {
  socket.on('searchForMatch', (data) => {
    // console.log(data);
    queue.addUser({
      socketId: socketId,
      telegramId: null,
      client: 'web',
      // gender: data.gender,
      // preferedGender: data.preferedGender,
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
          serverLogger.info(`Sent 'matched' confirmation message to socket with socket id: ${user.socketId}`);
        } else {
          socket.to(user.socketId).emit('matched', {
            message: 'You have been matched! you can chat now.',
          });
          serverLogger.info(`Sent 'matched' confirmation message to socket with socket id: ${user.socketId}`);
        }
      });
    }
  });

  socket.on('anonymousMessage', (data) => {
    if (matchedUsers.get(socketId)) {
      const sender = socketId;
      const receiver = matchedUsers.get(sender).matchedTo.socketId;

      socket.to(receiver).emit('message', {message: data.message});
      serverLogger.info(`User with socket id: '${sender}' sent message to user with socket id: '${receiver}'`);
    }
  });

  socket.on('typing', (data) => {
    if (matchedUsers.get(socketId)) {
      const receiver = matchedUsers.get(socketId).matchedTo.socketId;
      socket.to(receiver).emit('typing');
    }
  });

  socket.on('leaveChat', (data) => {
    if (matchedUsers.has(socketId)) {
      const matchedTo = matchedUsers.get(socketId).matchedTo.socketId;

      matchedUsers.delete(socketId);
      matchedUsers.delete(matchedTo);

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

    if (matchedUsers.has(socketId)) {
      const matchedTo = matchedUsers.get(socketId).matchedTo.socketId;
      console.log(matchedTo, socketId);
      matchedUsers.delete(socketId);
      matchedUsers.delete(matchedTo);

      socket.to(matchedTo).emit('left', {message: 'The user has left the chat feel free to look for new match.'});
      serverLogger.info(`User with socket id: '${socketId}' left the chat he/she had with user with socket id: '${matchedTo}'`);
    }
  });
};

module.exports = {
  registerSocketSubscribers,
};
