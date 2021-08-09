const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const { getNoticeUrl, makeNoticeObj, addNoticeHref } = require("../util");
const { maxCacheTimeout } = require("../util/constant");

async function getNotices(pageNum) {
    const request = await axios({
        method: "GET",
        url: getNoticeUrl(pageNum),
    });

    const root = parse(request.data);
    const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");
    const notices = makeNoticeObj(noticesData);

    const noticesHref = root.querySelectorAll(".tl>a");
    addNoticeHref(noticesHref, notices);

    return notices;
}

async function noticesByPage(pageNum = 0) {
    const startIdx = Number(pageNum) * 23;
    const lastIdx = (Number(pageNum) + 1) * 23;
    const allData = this.getCache("all");

    const cachedTime = this.getCachedTime("all");
    const isSafeCache = (Date.now() - cachedTime) / 1000 < maxCacheTimeout;

    let notices;
    let length;

    if (
        allData.length === 0 ||
        !isSafeCache ||
        lastIdx > allData.length ||
        !allData[startIdx]
    ) {
        notices = await getNotices(pageNum);
        length = notices.length;

        if (allData[startIdx]) {
            this.clearCache("all");
        }
        this.addCache("all", notices, startIdx, lastIdx);
    }

    if (allData[startIdx] && lastIdx <= allData.length) {
        notices = allData.slice(startIdx, lastIdx);
        length = notices.length;
    }

    const data = { startIdx, lastIdx, length, notices };

    return data;
}

module.exports = noticesByPage;
