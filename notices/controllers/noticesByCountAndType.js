const getNotices = require("../services/noticesByCountAndType");
const { noticesNumberOfOnePages } = require("../util/constant");

// 첫 페이지는 0부터 세야 합니다.
async function noticesByCount(req, res, next) {
    const type = req.query.type || "all"; // all, common, global, medical
    const num = req.query.num || noticesNumberOfOnePages;

    const notices = await getNotices.call(this, type, num);

    res.json({
        data: {
            notices,
        },
    });
}

module.exports = noticesByCount;
