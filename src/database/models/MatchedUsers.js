/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
class MatchedUsers {
  constructor() {
    this.matchedUsers = new Map();
  }

  addMatchedUsers(firstUser, secondUser) {
    const user1 = {
      user: firstUser,
      matchedTo: secondUser,
    };

    const user2 = {
      user: secondUser,
      matchedTo: firstUser,
    };

    const first = user1.user.id;
    const second = user2.user.id;

    this.matchedUsers.set(first, user1);
    this.matchedUsers.set(second, user2);
  }

  unmatchUsers(first, second) {
    this.matchedUsers.delete(first);
    this.matchedUsers.delete(second);
  }

  getOnePair(id) {
    return this.matchedUsers.get(id);
  }

  checkPairAvailability(id) {
    return this.matchedUsers.has(id);
  }

  getAll() {
    const users = [];
    this.matchedUsers.forEach((user) => {
      users.push(user);
    });

    return users;
  }
}

const matchedUsers = new MatchedUsers();

module.exports = {
  matchedUsers,
};
