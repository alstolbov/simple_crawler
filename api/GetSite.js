import URL from 'url-parse';
import Options from '../options';

function clearUrl(url) {
  return url.replace('www.', '');
}

export default function AddSite (req, res) {

  const siteURL = URL(req.query.url || false, true);
  const db = Options.db;
  let clearURL;
  const resJson = {
    status: '',
    text: ''
  };

  if (!siteURL) {
    clearURL = 'undefined';
    resJson.status = 404;
    resJson.text = 'no site url';
    res.json(resJson);
  } else {
    clearURL = clearUrl(siteURL.hostname);
    db.serialize(function() {
      db.each("select count(id) as count, * from site_list where title = '" + clearURL + "'", function(err, row) {
          if (row.count) {
            resJson.status = 200;
            resJson.text = row;
          } else {
            resJson.status = 300;
            resJson.text = 'no site eat';
          }

          res.json(resJson);
      });
    });
  }

};
