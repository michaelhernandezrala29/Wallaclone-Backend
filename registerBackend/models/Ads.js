"use strict";

const mongoose = require("mongoose");
const fs = require("fs-extra");
const path = require("path");
const cote = require("cote");
const fsPromises = require("fs").promises;

const { IMAGE_URL_BASE_PATH } = process.env;

const thumbnailRequester = new cote.Requester(
  {
    name: "thumbnail creator client",
  },
  { log: false, statusLogsEnabled: false }
);

const adsSchema = mongoose.Schema({
  name: { type: String, index: true },
  sell: { type: Boolean, index: true },
  price: { type: Number, index: true },
  photo: String,
  tags: { type: [String], index: true },
});

// lista de tags permitidos
adsSchema.statics.allowedTags = function () {
  return ["work", "lifestyle", "motor", "mobile"];
};

/**
 * carga un json de anuncios
 */
adsSchema.statics.cargaJson = async function (fichero) {
  const data = await fsPromises.readFile(fichero, { encoding: "utf8" });

  if (!data) {
    throw new Error(fichero + " está vacio!");
  }

  const ads = JSON.parse(data).ads;

  for (var i = 0; i < ads.length; i++) {
    await new Ads(ads[i]).save();
  }

  return ads.length;
};

adsSchema.statics.createRecord = function (nuevo, cb) {
  new Ads(nuevo).save(cb);
};

adsSchema.statics.list = async function (
  filters,
  startRow,
  numRows,
  sortField,
  includeTotal,
  cb
) {
  const query = Anuncio.find(filters);
  query.sort(sortField);
  query.skip(startRow);
  query.limit(numRows);
  // query.select('nombre venta');

  const result = {};

  if (includeTotal) {
    result.total = await Anuncio.count();
  }
  result.rows = await query.exec();

  // poner ruta base a imagenes
  result.rows.forEach(
    (r) => (r.foto = r.foto ? path.join(IMAGE_URL_BASE_PATH, r.foto) : null)
  );

  if (cb) return cb(null, result);
  return result;
};

adsSchema.methods.setFoto = async function ({
  path: imagePath,
  originalname: imageOriginalName,
}) {
  if (!imageOriginalName) return;

  const imagePublicPath = path.join(
    __dirname,
    "../public/images/anuncios",
    imageOriginalName
  );
  await fs.copy(imagePath, imagePublicPath);

  this.foto = imageOriginalName;

  //TODO: Ver si quitamos o no la miniatura
  // Create thumbnail
  thumbnailRequester.send({ type: "createThumbnail", image: imagePublicPath });
};

var Ads = mongoose.model("Ads", adsSchema);

module.exports = Ads;
