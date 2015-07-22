var fs = require('fs');
var cheerio = require('cheerio');

var encoding = 'utf8';
// encoding = 'latin1';

module.exports = function (srcFile) {
  fs.readFile(srcFile, encoding, function (err, data) {
    if (err) {
      console.log('parser error: ', err);
      return false;
    }
    var $ = cheerio.load(data);
    console.log($('body').text());
    return true;
  });
  // var $ = cheerio.load(srcFile);
  // console.log($('body').text());
};
