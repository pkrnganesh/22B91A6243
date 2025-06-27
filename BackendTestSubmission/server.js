const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());

const shorturlRoutes = require("./routes/shorturl");
app.use("/shorturls", shorturlRoutes);

app.get("/", (req, res) => {
  res.send("Backend URL Shortener is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
