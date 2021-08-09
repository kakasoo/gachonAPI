const { maxCacheTimeout } = require("../util/constant");
const getNotices = require("./getNotices");

// all, common, global, medical
const types = {
    all: /[\[공통\]|\[글로벌\]\[메디컬\]] .+/,
    common: /\[공통\] .+/,
    global: /\[글로벌\] .+/,
    medical: /\[메디컬\] .+/,
};

const getNoticesByType = async (page, noticeTypeRegExp) => {
    const notices = await getNotices(page);
    const typedNotices = notices.filter((notice) => {
        return notice.fixed === false && noticeTypeRegExp.exec(notice.title);
    });

    return typedNotices;
};

async function noticesByCountAndType(type, num) {
    const startIdx = 0;
    const lastIdx = num - 1;
    const noticeTypeRegExp = types[type] || types["all"];

    const typedData = this.getCachedTime(type);
    const cachedTime = this.getCachedTime(type);
    const isSafeCache = (Date.now() - cachedTime) / 1000 < maxCacheTimeout;
    if (!isSafeCache) {
        this.clearCache(type);
    }

    let page = 0;
    let temp = 0;
    if (
        typedData.length === 0 ||
        !isSafeCache ||
        num > typedData.length ||
        !typedData[startIdx]
    ) {
        console.log((Date.now() - cachedTime) / 1000, maxCacheTimeout);

        while (this.getCache(type).filter((el) => el).length < num) {
            const promise = new Array(1).fill(5).map(
                (el) =>
                    new Promise((resolve, reject) => {
                        resolve(getNoticesByType(page++, noticeTypeRegExp, el));
                    })
            );

            await Promise.all(promise).then((res) => {
                const values = res.flat(Infinity);
                this.addCache(type, values, temp, temp + values.length);
                temp += values.length;
            });
        }
    }

    const notices = this.getCache(type, num);
    const length = notices.length;
    const data = { startIdx, lastIdx, length, notices };

    return data;
}

module.exports = noticesByCountAndType;
