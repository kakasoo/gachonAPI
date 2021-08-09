const express = require("express");
const { noticesByPage, recentNotices } = require("./controller");

const router = express.Router();

router.get("/", recentNotices);
router.get("/:pageNum", noticesByPage);

module.exports = router;
