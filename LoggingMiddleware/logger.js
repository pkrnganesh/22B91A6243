const axios = require('axios');
require('dotenv').config(); // Top of the file
// require('dotenv').config({ path: __dirname + '/.env' });
const API_URL = "http://20.244.56.144/evaluation-service/logs";
console.log("Using token:", process.env.ACCESS_TOKEN);
const ACCESS_TOKEN = process.env.ACCESS_TOKEN; 

async function log(stack, level, packageName, message) {
  try {
    const response = await axios.post(API_URL, {
      stack,
      level,
      package: packageName,
      message
    }, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    });

    console.log("Log Response:", response.data);
  } catch (err) {
    console.error("Logging failed:", err.response?.data || err.message);
  }
}

module.exports = log;
