import http from 'http';
import HtmlParser from './HtmlParser';
import resToApi from './utils/resToApi.js';
import Options from '../options';

const db = Options.db();

function getPage(site, next) {
  let page;
  db.get("select * from page_list where site_id = '" + site.id + "' AND status = '0' ORDER by date_create LIMIT 1", function(err, page) {
    if (page) {
      next(site, page);
    } else {
      console.log('All site page complete.');
      db.run("UPDATE site_list SET status = 1, date_update = ? WHERE id = ?", new Date(), site.id);
      SitePageDigger();
    }
  });
}

function callPage(site, page) {
  const options = {
    host: site.title,
    path: page.title,
    port: 80
  };
  let resHTML = '';
  const request = http.request(options, function (res) {
    res.on('data', function (data) {
      resHTML += data;
      // console.log(data);
    });
    res.on('end', function () {
      console.log('html:', resHTML);
      const parser = new HtmlParser(resHTML);
      const links = parser.getLinks();
      db.run("UPDATE page_list SET status = 1, date_update = ? WHERE id = ?", new Date(), page.id);
      if (!links.length) {
        getPage(
          site,
          callPage
        );
      } else {
        resToApi.pushLink(
          {
            site: site,
            page: page,
            links: links
          },
          function (err, res) {
            console.log('END');
            // restart page digger
            getPage(
              site,
              callPage
            );
          }
        );
      }
    });
  });
  request.on('error', function (e) {
    // console.log(e.message);
  });

  request.end();
}

export default function SitePageDigger() {
  // let u = 'http://asas.com/';
  // console.log(getFulPath(u));
  db.get("select * from site_list where status = '0' ORDER by date_create LIMIT 1", function(err, site) {
    console.log(' New site search...');
    if (site) {
      console.log('site:', site.title);
      getPage(
        site,
        callPage
      );
    } else {

      SitePageDigger();
    }
  });

};
