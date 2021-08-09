const getNotices = require("../services/noticesByCountAndType");

// 첫 페이지는 0부터 세야 합니다.
async function noticesByCount(req, res, next) {
    const type = req.query.type; // all, common, global, medical
    const num = req.query.num;
    const notices = await getNotices.call(this, type, num);

    res.json({
        length: notices.length,
        data: {
            notices,
        },
    });
}

module.exports = noticesByCount;
