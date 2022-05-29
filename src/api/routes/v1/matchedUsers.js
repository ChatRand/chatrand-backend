/* eslint-disable max-len */
/* eslint-disable new-cap */
const matchedUsersRouter = require('express').Router();
const matchedUsersController = require('../../controllers/matchedUsers.controller');

matchedUsersRouter.get('/', matchedUsersController.getAll);

module.exports = matchedUsersRouter;
