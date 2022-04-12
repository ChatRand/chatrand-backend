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

  removeUser(socketId) {
    if (this.isEmpty()) {
      return 'No user left to remove';
    }

    this.users = this.users.filter((item) => item != socketId);
    return 'removed';
  }

  checkUserAvailability(user) {
    if (this.users.indexOf(user) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  matchUser(socketId, matchedUsers) {
    if (queue.getCount() >= 2) {
      const firstUser = queue.takeOutFront();
      const secondUser = queue.takeOutFront();

      if (secondUser == null) {
        queue.addUserAtFirst(firstUser);
        return;
      }

      const first = firstUser.socketId;
      const second = secondUser.socketId;

      // matchedUsers.set(first, user1);
      // matchedUsers.set(second, user2);
      matchedUsers.addMatchedUsers(firstUser, secondUser);

      if (first == socketId) {
        return [
          {
            socketId: first,
            currentSocket: true,
          },
          {
            socketId: second,
            currentSocket: false,
          },
        ];
      } else if (second == socketId) {
        return [
          {
            socketId: first,
            currentSocket: false,
          },
          {
            socketId: second,
            currentSocket: true,
          },
        ];
      } else {
        return [
          {
            socketId: first,
            currentSocket: false,
          },
          {
            socketId: second,
            currentSocket: false,
          },
        ];
      }
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
