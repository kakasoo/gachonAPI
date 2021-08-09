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
const serviceNoticesByPage = require("../services/noticesByPage");
const noticesByCountAndType = require("./noticesByCountAndType");

class NoticeController {
    constructor() {
        this.cache = {
            all: { cachedTime: Date.now(), data: [] },
            common: { cachedTime: Date.now(), data: [] },
            global: { cachedTime: Date.now(), data: [] },
            medical: { cachedTime: Date.now(), data: [] },
        };

        /**
         * seed data를 넣기 위해 만든 것인데, 테러로 오해받을 수 있으니,
         * 모든 production level에서만 사용하도록 한다.
         */
        // (function seedData() {
        //     new Array(10)
        //         .fill(0)
        //         .map((el, i) => i)
        //         .forEach(async (el, i) => {
        //             serviceNoticesByPage.call(this, Number(el));
        //         });
        // }.bind(this)());
    }

    recentNotices = recentNotices.bind(this);
    noticesByPage = noticesByPage.bind(this);
    noticesByCountAndType = noticesByCountAndType.bind(this);

    clearCache(name) {
        this.setCache(name, []);
    }

    setCache(name, value) {
        this.cache[name].data = value;
    }

    addCache(name, value, start, end) {
        for (let i = start; i < end; i++) {
            this.cache[name].data[i] = value[i - start];
        }
    }

    getCache(name, num = Infinity) {
        return this.cache[name].data.slice(0, num);
    }

    getCachedTime(name) {
        return this.cache[name].cachedTime;
    }
}

module.exports = new NoticeController();
