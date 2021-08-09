const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const replaceall = require("replaceall");

const re = /[\[공통\]|\[글로벌\]\[메디컬\]].+/g;

const recentNotices = async (req, res, next) => {
    const request = await axios({
        method: "GET",
        url: "https://www.gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358",
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

module.exports = recentNotices;
