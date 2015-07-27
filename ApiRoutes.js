import GetSite from './api/GetSite';
import AddSite from './api/AddSite';
import AddLink from './api/AddLink';

export default function ApiRoutes (express) {

  const router = express.Router();

  router.get('/site', GetSite);
  router.post('/site', AddSite);
  router.post('/link', AddLink);

  return router;

};
