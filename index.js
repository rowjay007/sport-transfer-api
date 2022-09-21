const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

const PORT = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
