import cheerio from 'cheerio';

export default class HtmlParser {

  constructor(html) {
    this.rowHTML = html;
    this.Links = [];
  }

  getLinks () {
    const _this = this;
    const $ = cheerio.load(this.rowHTML);
    $('a').each(function (i, link) {
      _this.Links.push($(link).attr('href'));
    });
    return this.Links;
  }

};
