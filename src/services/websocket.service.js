/* eslint-disable max-len */
const emitWebsocketEvent = (socket, receiverId, message, notificationType) => {
  if (socket) {
    if (socket.id == receiverId) {
      socket.emit(notificationType, message);
    } else {
      socket.to(receiverId).emit(notificationType, message);
    }
  }
};

module.exports = {
  emitWebsocketEvent,
};
