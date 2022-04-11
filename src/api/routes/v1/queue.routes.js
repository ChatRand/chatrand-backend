/* eslint-disable new-cap */
const queueRouter = require('express').Router();
const queueController = require('../../controllers/queue.controller');

queueRouter.get('/', queueController.getAll);

module.exports = queueRouter;
