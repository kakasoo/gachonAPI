const getNotices = require("./getNotices");
const {
    maxCacheTimeout,
    noticesNumberOfOnePages,
} = require("../util/constant");

async function noticesByPage(pageNum = 0) {
    const startIdx = Number(pageNum) * noticesNumberOfOnePages;
    const lastIdx = (Number(pageNum) + 1) * noticesNumberOfOnePages;
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

        // lastIdx가 allData보다 크거나 캐시 시간이 끝난 상황
        if (allData[startIdx]) {
            this.clearCache("all");
            this.getSeedData();
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
