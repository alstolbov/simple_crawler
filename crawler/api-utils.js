import Options from '../options';

let db = Options.db;

export default {

  addLink: function (obj, next) {
    db.serialize(function() {
      const query = db.prepare("INSERT INTO link_list (title, page_id) VALUES (?, ?)");
      for(let link in obj.data) {
        console.log('>', obj.data[link]);
        query.run(obj.data[link], obj.pageId);
      }
      query.finalize();
      db.run("UPDATE page_list SET status = 1 WHERE id = ?", obj.pageId);
      next(null, true);
    });
  }

};
