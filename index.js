// @ts-nocheck
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();
const PORT = 8080;

const transferUpdates = [
  {
    name: "skysports",
    address: "https://www.skysports.com/transfer-centre",
    base: "https://www.skysports.com",
  },
  {
    name: "bbcnews",
    address: "https://www.bbc.com/sport/football/transfers",
    base: "https://www.bbc.com",
  },
  {
    name: "dailymail",
    address: "https://www.dailymail.co.uk/sport/index.html",
    base: "https://www.dailymail.co.uk",
  },
  {
    name: "mirroruk",
    address: "https://www.mirror.co.uk/sport/football/transfer-news/",
    base: "https://www.mirror.co.uk",
  },
  {
    name: "talksports",
    address: "https://talksport.com/football/transfer-rumours/",
    base: "https://talksport.com",
  },
  {
    name: "standarduk",
    address: "https://www.standard.co.uk/sport/football/transfer-news",
    base: "https://www.standard.co.uk",
  },
  {
    name: "expressuk",
    address: "https://www.express.co.uk/sport/football",
    base: "https://www.express.co.uk",
  },
  {
    name: "goal",
    address: "https://www.goal.com/en-ng/category/transfers",
    base: "https://www.goal.com",
  },
];

const details = [];
const specificDetails = [];

transferUpdates.forEach((transferUpdate) => {
  axios
    .get(transferUpdate.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("transfer")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        details.push({
          title,
          url: transferUpdate + url,
          source: transferUpdate.name,
        });
      });
    })
    .catch((err) => console.log(err));
});

app.get("/", (req, res) => {
  res.json("Welcome to Transfer News API");
});

app.get("/sports", (req, res) => {
  res.json(details);
});

app.get("/sports/:transferUpdateId", async (req, res) => {
  const transferUpdateId = req.params.transferUpdateId;

  const transferUpdateAddress = transferUpdates.filter(
    (transferUpdate) => transferUpdate.name == transferUpdateId
  )[0].address;
  const transferUpdateBase = transferUpdates.filter(
    (transferUpdate) => transferUpdate.name == transferUpdateId
  )[0].transferUpdateBase;

  axios
    .get(transferUpdateAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('a:contains("transfer")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificDetails.push({
          title,
          url: transferUpdateBase + url,
          source: transferUpdateId,
        });
      });
      res.json(specificDetails);
    })
    .catch((err) => console.log(err));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
