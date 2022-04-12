/* eslint-disable max-len */
const {registerSocketSubscribers} = require('./subscribers/websocket_events');
const options = {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
};

const io = require('socket.io')(options);
// eslint-disable-next-line no-var
// const queue = new Queue();
const {queue} = require('./database/models/Queue');

const {matchedUsers} = require('./database/models/MatchedUsers');

io.on('connection', (socket) => {
  const socketId = socket.id;

  registerSocketSubscribers(socket, socketId, queue, matchedUsers);
});


module.exports = io;
