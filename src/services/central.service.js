const {queue} = require('../database/models/Queue');
const {matchedUsers} = require('../database/models/MatchedUsers');
const {sendNotification} = require('./notifications.service');

const joinQueue = (user) => {
  queue.addUser(user);
};

const lookForMatch = (socket = null) => {
  const matchedUsersList = queue.matchUser(matchedUsers);

  if (matchedUsersList.length == 2) {
    matchedUsersList.length.forEach((user) => {
      sendNotification({
        message: 'You have been matched! You can chat now',
      }, user, socket, 'matched');
    });
  }
};

const leaveMatch = (id, socket = null) => {
  if (matchedUsers.checkPairAvailability(id)) {
    const matchedTo = matchedUsers.getOnePair(id).matchedTo;

    matchedUsers.unmatchUsers(id, matchedTo);

    sendNotification({
      message: 'The user has left the chat. Feel free to look for new match',
    }, matchedTo, socket);
  }
};

const sendMessage = (user, message, socket = null) => {
  if (matchedUsers.getOnePair(user.id)) {
    const senderId = user.id;
    const receiver = matchedUsers.getOnePair(senderId);

    sendMessage(message, receiver, socket);
  }
};

module.exports = {
  joinQueue,
  lookForMatch,
  leaveMatch,
  sendMessage,
};
