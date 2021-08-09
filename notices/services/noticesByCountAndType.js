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

const noticesByCountAndType = async (type, num) => {
    const RegExpTypeToRequest = types[type];

    let notices = [];

    let page = 0;
    while (notices.length < num) {
        const request = await axios({
            method: "GET",
            url: getNoticeUrl(page++),
        });

        const root = parse(request.data);
        const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");
        const noticeToCount = makeNoticeObj(noticesData);

        const noticesHref = root.querySelectorAll(".tl>a");
        addNoticeHref(noticesHref, noticeToCount);

        notices.push(
            ...noticeToCount.filter((notice, i) => {
                return (
                    notice.fixed === false &&
                    RegExpTypeToRequest.exec(notice.title)
                );
            })
        );
    }

    return notices.filter((el, i) => i + 1 <= num);
};

module.exports = noticesByCountAndType;
