const getNotices = require("../services/noticesByPage");

// 첫 페이지는 0부터 세야 합니다.
const noticesByPage = async (req, res, next) => {
    const pageNum = req.params.pageNum || 0;
    const notices = await getNotices(pageNum);

    res.json({
        length: notices.length,
        data: {
            notices, // notice : { title : '' , href : 'https://' }
        },
    });
};

module.exports = noticesByPage;
