import cheerio from 'cheerio';

export default class HtmlParser {

  constructor(html) {
    this.rowHTML = html;
    this.$ = cheerio.load(this.rowHTML);
    this.Links = [];
  }

  test () {
    return '!!!';
  }

  getLinks () {
    const _this = this;
    const $ = this.$;
    $('a').each(function (i, link) {
      _this.Links.push($(link).attr('href'));
    });
    return this.Links;
  }

  getWords (minLength, maxLength) {
    const _this = this;
    const $ = this.$;

    const minLength = minLength || 3;
    const maxLength = maxLength || 20;

    const rowRes = {};
    const res = [];

    let text = $('body').text();
    text = text.replace(/\s+/g, " ")
      .replace(/[^a-zA-Z ]/g, "")
      .toLowerCase()
    ;

    text.split(" ").forEach(function (word) {
      if (word.length < minLength || word.length > maxLength) {
          return;
        }
              
        if (rowRes[word]) {
          rowRes[word]++;
        } else {
          rowRes[word] = 1;
        }
    }

    for (prop in rowRes) {
      res.push({
        word: prop,
        count: rowRes[prop]
      });
    }

    return res.sort(function (a, b) {
      return b.count - a.count;
    });

  }

};
