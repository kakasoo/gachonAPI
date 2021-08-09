const replaceall = require("replaceall");

const getNoticeUrl = (pageNum = 0) => {
    const url = `https://www.gachon.ac.kr/community/opencampus/03.jsp?pageNum=${pageNum}&pageSize=20&boardType_seq=358&approve=&secret=&answer=&branch=&searchopt=&searchword=`;
    return url;
};

const makeNoticeObj = (noticesData) => {
    return noticesData.map((el) => {
        const noticeValues = el.structuredText.split("\n");
        if (noticeValues.length === 3) {
            const [title, date, view] = noticeValues;
            return { id: null, title, date, view, fixed: true };
        }

        const [id, title, date, view] = noticeValues;
        return { id, title, date, view, fixed: false };
    });
};

const addNoticeHref = (noticesHref, origin) => {
    noticesHref.map((noticeHref, i) => {
        const rawAttributesHref = `https://www.gachon.ac.kr/community/opencampus/${noticeHref.rawAttributes.href}`;
        const href = replaceall("&amp;", "&", rawAttributesHref);

        origin[i].href = href;
    });
};

module.exports = { getNoticeUrl, makeNoticeObj, addNoticeHref };
