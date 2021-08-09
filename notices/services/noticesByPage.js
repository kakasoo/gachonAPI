const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const { getNoticeUrl, makeNoticeObj, addNoticeHref } = require("../util");
const { maxCacheTimeout } = require("../util/constant");

async function noticesByPage(pageNum = 0) {
    const preDataNumToSend = pageNum * 23;
    const dataNumToSend = (pageNum + 1) * 23;
    const allData = this.getCache("all");

    const cachedTime = this.getCachedTime("all");
    const isSafeCache = (Date.now() - cachedTime) / 1000 < maxCacheTimeout;

    if (allData.length === 0 || !isSafeCache) {
        //  || dataNum >= allData.elngth) {
        const request = await axios({
            method: "GET",
            url: getNoticeUrl(pageNum),
        });

        const root = parse(request.data);
        const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");
        const notices = makeNoticeObj(noticesData);

        const noticesHref = root.querySelectorAll(".tl>a");
        addNoticeHref(noticesHref, notices);

        this.setCache("all", notices);
        return notices;
    }

    if (dataNumToSend <= allData.length) {
        return allData.slice(preDataNumToSend, dataNumToSend);
    }
}

module.exports = noticesByPage;
