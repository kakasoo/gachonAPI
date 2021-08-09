const express = require("express");
const { getAllNotices } = require("./controller");

const router = express.Router();

router.get("/", getAllNotices);

module.exports = router;
