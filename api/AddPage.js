import URL from 'url-parse';
import {parseUrl, getHost} from '../utils/url-utils';
import Options from '../options';

export default function AddSite (req, res) {
  const db = Options.db();
  const resJson = {
    status: '',
    text: ''
  };

  if (!req.body.url) {
      resJson.status = 404;
      resJson.text = 'no page url';
      res.json(resJson);
  } else {
    const url = parseUrl(req.body.url);
    const clearURL = getHost(req.body.url);
    /*
    resJson.status = 300;
    res.json(resJson);
    */
    db.serialize(function() {
      db.each("select count(id) as count, date_create from site_list where title = '" + clearURL + "'", function(err, row) {
          if (row.count) {
            resJson.status = 300;
            resJson.text = 'Site ' + clearURL + ' exist from ' + new Date(row.date_create);
            res.json(resJson);
          } else {
            db.run(
              "INSERT INTO site_list (title, status, date_create) VALUES (?, ?, ?)",
              [clearURL, 0, new Date()],
              function (err, row) {
                if (err) {
                  resJson.status = 500;
                  resJson.text = 'db error.';
                  resJson.body = err;
                  res.json(resJson);
                } else {
                  const siteID = this.lastID;
                  const siteLinks = [];
                  siteLinks.push()
                  const stmt = db.prepare("INSERT INTO page_list (title, site_id, status, date_create) VALUES (?, ?, ?, ?)");
                  stmt.run(['/', siteID, 0, new Date()]);
                  if (url.pathname !== '' &&
                    url.pathname !== '/'
                  ) {
                    stmt.run([url.pathname, siteID, 0, new Date()]);
                  }
                  stmt.finalize();
                  resJson.status = 200;
                  resJson.text = 'Site ' + clearURL + ' add success under ID - ' + siteID;
                  res.json(resJson);
                }
              }
            );
          }         
      });
    });
  }
};
