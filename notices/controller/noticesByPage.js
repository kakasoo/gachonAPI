const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const replaceall = require("replaceall");
const { getNoticeUrl } = require("../util");

const re = /[\[공통\]|\[글로벌\]\[메디컬\]].+/g;

// 첫 페이지는 0부터 세야 합니다.
const noticesByPage = async (req, res, next) => {
    const pageNum = req.params.pageNum || 0;

    const request = await axios({
        method: "GET",
        url: getNoticeUrl(pageNum),
    });

    const root = parse(request.data);
    const noticesData = root.querySelectorAll(".tl>a");

    const noticeTitles = noticesData.map((noticeData) => {
        const [title] = noticeData.innerHTML.match(re);
        const rawAttributesHref = `https://www.gachon.ac.kr/community/opencampus/${noticeData.rawAttributes.href}`;
        const href = replaceall("&amp;", "&", rawAttributesHref);
        return { title, href };
    });

    res.json({
        length: noticeTitles.length,
        data: {
            notices: noticeTitles, // notice : { title : '' , href : 'https://' }
        },
    });
};

module.exports = noticesByPage;
