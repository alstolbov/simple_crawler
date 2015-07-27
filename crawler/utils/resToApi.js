import options from '../../options';

import superagent from 'superagent';

let siteURL = options.host + ':' + options.port;

export default {

  pushLink: function (data, next) {
    superagent
      .post(siteURL + '/api/link')
      .send(data)
      .end(
        function (err, res) {
          if (err) {
            next(err);
          } else {
            next(null, res.body);
          }
        }
      )
    ;
  },
  pushSite: function (data, next) {
    superagent
      .post(siteURL + '/api/site')
      .send(data)
      .end(
        function (err, res) {
          if (err) {
            next(err);
          } else {
            next(null, res.body);
          }
        }
      )
    ;
  }

};
