const { maxCacheTimeout, parallelRequestNum } = require("../util/constant");
const getNotices = require("./repository/getNotices");

async function noticesBySearch(type, num, keyword, from, to) {
    const cachedTime = this.getCachedTime(type);
    const isSafeCache = (Date.now() - cachedTime) / 1000 < maxCacheTimeout;
    if (!isSafeCache) {
        this.clearCache(type);
    }

    const cachedNoticeToexec = this.getCache(type).filter(
        (el) => el.title && el.title.includes(keyword)
    );

    if (cachedNoticeToexec.length >= num) {
        return this.getCache(type)
            .filter((el) => el.title.includes(keyword))
            .slice(0, num);
    }

    let discoverability = true;
    let page = from;
    const searched = [];

    while (searched.length < num && discoverability && page <= to) {
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

                const temp = values.filter((el) => el.title.includes(keyword));
                searched.push(...temp);
            })
            .catch((error) => {
                if (error.message === "NONE") {
                    .log("더 이상 데이터가 없습니다.");
                    discoverability = false;
                }
            });
    }

    const data = {
        startIdx: 0,
        lastIdx: searched.length < num - 1 ? searched.length - 1 : num - 1,
        length: searched.length < num ? searched.length : num,
        notices: searched.slice(0, num),
    };
    return data;
}

module.exports = noticesBySearch;
