const express = require('express');
// eslint-disable-next-line new-cap
const indexRouter = express.Router();

const authRouter = require('./auth.routes');
const botRouter = require('./bot');
const matchedUsersRouter = require('./matchedUsers');
const queueRouter = require('./queue.routes');

indexRouter.use('/auth', authRouter);
indexRouter.use('/bot', botRouter);
indexRouter.use('/queue', queueRouter);
indexRouter.use('/matched-users', matchedUsersRouter);

module.exports = indexRouter;
