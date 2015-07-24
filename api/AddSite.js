import URL from 'url-parse';
import Options from '../options';

function clearUrl(url) {
  return url.replace('www.', '');
}

export default function AddSite (req, res) {

  const siteURL = URL(req.body.url || false, true);
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
      db.each("select count(id) as count, date_create from site_list where title = '" + clearURL + "'", function(err, row) {
          if (row.count) {
            resJson.status = 300;
            resJson.text = 'Site ' + clearURL + ' exist from ' + new Date(row.date_create);
          } else {
            db
              .prepare("INSERT INTO site_list (title, status, date_create, date_update) VALUES (?, ?, ?, ?)")
              .run(clearURL, 0, new Date(), new Date())
            ;
            resJson.status = 200;
            resJson.text = 'Site ' + clearURL + ' add success';
          }

          res.json(resJson);
      });
    });
  }

};
