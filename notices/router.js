const express = require("express");
const controller = require("./controllers");

const router = express.Router();

router.get("/", controller.noticesByPage);
router.get("/count", controller.noticesByCountAndType);
router.get("/search", controller.noticesBySearch);

module.exports = router;
