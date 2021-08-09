const noticesByPage = require("./noticesByPage");

const recentNotices = async (req, res, next) => noticesByPage(req, res, next);

module.exports = recentNotices;
