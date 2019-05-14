const request = require('request');
const cheerio = require('cheerio');

const matchArray = [];
const teamList = [];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const getMatches = dateNow => new Promise((resolve, reject) => {
  const url = `https://play.esea.net/index.php?s=league&d=schedule&date=${dateNow}&game_id=25&division_level=premier`;
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);


      $('.match-overview table tbody').each((i, el) => {
        let history = $(el).clone().children('td');
        history = history.find('*').remove().text();

        console.log(history);


        let newMatch = $(el).text();
        newMatch = newMatch.replace(/ *\([^)]*\) */g, ' ');
        newMatch = newMatch.replace(/,/g, '');
        newMatch = newMatch.replace(/[()]/g, ' ');
        newMatch = newMatch.replace(/H1H2OTT/g, '');
        newMatch = newMatch.replace(/ {2}/g, ' ');

        newMatch.replace(/ *\([^)]d*\) */g, '');

        matchArray.push(`${dateNow}${newMatch}`);
      });

      // resolve();
    } else {
      // reject();
    }
    resolve();
  });
});


const getTeams = region => new Promise((resolve, reject) => {
  const url = `https://play.esea.net/index.php?s=league&d=standings&division_id=${region}`;
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);

      $('table tbody td a').each((i, el) => {
        const teamName = $(el).text();
        teamList.push(teamName);
      });

      // resolve();
    } else {
      // reject();
    }
    resolve();
  });
});

const doAllDates = async () => {
  await getTeams('3260');


  const now = new Date();
  for (let d = new Date(2019, 3, 28); d <= now; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dateFormatted = (`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    await getMatches(dateFormatted);
  }
  console.log(teamList);
};

doAllDates();
