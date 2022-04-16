const sendMessage = (message, sender) => {
  switch (sender.matchedTo.client) {
    case 'web':
      const receiverId = sender.matchedTo.id;

      const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      sendWebsocketMessage(socket, receiverId, {
        message: message,
        time: currentTime,
      });
      break;
    case 'telegram':
  }
};


const sendWebsocketMessage = (socket, receiverId, message) => {
  socket.to(receiverId).emit('message', message);
};

// const sendNotificationMessage = (message, receiver, socket) => {
//   switch (receiver.user.client) {
//     case 'web':
//       if(socket)
//   }
// };

module.exports = {
  sendMessage,
};
