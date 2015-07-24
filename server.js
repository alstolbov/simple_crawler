import http from 'http';
import express from 'express';
import ApiRoutes from './ApiRoutes';

export function Server() {

  const app = express();
  const httpServer = http.Server(app);
  const apiRoutes = ApiRoutes(express);
  const port = process.env.PORT || 3000;

  app.use('/api', apiRoutes);
  app.use('*', function (req, res) {
    res.send('404');
  });

  httpServer.listen(port);
  console.log('Server listening on port', port);
}
