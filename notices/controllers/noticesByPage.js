const getNotices = require("../services/noticesByPage");

// 첫 페이지는 0부터 세야 합니다.
async function noticesByPage(req, res, next) {
    const pageNum = req.params.pageNum || 0;
    const notices = await getNotices.call(this, pageNum);

    console.log(123);
    res.json({
        length: notices.length,
        data: {
            notices,
        },
    });
}

module.exports = noticesByPage;
