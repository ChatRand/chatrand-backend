/* eslint-disable max-len */
const asyncHandler = require('../../helpers/error/asyncHandler');
const axios = require('axios');
const config = require('../../config/config');
const telegramBotService = require('../../services/telegramBot.service');
const {successResponse, errorResponse} = require('../../utils/responses');
const centralService = require('../../services/central.service');

const _ = require('lodash');
const {sendNotification} = require('../../services/notifications.service');

const botMainController = asyncHandler(async (req, res) => {
  const update = req.body;

  if (update.message) {
    if (update.message.text) {
      const userId = update.message.from.id;

      switch (update.message.text) {
        case '/start':
          telegramBotService.sendMessage(userId, 'Welcome to ChatRand. I am delighted to have you😁, So tell me, What is it that you really desire?😉');
          break;
        case '/searchformatch':
          const userData = {
            id: userId,
            client: 'telegram',
          };

          centralService.joinQueue(userData);

          await sendNotification({
            message: 'We are looking for a match for you',
          }, userData);

          centralService.lookForMatch();
          break;
        case '/leavechat':
          centralService.leaveMatch(userId);
          break;
        default:
          centralService.sendMessage(update.message.from.id, update.message.text);
          break;
      }
    } else {
      if (update.message.photo) {

      } else if (update.message.video) {

      } else if (update.message.voice) {

      }
    }
  }

  return successResponse(res,
      {}, '');
});

const sendMessage = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  const {text} = req.body;

  const result = await telegramBotService.sendMessage(userId, text);

  if (result.data.ok) {
    return successResponse(res,
        _.pick(result.data.result, [
          'date',
          'text',
        ]),
        'Successfully sent message');
  } else {
    return errorResponse(res,
        400,
        result.data.description);
  }
});

const setWebhook = asyncHandler(async (req, res) => {
  // eslint-disable-next-line max-len
  const url = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/setWebhook?url=${ config.app.telegram_webhook_url }`;

  const result = await axios.get(url);

  return successResponse(res,
      result.data,
      'Successfully set up webhook');
});

const webhookInfo = asyncHandler(async (req, res) => {
  // eslint-disable-next-line max-len
  const url = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/getWebhookInfo`;

  const result = await axios.get(url);

  return successResponse(res,
      result.data,
      'Webhook info');
});

const getUpdates = asyncHandler(async (req, res) => {
  // eslint-disable-next-line max-len
  const url = `${ config.app.telegram_url }/bot${ config.app.telegram_bot_token }/getUpdates`;

  const result = await axios.get(url);

  return successResponse(res,
      result.data,
      'updates');
});

module.exports = {
  botMainController,
  setWebhook,
  sendMessage,
  webhookInfo,
  getUpdates,
};
