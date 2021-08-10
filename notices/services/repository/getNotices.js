const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const { getNoticeUrl, makeNoticeObj, addNoticeHref } = require("../../util");

async function getNotices(pageNum, type) {
    const request = await axios({
        method: "GET",
        url: getNoticeUrl(pageNum, type),
    });

    const root = parse(request.data);
    const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");
    const notices = makeNoticeObj(noticesData);

    const noticesHref = root.querySelectorAll(".tl>a");
    addNoticeHref(noticesHref, notices);

    return notices;
}

module.exports = getNotices;
