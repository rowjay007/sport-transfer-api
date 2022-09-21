// @ts-nocheck
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

const details = [];
const PORT = 8080;

app.get("/", (req, res) => {
  res.json("Hello World!");
});

app.get("/transfer", (req, res) => {
  axios
    .get("https://www.dailymail.co.uk/sport/transfernews")
    .then(function (response) {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("transfer")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        details.push({
          title,
          url,
        });
      });
      res.json(details);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
