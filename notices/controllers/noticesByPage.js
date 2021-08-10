const getNotices = require("../services/noticesByPage");

// 첫 페이지는 0부터 세야 합니다.
async function noticesByPage(req, res, next) {
    const type = req.query.type || "all"; // all, common, global, medical
    const pageNum = req.query.pageNum || 0;
    const notices = await getNotices.call(this, pageNum, type);

    res.json({
        data: {
            notices,
        },
    });
}

module.exports = noticesByPage;
