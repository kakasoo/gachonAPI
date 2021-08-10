const getNotices = require("./repository/getNotices");
const {
    maxCacheTimeout,
    noticesNumberOfOnePages,
} = require("../util/constant");

async function noticesByPage(pageNum = 0, type = "all") {
    const startIdx = Number(pageNum) * noticesNumberOfOnePages;
    const lastIdx = (Number(pageNum) + 1) * noticesNumberOfOnePages;
    const allData = this.getCache(type);

    const cachedTime = this.getCachedTime(type);
    const isSafeCache = (Date.now() - cachedTime) / 1000 < maxCacheTimeout;
    if (!isSafeCache) {
        this.clearCache(type);
    }

    let notices;
    let length;

    if (
        allData.length === 0 ||
        lastIdx > allData.length ||
        !allData[startIdx]
    ) {
        notices = await getNotices(pageNum, type);
        length = notices.length;

        this.addCache(type, notices, startIdx, lastIdx);
    }

    if (allData[startIdx] && lastIdx <= allData.length) {
        notices = allData.slice(startIdx, lastIdx);
        length = notices.length;
    }

    const data = { startIdx, lastIdx, length, notices };

    return data;
}

module.exports = noticesByPage;
