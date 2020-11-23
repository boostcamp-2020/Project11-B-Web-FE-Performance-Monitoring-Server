/* eslint-disable  */
import Router from 'koa-router';
import filenames from '../utils/filenames';

const router = new Router();
const apiPrefix = '/api';

const routing = () => {
  const routes = filenames(__dirname);
  routes.map((route) => {
    const subRouter = require(`./${route}/router.ts`);
    router.use(`${apiPrefix}`, subRouter.routes());
  });
  return router;
};
export default routing;
