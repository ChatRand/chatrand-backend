/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
class Queue {
  constructor() {
    this.users = [];
  }

  addUser(user) {
    this.users.push(user);
  }

  addUserAtFirst(user) {
    this.users.unshift(user);
  }

  removeFirst() {
    if (this.isEmpty()) {
      return 'No users left to remove';
    }

    return this.users.shift();
  }

  removeUser(id) {
    if (this.isEmpty()) {
      return 'No user left to remove';
    }

    this.users = this.users.filter((user) => user.id != id);
    return 'removed';
  }

  checkUserAvailability(id) {
    return this.users.filter((user) => user.id == id).length > 0;
  }

  matchUser(matchedUsers) {
    if (queue.getCount() >= 2) {
      const firstUser = queue.takeOutFront();
      const secondUser = queue.takeOutFront();

      if (secondUser == null) {
        queue.addUserAtFirst(firstUser);
        return;
      }

      // const first = firstUser.id;
      // const second = secondUser.id;

      matchedUsers.addMatchedUsers(firstUser, secondUser);

      return [
        firstUser,
        secondUser,
      ];
    } else {
      return [];
    }
  }

  getCount() {
    return this.users.length;
  }

  getFront() {
    if (this.isEmpty()) {
      return null;
    }

    return this.users[0];
  }

  isEmpty() {
    return this.user.length == 0;
  }

  takeOutFront() {
    if (this.isEmpty()) {
      return null;
    }

    const user = this.getFront();
    this.removeFirst();
    return user;
  }

  isEmpty() {
    return this.users.length == 0;
  }

  printQueue() {
    console.table(this.users);
  }

  getQueue() {
    return this.users;
  }
}

const queue = new Queue();

module.exports = {
  queue,
};
