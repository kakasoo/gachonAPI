const getNoticeUrl = (pageNum = 0) => {
    const url = `https://www.gachon.ac.kr/community/opencampus/03.jsp?pageNum=${pageNum}&pageSize=20&boardType_seq=358&approve=&secret=&answer=&branch=&searchopt=&searchword=`;
    return url;
};

module.exports = { getNoticeUrl };
