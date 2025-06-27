const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  getStats,
  redirectToUrl
} = require("../controllers/shorturl.controller");

router.post("/", createShortUrl);
router.get("/:shortcode", getStats);
router.get("/r/:shortcode", redirectToUrl);

module.exports = router;
