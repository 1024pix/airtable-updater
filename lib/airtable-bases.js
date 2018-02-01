'use strict';
const Airtable = require('airtable');

const pix = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY_PIX }).base(process.env.AIRTABLE_BASE_PIX);
const tutos = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY_TUTOS }).base(process.env.AIRTABLE_BASE_TUTOS);

module.exports = {
  pix,
  tutos
};
