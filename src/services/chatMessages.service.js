const sendMessage = (message, sender) => {
  switch (sender.matchedTo.client) {
    case 'web':
      const receiverId = sender.matchedTo.socketId;

      socket.to(receiverId).emit('message', {
        message: message,
      });
  }
};

module.exports = {
  sendMessage,
};
