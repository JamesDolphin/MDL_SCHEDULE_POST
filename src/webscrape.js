const rp = require('request-promise');
const $ = require('cheerio');
const potusParse = require('./parse');

const url = 'https://play.esea.net/index.php?s=league&d=schedule&date=2019-05-14&game_id=25&division_level=premier';

rp(url)
  .then((html) => {
    console.log('File read');
    const eseaURLS = [];

    const OVERVIEW = ($('div.match-overview', html));
  })
  .then((presidents) => {
    console.log(presidents);
  })
  .catch((err) => {
    // handle error
    console.log(err);
  });
