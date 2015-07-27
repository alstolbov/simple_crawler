import Options from '../options';
import {getHost} from '../utils/url-utils';
import resToApi from './utils/resToApi';

const db = Options.db;

function getLink () {
  db.get("select * from link_list where status = '0' ORDER by id LIMIT 1", function(err, link) {
    if (!link) {
      console.log('no unchecking links. Restart...');
      getLink();
    } else {
      db.get("select * from site_list where title = '" + getHost(link.title) + "' ORDER by id LIMIT 1", function(err, site) {
        db.run("UPDATE link_list SET status = 1 WHERE id = ?", link.id);
        if (!site) {
          resToApi.pushSite(
            {
              url: link.title
            },
            function (err, res) {
              console.log('res', res);
              getLink();
            }
          );
        }
      });
    }
  });
}

export default function LinkSiteExtractor () {
  getLink();
}
