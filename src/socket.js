/* eslint-disable max-len */
const {Queue} = require('./database/models/Queue');

const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(options);
// eslint-disable-next-line no-var
const queue = new Queue();
const matchedUsers = new Map();

io.on('connection', (socket) => {
  const socketId = socket.id;

  socket.emit('welcome', {
    message: 'welcome to chatRand',
    socketId: socket.id,
  });

  socket.on('searchForMatch', (data) => {
    queue.addUser({
      socketId: socketId,
      userName: null,
      client: 'web',
    });

    socket.emit('searching', {
      message: 'we are looking for a match for you',
    });


    if (queue.getCount() >= 2) {
      const firstUser = queue.takeOutFront();
      const secondUser = queue.takeOutFront();

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
      socket.to(first).emit('matched', {message: 'You have been matched! You can chat now.'});
      matchedUsers.set(second, user2);
      socket.to(second).emit('matched', {message: 'You have been matched! You can chat now.'});
    }
  });

  socket.on('anonymousMessage', (data) => {
    const sender = socketId;
    const receiver = matchedUsers.get(sender).matchedTo.socketId;

    socket.to(receiver).emit('message', {message: data.message});
  });

  socket.on('leaveChat', (data) => {
    if (matchedUsers.has(socketId)) {
      const matchedTo = matchedUsers.get(socketId).matchedTo.socketId;

      matchedUsers.delete(socketId);
      matchedUsers.delete(matchedTo);

      socket.to(matchedTo).emit('left', {message: 'The user has left the chat feel free to look for new match.'});
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
});


module.exports = io;
