const getNotices = require("../services/noticesByPage");

async function recentNotices(req, res, next) {
    const notices = await getNotices.call(this);

    res.json({
        length: notices.length,
        data: {
            notices,
        },
    });
}

module.exports = recentNotices;
