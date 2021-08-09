// const recentNotices = require("./recentNotices");
// const noticesByPage = require("./noticesByPage");
// const noticesByCountAndType = require("./noticesByCountAndType");

// module.exports = {
//     recentNotices,
//     noticesByPage,
//     noticesByCountAndType,
// };

const recentNotices = require("./recentNotices");
const noticesByPage = require("./noticesByPage");
const noticesByCountAndType = require("./noticesByCountAndType");

class NoticeController {
    constructor() {
        this.cache = {
            all: { cachedTime: Date.now(), data: [] },
            common: { cachedTime: Date.now(), data: [] },
            global: { cachedTime: Date.now(), data: [] },
            medical: { cachedTime: Date.now(), data: [] },
        };
    }

    recentNotices = recentNotices.bind(this);
    noticesByPage = noticesByPage.bind(this);
    noticesByCountAndType = noticesByCountAndType.bind(this);

    setCache(name, value) {
        this.cache[name].data = value;
    }

    addCache(name, value) {
        this.cache[name].data = value.concat(this.cache[name].data);
    }

    getCache(name, num) {
        return this.cache[name].data.slice(0, num);
    }
    getCachedTime(name) {
        return this.cache[name].cachedTime;
    }
}

module.exports = new NoticeController();
