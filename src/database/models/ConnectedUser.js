/* eslint-disable require-jsdoc */
// const customId = require('custom-id');

class ConnectedUser {
  constructor() {
    this.connectedUsers = new Map();
  }

  // async addUser(user) {
  //   const userId = await customId({
  //     socketId: user.socketId,
  //   });
  //   // this.connectedUsers.set('userId', { userId:  });
  // }

  removeUser() {
    // Delete That Specific User From The Map
  }
}

module.exports = {
  ConnectedUser,
};
