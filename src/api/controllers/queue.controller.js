const asyncHandler = require('../../helpers/error/asyncHandler');
const {successResponse} = require('../../utils/responses');
const {queue} = require('../../database/models/Queue');

const getAll = asyncHandler(async (req, res) => {
  const list = queue.getQueue();

  return successResponse(res, list, 'Queues List');
});

module.exports = {
  getAll,
};
