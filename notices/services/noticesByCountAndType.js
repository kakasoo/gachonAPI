const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const { getNoticeUrl, makeNoticeObj, addNoticeHref } = require("../util");

// all, common, global, medical
const types = {
    all: /[\[공통\]|\[글로벌\]\[메디컬\]] .+/,
    common: /\[공통\] .+/,
    global: /\[글로벌\] .+/,
    medical: /\[메디컬\] .+/,
};

async function noticesByCountAndType(type, num) {
    const RegExpTypeToRequest = types[type] || types["all"];

    let notices = [];

    const promiseFunc = async (page) => {
        const request = await axios({
            method: "GET",
            url: getNoticeUrl(page),
        });

        const root = parse(request.data);
        const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");
        const noticeToCount = makeNoticeObj(noticesData);

        const noticesHref = root.querySelectorAll(".tl>a");
        addNoticeHref(noticesHref, noticeToCount);

        const noticesToPush = noticeToCount.filter((notice) => {
            return (
                notice.fixed === false && RegExpTypeToRequest.exec(notice.title)
            );
        });
        return noticesToPush;
    };

    let page = 0;
    while (notices.length < num) {
        await Promise.all([
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
            promiseFunc(page++),
        ]).then((values) => {
            notices.push(...values.flat(Infinity));
        });
    }
    return notices.filter((el, i) => i + 1 <= num);
}

module.exports = noticesByCountAndType;
