const { maxCacheTimeout, parallelRequestNum } = require("../util/constant");
const getNotices = require("./repository/getNotices");

async function noticesByCountAndType(type, num) {
    const typedData = this.getCachedTime(type);
    const cachedTime = this.getCachedTime(type);
    const isSafeCache = (Date.now() - cachedTime) / 1000 < maxCacheTimeout;
    if (!isSafeCache) {
        this.clearCache(type);
    }

    let discoverability = true;
    let page = 0;
    let temp = 0;
    if (
        typedData.length === 0 ||
        !isSafeCache ||
        num > typedData.length ||
        !typedData[0]
    ) {
        while (
            this.getCache(type).filter((el) => el).length < num &&
            discoverability
        ) {
            // NOTE : 성능 개선을 위해 병렬적으로 request를 보내도록 한다.
            const promise = new Array(parallelRequestNum).fill(0).map(
                (el) =>
                    new Promise((resolve, reject) => {
                        resolve(getNotices(page++, type));
                    })
            );
            await Promise.all(promise)
                .then((res) => {
                    let values = res.flat(Infinity);

                    if (values.length === parallelRequestNum) {
                        const { title, date, view, fixed } = values[0];
                        if (!title && !date && !view) {
                            throw Error("NONE");
                        }

                        values = values.filter(
                            (el) => el.title && el.date && el.view
                        );
                    }

                    this.addCache(type, values, temp, temp + values.length);
                    temp += values.length;
                })
                .catch((error) => {
                    if (error.message === "NONE") {
                        console.log("더 이상 데이터가 없습니다.");
                        discoverability = false;
                    }
                });
        }
    }

    const notices = this.getCache(type, num);
    const length = notices.length;
    const data = { startIdx: 0, lastIdx: length - 1, length, notices };
    return data;
}

module.exports = noticesByCountAndType;
