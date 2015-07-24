import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';

import ApiRoutes from './ApiRoutes';
import CrawlerApp from './CrawlerApp';

export function Server() {

  const app = express();
  const httpServer = http.Server(app);
  const apiRoutes = ApiRoutes(express);
  const port = process.env.PORT || 3000;

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/api', apiRoutes);
  app.use('*', function (req, res) {
    res.send('404');
  });

  httpServer.listen(port);
  console.log('Server listening on port', port);

  CrawlerApp();

}
