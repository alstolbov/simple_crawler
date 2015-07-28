import GetSite from './api/GetSite';
import AddSite from './api/AddSite';
import AddLink from './api/AddLink';
import AddPage from './api/AddPage';

export default function ApiRoutes (express) {

  const router = express.Router();

  router.get('/site', GetSite);
  router.post('/site', AddSite);
  router.post('/page', AddPage);
  router.post('/link', AddLink);

  return router;

};
