/* eslint-disable max-len */
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

    if (queue.getCount() >= 2) {
      const firstUser = queue.takeOutFront();
      const secondUser = queue.takeOutFront();

      if (secondUser == null) {
        queue.addUserAtFirst(firstUser);
        return;
      }

      const user1 = {
        user: firstUser,
        matchedTo: secondUser,
      };

      const user2 = {
        user: secondUser,
        matchedTo: firstUser,
      };

      const first = user1.user.socketId;
      const second = user2.user.socketId;

      matchedUsers.set(first, user1);
      matchedUsers.set(second, user2);

      if (first == socketId) {
        socket.emit('matched', {
          message: 'You have been matched! you can chat now.',
        });
        socket.to(second).emit('matched', {
          message: 'You have been matched! you can chat now.',
        });
      } else if (second == socketId) {
        socket.emit('matched', {
          message: 'You have been matched! you can chat now.',
        });
        socket.to(first).emit('matched', {
          message: 'You have been matched! you can chat now.',
        });
      } else {
        socket.to(first).emit('matched', {
          message: 'You have been matched! you can chat now.',
        });
        socket.to(second).emit('matched', {
          message: 'You have been matched! you can chat now.',
        });
      }
    }
  });

  socket.on('anonymousMessage', (data) => {
    if (matchedUsers.get(socketId)) {
      const sender = socketId;
      const receiver = matchedUsers.get(sender).matchedTo.socketId;

      socket.to(receiver).emit('message', {message: data.message});
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
    }
  });
};

module.exports = {
  registerSocketSubscribers,
};
