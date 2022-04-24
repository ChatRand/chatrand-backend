/* eslint-disable max-len */
const emitWebsocketEvent = (socket, receiverId, message, notificationType) => {
  if (socket.socketId === receiverId) {
    socket.emit(type, message);
  } else {
    socket.to(receiverId).emit(notificationType, message);
  }
};

module.exports = {
  emitWebsocketEvent,
};
