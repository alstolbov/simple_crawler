import URL from 'url-parse';
import {getFulPath, getHost} from '../utils/url-utils';
import Options from '../options';

function parseLink (siteName, linkUrl) {
  const hostURL = getHost(linkUrl);
  const pathURL = getFulPath(linkUrl);
  let isInternal = 0;
  let resURL;
  if (siteName !== hostURL) {
    resURL = hostURL + pathURL;
  } else {
    resURL = pathURL;
    isInternal = 1;
  }
  // console.log('>', resURL);
  return {
    url: resURL,
    isInternal: isInternal
  };
}

export default function AddLink (req, res) {
  const db = Options.db;
  const resJson = {
    status: '',
    text: ''
  };

  if (!req.body.links ||
    !req.body.site ||
    !req.body.page
  ) {
    resJson.status = 200;
    resJson.text = 'no links';
    res.json(resJson);
  } else {
    const linkList = req.body.links;
    const pageId = req.body.page.id;
    db.serialize(function() {
      const queryLink = db.prepare("INSERT INTO link_list (title, page_id, status) VALUES (?, ?, ?)");
      for(let link in linkList) {
        const pathData = parseLink(req.body.site.title, linkList[link]);
        queryLink.run(pathData.url, pageId, pathData.isInternal);
      }
      queryLink.finalize();
      // db.run("UPDATE page_list SET status = 1 WHERE id = ?", pageId);

      resJson.status = 200;
      resJson.text = 'add link success';
      res.json(resJson);
    });
  }
};
