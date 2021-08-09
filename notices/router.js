const express = require("express");
const controller = require("./controllers");

const router = express.Router();

router.get("/", controller.recentNotices);
router.get("/:pageNum", controller.noticesByPage);

module.exports = router;
