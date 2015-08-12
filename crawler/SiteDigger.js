import PagePinger from '../utils/PagePinger';
import HtmlParser from '../utils/HtmlParser';
import resToApi from './utils/resToApi';
import Options from '../options';

const db = Options.db();

const _store = {
  siteList: {},
  counter: {
    sites: 0,
    pages: 0,
    links: 0
  }
};

function clearStore () {
  _store.siteList = {};
  _store.counter = {
    sites: 0,
    pages: 0,
    links: 0
  };
}

function addSite (site) {
  if (!_store.siteList.hasOwnProperty(site.title)) {
    _store.siteList[site.title] = {
      type: site.type,
      pages: {}
    };
    _store.counter.sites++;
  }
}

function addPage (site, page) {
  if (_store.siteList.hasOwnProperty(site.title)) {
    if (!_store.siteList[site.title].pages.hasOwnProperty(page.title)) {
      _store.siteList[site.title].pages[page.title] = {
        type: page.type,
        links: []
      };
      _store.counter.pages++;
    }
  }
}

function addLinks (site, page, links) {
  if (_store.siteList.hasOwnProperty(site.title)) {
    if (_store.siteList[site.title].pages.hasOwnProperty(page.title)) {
      _store.siteList[site.title].pages[page.title].links = links
      _store.counter.links += links.length;
    }
  }
}

function recompileState () {
  
}

function pageDigger (site, next) {
  db.get("select * from page_list where site_id = '" + site.id + "' AND status = '0' ORDER by date_create LIMIT 1", function(err, page) {
    if (err) {
      next(err);
    } else {
      if (!page) {
        next(err);
      } else {
        page.type = 'db';
        console.log('parse page ' + page.title);
        addPage(site, page);
        new PagePinger({
          host: site.title,
          path: page.title
        })
        .get(function (err, res) {
          if (err) {
            // db.run("UPDATE page_list SET status = 2, date_update = ? WHERE id = ?", new Date(), page.id);
            next(err);
          } else {
            const linkArray = new HtmlParser(res.html).getLinks();
            if (linkArray.length) {
              addLinks(site, page, linkArray);
            }
            console.log('end parse page ' + page.title);
            console.log(_store);
            // pageDigger (site, next);
          }
        });
      }
    }
  });
}

export default function SiteDigger() {
  clearStore();
  db.get("select * from site_list where status = '0' ORDER by date_create LIMIT 1", function(err, site) {
    if (err) {
      // db.run("UPDATE site_list SET status = 2, date_update = ? WHERE id = ?", new Date(), site.id);
      // SitePageDigger();
      //send res
    } else {
      site.type = 'db';
      addSite(site);
      pageDigger(site, function (err, res) {
        // SiteDigger();
        console.log('stop crawl site ' + site.title);
      });
    }
  });

  // new PagePinger({
  //   host: 'ssd.com'
  // })
  // .get(function (err, res) {
  //   const parser = new HtmlParser(res.html);
  //   console.log(res.status);
  //   console.log(res.html);
  //   console.log(parser.getWords());
  // });
}
