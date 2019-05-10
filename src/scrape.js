const request = require('request');
const cheerio = require('cheerio');

request('https://play.esea.net/index.php?s=league&d=schedule&date=2019-05-08&game_id=25&division_level=premier', (error, response, html) => {
  if (!error && response.statusCode === 200) {
    const $ = cheerio.load(html);


    const gameStuff = $('.match-overview');

    console.log(gameStuff.text());
  }
});


// HELLO MC
// ASK FISH FOR AUTH FILE FOR GOOGLE SHEETS BTW
