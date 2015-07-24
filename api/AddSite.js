import URL from 'url-parse';
import Options from '../options';

function clearUrl(url) {
  return url.replace('www.', '');
}

export default function AddSite (req, res) {
  if (!req.body.url) {
    res.sendStatus(200)
  } else {
    const siteURL = URL(req.body.url, true);
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
                    db.run(
                      "INSERT INTO page_list (title, site_id, status, date_create) VALUES (?, ?, ?, ?)",
                      ['/', siteID, 0, new Date()],
                      function (err, row) {
                        if (err) {
                          resJson.status = 500;
                          resJson.text = 'db error.';
                          resJson.body = err;
                          res.json(resJson);
                        } else {
                          resJson.status = 200;
                          resJson.text = 'Site ' + clearURL + ' add success under ID - ' + siteID;
                          res.json(resJson);
                        }
                      }
                    );
                  }
                }
              );
            }         
        });
      });
    }
  }
};
