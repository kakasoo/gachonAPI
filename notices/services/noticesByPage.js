const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const replaceall = require("replaceall");
const { getNoticeUrl } = require("../util");

const re = /[\[공통\]|\[글로벌\]\[메디컬\]].+/g;

const noticesByPage = async (pageNum) => {
    const request = await axios({
        method: "GET",
        url: getNoticeUrl(pageNum),
    });

    const root = parse(request.data);
    const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");

    const notices = noticesData.map((el) => {
        const noticeValues = el.structuredText.split("\n");
        if (noticeValues.length === 3) {
            const [title, date, view] = noticeValues;
            return { id: null, title, date, view, fixed: true };
        }

        const [id, title, date, view] = noticeValues;
        return { id, title, date, view, fixed: false };
    });

    const noticesHref = root.querySelectorAll(".tl>a");
    noticesHref.map((noticeHref, i) => {
        const rawAttributesHref = `https://www.gachon.ac.kr/community/opencampus/${noticeHref.rawAttributes.href}`;
        const href = replaceall("&amp;", "&", rawAttributesHref);

        notices[i].href = href;
    });

    return notices;
};

module.exports = noticesByPage;
