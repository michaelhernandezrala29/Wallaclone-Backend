"use strict";

require("dotenv").config();

const { askUser } = require("./lib/utils");
const { mongoose, Ads, User } = require("./models");
const { connectMongoose } = require("./lib/connectMongoose");

const ADS_JSON = "./ads.json";
require("./lib/i18nSetup");

main().catch((err) => console.error("Error!", err));

async function main() {
  await connectMongoose;

  const answer = await askUser(
    "Are you sure you want to empty DB and load initial data? (no) "
  );
  if (answer.toLowerCase() !== "yes") {
    console.log("DB init aborted! nothing has been done");
    return process.exit(0);
  }

  // Init our models
  const adsResult = await initAds(ADS_JSON);
  console.log(
    `\nAds: Deleted ${adsResult.deletedCount}, loaded ${adsResult.loadedCount} from ${ADS_JSON}`
  );

  const usersResult = await initUsers();
  console.log(
    `\nUsers: Deleted ${usersResult.deletedCount}, loaded ${usersResult.loadedCount.length}`
  );

  // Close  the DB
  await mongoose.connection.close();
  console.log("\nDone.");
  return process.exit(0);
}

async function initAds(fichero) {
  const { deletedCount } = await Ads.deleteMany();
  const loadedCount = await Ads.cargaJson(fichero);
  return { deletedCount, loadedCount };
}

async function initUsers() {
  const { deletedCount } = await User.deleteMany();
  const loadedCount = await User.insertMany([
    {
      name: "user",
      email: "user@example.com",
      password: User.hashPassword("1234"),
    },
    {
      name: "user2",
      email: "user2@example.com",
      password: User.hashPassword("4321"),
    },
  ]);
  return { deletedCount, loadedCount };
}
