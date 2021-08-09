const express = require("express");
const { recentNotices } = require("./controller");

const router = express.Router();

router.get("/", recentNotices);

module.exports = router;
