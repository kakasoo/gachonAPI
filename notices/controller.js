const { default: axios } = require("axios");
const { parse } = require("node-html-parser");

const recentNotices = async (req, res, next) => {
    const request = await axios({
        method: "GET",
        url: "https://www.gachon.ac.kr/community/opencampus/03.jsp?boardType_seq=358",
    });

    const root = parse(request.data);
    const noticesData = root.querySelectorAll(".tl>a");

    const re = /[\[공통\]|\[글로벌\]\[메디컬\]].+/g;

    // for (const a of noticesData) {
    const noticeTitles = noticesData.map((noticeData) => {
        const [title] = noticeData.innerHTML.match(re);
        return title;
    });

    res.json({
        length: noticeTitles.length,
        data: noticeTitles,
    });
};

module.exports = { recentNotices };
