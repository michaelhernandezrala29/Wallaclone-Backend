"use strict";

const readLine = require("readline");

const utils = {
  askUser(question) {
    return new Promise((resolve) => {
      const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  },

  isAPI(req) {
    return req.originalUrl.indexOf("/api") === 0;
  },

  buildAnuncioFilterFromReq(req) {
    const filters = {};

    if (req.query.tag) {
      filters.tags = { $in: req.query.tag };
    }

    if (typeof req.query.sell !== "undefined") {
      filters.sell = req.query.sell;
    }

    if (typeof req.query.price !== "undefined" && req.query.price !== "-") {
      if (req.query.price.indexOf("-") !== -1) {
        filters.price = {};
        let rango = req.query.price.split("-");
        if (rango[0] !== "") {
          filters.price.$gte = rango[0];
        }

        if (rango[1] !== "") {
          filters.price.$lte = rango[1];
        }
      } else {
        filters.price = req.query.price;
      }
    }

    if (typeof req.query.name !== "undefined") {
      filters.name = new RegExp("^" + req.query.name, "i");
    }

    return filters;
  },
};

module.exports = utils;
