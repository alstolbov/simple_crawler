import PagePinger from '../utils/PagePinger';
import HtmlParser from '../utils/HtmlParser';
import cheerio from 'cheerio';
import fs from 'fs';
import Options from '../options';

const db = Options.listOfComDb();

const site = 'www.registered-domains-list.com';
const totalPages = 18583;
// total pages - http://www.registered-domains-list.com/com-2013/18583.html

const stream = fs.createWriteStream("./thematicCrawler/comList.txt");

const queryLink = db.prepare("INSERT INTO site_list (title, status, date_create) VALUES (?, ?, ?)");

export default function listOfCom (pageId, total) {
  const page = pageId || 1; //558
  const path = '/com-2013/' + page + '.html';
  let totalCounter = total || 1;
  console.log('Start parse on ' + site + path +'...');
  new PagePinger({
    host: site,
    path: path
  })
  .get(
    function (err, res) {
      if (!err && res.status == 200) {
        console.log('parse page data...');
        const $ = cheerio.load(res.html);
        const pageList = $('table.list').text();
        const list = pageList.split('\r\n');
        const percent = (pageId * 100 / totalPages).toFixed(2);
        let clearDomainCount = 0;
        console.log('find ' + list.length + ' domains...');
        db.run("BEGIN TRANSACTION");
        list.forEach(function (siteName) {
          if (siteName.slice(-4) == '.com') {
            // queryLink.run(siteName, 0, new Date());
            db.run(
              "INSERT INTO site_list (title, status, date_create) VALUES (?, ?, ?)",
              [siteName, 0, new Date()]
            );
            stream.write(siteName + '\r\n');
            clearDomainCount++;
          }
        });
        db.run("END");
        console.log('write clear ' + clearDomainCount + ' domains to db OK!');
        console.log('write clear ' + clearDomainCount + ' domains to file OK!');
        console.log(percent + '% complete');
        totalCounter += clearDomainCount;
        listOfCom(page + 1, totalCounter);
      } else {
        console.log('END parse site!');
        console.log('Total parse ' + totalCounter + 'domains.');
        stream.end();
        process.exit();
      }
    }
  );
}
