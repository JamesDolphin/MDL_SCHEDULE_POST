const rp = require('request-promise');
const $ = require('cheerio');

const potusParse = function (url) {
  return rp(url)
    .then(html => ({
      name: $('.firstHeading', html).text(),
      birthday: $('.bday', html).text(),
    }))
    .catch((err) => {
      // handle error
    });
};

module.exports = potusParse;
