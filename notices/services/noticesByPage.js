const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const { getNoticeUrl, makeNoticeObj, addNoticeHref } = require("../util");
const { maxCacheTimeout } = require("../util/constant");

async function noticesByPage(pageNum = 0) {
    const startDataNumToSend = Number(pageNum) * 23;
    const dataNumToSend = (Number(pageNum) + 1) * 23;
    const allData = this.getCache("all");

    const cachedTime = this.getCachedTime("all");
    const isSafeCache = (Date.now() - cachedTime) / 1000 < maxCacheTimeout;

    if (
        allData.length === 0 ||
        !isSafeCache ||
        dataNumToSend > allData.length ||
        !allData[startDataNumToSend]
    ) {
        const request = await axios({
            method: "GET",
            url: getNoticeUrl(pageNum),
        });

        const root = parse(request.data);
        const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");
        const notices = makeNoticeObj(noticesData);

        const noticesHref = root.querySelectorAll(".tl>a");
        addNoticeHref(noticesHref, notices);

        this.addCache("all", notices, startDataNumToSend, dataNumToSend);
        const data = {
            startIdx: startDataNumToSend,
            endIdx: dataNumToSend,
            notices,
            length: notices.length,
        };

        return data;
    }

    console.log(allData[startDataNumToSend], dataNumToSend, allData.length);
    if (allData[startDataNumToSend] && dataNumToSend <= allData.length) {
        const notices = allData.slice(startDataNumToSend, dataNumToSend);
        const data = {
            startIdx: startDataNumToSend,
            endIdx: dataNumToSend,
            notices,
            length: notices.length,
        };

        return data;
    }
}

module.exports = noticesByPage;
