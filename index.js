var http = require('http');
var fs = require('fs');

var Parser = require('./parser');

var opt = {
  host: 'www.google.ru',
  path: '/',
  port: '80'
}

var fileName = './files/test.html';
var resHTML = '';

var wstream = fs.createWriteStream(fileName);

var request = http.request(opt, function (res) {
  res.on('data', function (data) {
    resHTML += data;
    wstream.write(data);
    console.log("The file was saved!");
  });
  res.on('end', function () {
    wstream.end();
    console.log('get page.');
    // writeData(fileName, resHTML)
    // Parser(fileName);
  });
});

request.on('error', function (e) {
    console.log(e.message);
});

request.end();

// function writeData (file, data) {
//   fs.writeFile(file, data, 'utf8', function (err) {
//     if (err) {
//       console.log(err);
//       return false;
//     }
//     console.log('file write ok.');
//     return true;
//   });
// }
