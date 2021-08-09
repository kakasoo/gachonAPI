const { default: axios } = require("axios");
const { parse } = require("node-html-parser");
const { getNoticeUrl, makeNoticeObj, addNoticeHref } = require("../util");

const noticesByPage = async (pageNum) => {
    const request = await axios({
        method: "GET",
        url: getNoticeUrl(pageNum),
    });

    const root = parse(request.data);
    const noticesData = root.querySelectorAll(".boardlist>table>tbody>tr");
    const notices = makeNoticeObj(noticesData);

    const noticesHref = root.querySelectorAll(".tl>a");
    addNoticeHref(noticesHref, notices);

    return notices;
};

module.exports = noticesByPage;
