import {getHost, getFulPath} from '../utils/url-utils';
import Options from '../options';

let db = Options.db;

/*
  - Проверка ссылок - есть ли новый сайт (и добавление его в базу)
  - отрезание хостов у ссылок
  - после записи всех ссылок - отметить страницу как проверенную
*/

export default {

  addLink: function (obj, next) {
    db.serialize(function() {
      const query = db.prepare("INSERT INTO link_list (title, page_id) VALUES (?, ?)");
      for(let link in obj.data) {
        const rowLink = obj.data[link];
        const siteName = getHost(rowLink);
        const linkPath = getFulPath(rowLink);
        console.log('>', obj.data[link]);
        query.run(obj.data[link], obj.pageId);
      }
      query.finalize();
      db.run("UPDATE page_list SET status = 1 WHERE id = ?", obj.pageId);
      next(null, true);
    });
  }

};
