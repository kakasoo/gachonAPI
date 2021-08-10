const getNotices = require("../services/noticesBySearch");

// 첫 페이지는 0부터 세야 합니다.
async function noticesBySearch(req, res, next) {
    const type = req.query.type || "all"; // all, common, global, medical
    const num = req.query.num || 10;
    const keyword = req.query.keyword || "";
    const from = 0;
    const to = req.query.to || 10;

    const notices = await getNotices.call(this, type, num, keyword, from, to);

    res.json({
        data: {
            notices,
        },
    });
}

module.exports = noticesBySearch;
