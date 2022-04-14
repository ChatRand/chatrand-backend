const sendMessage = (message, sender) => {
  switch (sender.matchedTo.client) {
    case 'web':
      const receiverId = sender.matchedTo.socketId;

      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      socket.to(receiverId).emit('message', {
        message: message,
        time: currentTime,
      });
  }
};

module.exports = {
  sendMessage,
};
