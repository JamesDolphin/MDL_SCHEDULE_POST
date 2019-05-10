const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const creds = require('../auth/auth.json');

const sheetWidth = Number(25);

require('dotenv').config();

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet(process.env.SHEETID);
let sheet;

async.series([
  function setAuth(step) {
    // see notes below for authentication instructions!
    doc.useServiceAccountAuth(creds, step);
  },
  function getInfoAndWorksheets(step) {
    doc.getInfo((err, info) => {
      console.log(`Loaded doc: ${info.title} by ${info.author.email}`);
      sheet = info.worksheets[0];
      console.log(`sheet 1: ${sheet.title} ${sheet.rowCount}x${sheet.colCount}`);
      step();
    });
  },
  function workingWithCells(step) {
    sheet.getCells({
      'min-row': 1,
      'max-row': 10,
      'return-empty': true,
    }, (err, cells) => {
      const cell = cells[5 + sheetWidth * 1];
      console.log(`Cell Row: ${cell.row}, Column: ${cell.col}  =  ${cell.value}`);
      cell.value = 123456;
      cell.save(); // async
      step();
    });
  },
], (err) => {
  if (err) {
    console.log(`Error: ${err}`);
  }
});
