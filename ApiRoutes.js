import GetSite from './api/GetSite';
import AddSite from './api/AddSite';

export default function ApiRoutes (express) {

  const router = express.Router();

  router.get('/site', GetSite);
  router.post('/site', AddSite);

  return router;

};
