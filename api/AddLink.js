import URL from 'url-parse';
import {getFulPath, getHost} from '../utils/url-utils';
import Options from '../options';

function parseLink (site, linkUrl) {
  const hostURL = getHost(linkUrl);
  const pathURL = getFulPath(linkUrl);
  let isInternal = 0;
  let resURL;
  if (hostURL == "" && !site) {
    resURL = false;
  } else {
    if (site) {
      if (site.title !== hostURL) {
        resURL = hostURL + pathURL;
      } else {
        resURL = pathURL;
        isInternal = 1;
      }
    } else {
      resURL = hostURL + pathURL;
    }
  }
  // console.log('>', resURL);
  return {
    url: resURL,
    isInternal: isInternal
  };
}

export default function AddLink (req, res) {
  const db = Options.db();
  const linkList = req.body.links || false;
  const site = req.body.site || false;
  const page = req.body.page || false;
  const resJson = {
    status: '',
    text: ''
  };

  if (!linkList) {
    resJson.status = 200;
    resJson.text = 'no links';
    res.json(resJson);
  } else {
    db.serialize(function() {
      const queryLink = db.prepare("INSERT INTO link_list (title, page_id, status) VALUES (?, ?, ?)");
      const queryLinkInternal = db.prepare("INSERT INTO link_list (title, page_id, status, site_id) VALUES (?, ?, ?, ?)");
      for(let link in linkList) {
        const pathData = parseLink(site, linkList[link]);
        if (pathData.url) {
          let pageId = 0;
          if (page) {
            pageId = page.id;
          }
          if (pathData.isInternal) {
            queryLink.run(pathData.url, page.id, 0, site.id);
          } else {
            queryLink.run(pathData.url, page.id, 0);
          }
        }
      }
      queryLink.finalize();

      resJson.status = 200;
      resJson.text = 'add link success';
      res.json(resJson);
    });
  }
};
