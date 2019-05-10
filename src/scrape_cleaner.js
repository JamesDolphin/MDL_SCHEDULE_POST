const request = require('request');
const cheerio = require('cheerio');

const matchArray = [];

const getMatches = date => new Promise((resolve, reject) => {
  const url = `https://play.esea.net/index.php?s=league&d=schedule&date=${date}&game_id=25&division_level=premier`;
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);

      $('.match-overview table tbody').each((i, n) => {
        matchArray.push(`${date} ${$('.match-overview table td').filter((i, n) => !$(n).hasClass('stat')).map((i, n) => $(n).text().trim()).toArray()
          .join(' vs ')}`);
      });

      // put a break at line 35. Output is almost correct. Need each element to only contain 1 match not all on that date


      // resolve();
    } else {
      // reject();
    }
    resolve();
  });
});

const doAllDates = async () => {
  const now = new Date(2019, 4, 30);
  for (let d = new Date(2019, 3, 28); d <= now; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dateFormatted = (`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    await getMatches(dateFormatted); // how can i wait for EVERY iteration to finish here
  }
  console.log(matchArray);
};

doAllDates();
