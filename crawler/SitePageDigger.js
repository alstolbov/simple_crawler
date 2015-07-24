import http from 'http';
import HtmlParser from './HtmlParser';
import utils from './api-utils';
import Options from '../options';

const db = Options.db;

function getPage(site, next) {
  let page;
  // console.log(db);
  db.get("select * from page_list where site_id = '" + site.id + "' AND status = '0' LIMIT 1", function(err, page) {
    if (page) {
      next(site, page);
    } else {
      console.log('no pages!');
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
      // console.log("The part was getted!");
    });
    res.on('end', function () {
      const parser = new HtmlParser(resHTML);
      const links = parser.getLinks();
      if (links.length) {
        utils.addLink(
          {
            pageId: page.id,
            data: links
          },
          function (err, res) {
            console.log('END');
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

  db.each("select * from site_list where status = '0'", function(err, site) {
    console.log(site.title);
    getPage(
      site,
      callPage
    );
  });
};
