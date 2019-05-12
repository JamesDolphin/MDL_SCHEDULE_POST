const request = require('request');
const cheerio = require('cheerio');

const matchArray = [];
const teamList = [];

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const getMatches = date => new Promise((resolve, reject) => {
  const url = `https://play.esea.net/index.php?s=league&d=schedule&date=${date}&game_id=25&division_level=premier`;
  request(url, (error, response, html) => {
    if (!error && response.statusCode === 200) {
      const $ = cheerio.load(html);


      const A = $('.match-overview table td').filter((i, n) => !$(n).hasClass('stat')).map((i, n) => $(n).text().trim()).toArray()
        .join(' ');


      teamList.push(A);


      // $('.match-overview table tbody').each((i, el) => {
      //   let newMatch = $(el).text();
      //   newMatch = newMatch.replace(/ *\([^)]*\) */g, ' ');
      //   newMatch = newMatch.replace(/,/g, '');
      //   newMatch = newMatch.replace(/[()]/g, ' ');
      //   newMatch = newMatch.replace(/H1H2OTT/g, '');
      //   newMatch = newMatch.replace(/ {2}/g, ' ');

      //   matchArray.push(`${date}${newMatch}`);
      // });

      // resolve();
    } else {
      // reject();
    }
    resolve();
  });
});

const doAllDates = async () => {
  const now = new Date();
  for (let d = new Date(2019, 3, 28); d <= now; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dateFormatted = (`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    await getMatches(dateFormatted);
  }

  for (let x = 0; x < teamList.length; x += 1) {
    teamList[x] = teamList[x].replace(/ *\([^)]*\) */g, '');
    console.log(teamList[x]);

    teamList[x].split(' ');
  }


  // teamList = teamList.filter(onlyUnique);
  // console.log(teamList);
  console.log(matchArray);
};

doAllDates();
