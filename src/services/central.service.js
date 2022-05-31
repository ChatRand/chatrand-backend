const {queue} = require('../database/models/Queue');
const {matchedUsers} = require('../database/models/MatchedUsers');
const {sendNotification} = require('./notifications.service');
const chatMessagesService = require('./chatMessages.service');

const joinQueue = (user) => {
  queue.addUser(user);
};

const lookForMatch = (socket = null) => {
  const matchedUsersList = queue.matchUser(matchedUsers);
  if (matchedUsersList.length == 2) {
    matchedUsersList.forEach(async (user) => {
      await sendNotification({
        message: 'You have been matched! You can chat now',
      }, user, 'matched');
    });
  }
};

const leaveMatch = (id, socket = null) => {
  if (matchedUsers.checkPairAvailability(id)) {
    const user = matchedUsers.getOnePair(id);

    matchedUsers.unmatchUsers(id, user.matchedTo.user);

    sendNotification({
      message: 'The user has left the chat. Feel free to look for new match',
    }, user.matchedTo, 'left');
    sendNotification({
      message: 'You left the chat',
    }, user.user, 'left');
  }
};

const sendMessage = (id, message, socket = null) => {
  if (matchedUsers.getOnePair(id)) {
    const sender = matchedUsers.getOnePair(id);

    chatMessagesService.sendMessage(message, sender, socket);
  }
};

module.exports = {
  joinQueue,
  lookForMatch,
  leaveMatch,
  sendMessage,
};
