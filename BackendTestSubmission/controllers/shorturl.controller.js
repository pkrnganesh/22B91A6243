const db = require("../models/url.model");
const generateShortcode = require("../utils/generateShortcode");
const log = require("../../LoggingMiddleware/logger");
const moment = require("moment");

const BASE_URL = "http://localhost:3000/shorturls/r";

exports.createShortUrl = async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;

  if (!url) {
    await log("backend", "error", "controller", "Missing URL");
    return res.status(400).json({ error: "URL is required" });
  }

  const code = shortcode || generateShortcode();
  const expiry = moment().add(validity, "minutes").toISOString();

  if (db[code]) {
    await log("backend", "error", "controller", "Shortcode already exists");
    return res.status(409).json({ error: "Shortcode already exists" });
  }

  db[code] = {
    originalUrl: url,
    createdAt: new Date().toISOString(),
    expiry,
    clicks: [],
    validity
  };

  await log("backend", "info", "controller", "Short URL created");

  res.status(201).json({
    shortLink: `${BASE_URL}/${code}`,
    expiry
  });
};

exports.getStats = async (req, res) => {
  const { shortcode } = req.params;
  const entry = db[shortcode];

  if (!entry) {
    await log("backend", "error", "controller", "Shortcode not found in stats");
    return res.status(404).json({ error: "Shortcode not found" });
  }

  await log("backend", "info", "controller", "Fetched stats");

  res.json({
    originalUrl: entry.originalUrl,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    clicks: entry.clicks.length,
    clickDetails: entry.clicks
  });
};

exports.redirectToUrl = async (req, res) => {
  const { shortcode } = req.params;
  const entry = db[shortcode];

  if (!entry) {
    await log("backend", "error", "controller", "Shortcode not found for redirection");
    return res.status(404).send("Short URL not found");
  }

  const now = new Date();
  if (new Date(entry.expiry) < now) {
    await log("backend", "warn", "controller", "Short URL expired");
    return res.status(410).send("Short URL expired");
  }

  entry.clicks.push({
    timestamp: new Date().toISOString(),
    source: req.headers["user-agent"] || "unknown",
    ip: req.ip || "unknown"
  });

  await log("backend", "info", "controller", "Redirected to original URL");

  res.redirect(entry.originalUrl);
};
