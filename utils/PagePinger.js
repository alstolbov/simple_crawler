import http from 'http';

export default class PagePinger {

  constructor(options) {
    this.options = options;
    if (!this.options.port) {
      this.options.port = 80;
    }
    if (!this.options.path) {
      this.options.path = '/';
    }
  }

  get (next) {
    let resHTML = '';
    // console.log('connect', this.options);
    const request = http.request(this.options, function (res) {
      res.on('data', function (data) {
        resHTML += data;
      });
      res.on('end', function () {
        next(
          null,
          {
            status: res.statusCode,
            html: resHTML
          }
        );
      });
    });

    request.on('error', function (e) {
      next(e.message);
    });

    request.end();
  }

}
