const cheerio = require('cheerio');
const cloudscraper = require('cloudscraper');
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const creds = require('./auth.json');
require('dotenv').config();

const doc = new GoogleSpreadsheet(process.env.SHEETID);

const regions = [6];
let counter = 0;

const sheetWidth = Number(26);
const sheetTimer = Number(1000 * 60 * 10); // 5 mins

let sheet;
let matchArray = [];


// scrapes all relevant data from given url and pushes a formatted string into matchArray
const getMatches = (dateNow, id) => new Promise((resolve, reject) => {
  cloudscraper({
    url: 'https://play.esea.net/index.php',
    qs: {
      s: 'league',
      d: 'schedule',
      date: dateNow,
      region_id: id,
      game_id: 25,
      division_level: 'premier',
    },
  })
    .then((body) => {
      const $ = cheerio.load(body);
      const matches = $('.match-overview')
        .toArray()
        .map((_table) => {
          const table = $(_table);
          return {
            time: table.find('th').first().text().trim(),
            teams: table.find('td a').toArray().map(a => $(a).text()).filter(n => n)
              .join(' vs '),
          };
        });

      for (let x = 0; x < matches.length; x += 1) {
        matchArray.push(`${dateNow}   ${JSON.stringify(matches[x].time)}   ${matches[x].teams}`);
      }
      resolve();
    });
  // reject();
});


const doAllDates = async (id) => {
  matchArray = [];
  const max = regions.length - 1;
  const seasonEnd = new Date(2019, 11, 1);

  // loops all dates within hard coded times and pulls match information
  for (let d = new Date(2019, 8, 1); d <= seasonEnd; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dateFormatted = (`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    await getMatches(dateFormatted, id);
  }


  // pulls information from the matchArray and line by line loads the sheet with new cell information
  async.series([
    function setAuth(step) {
      // see notes below for authentication instructions!
      doc.useServiceAccountAuth(creds, step);
    },
    function getInfoAndWorksheets(step) {
      doc.getInfo((err, info) => {
        sheet = info.worksheets[counter];
        step();
      });
    },
    function workingWithCells(step) {
      sheet.getCells({
        'min-row': 1,
        'max-row': 998,
        'return-empty': true,
      }, (err, cells) => {
        for (let x = 0; x < (matchArray.length); x += 1) {
          cells[(x + 1) * sheetWidth].value = matchArray[x];
        }
        sheet.bulkUpdateCells(cells);

        step();
        counter += 1;
        if (counter <= max) {
          doAllDates(regions[counter]);
        } else {
          counter = 0;
        }
      });
    },
  ], (err) => {
    if (err) {
      console.log(`Error: ${err}`);
    }
  });
};

// sets the interval at which to update the google sheets
const updateTime = sheetTimer; // 5 mins
setInterval(() => {
  doAllDates(regions[0]);
}, updateTime);

doAllDates(regions[0]);
