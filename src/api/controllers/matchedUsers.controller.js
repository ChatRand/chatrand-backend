const asyncHandler = require('../../helpers/error/asyncHandler');
const {successResponse} = require('../../utils/responses');
const {matchedUsers} = require('../../database/models/MatchedUsers');

const getAll = asyncHandler(async (req, res) => {
  const list = matchedUsers.getAll();

  return successResponse(res, list, 'Queues List');
});

module.exports = {
  getAll,
};
