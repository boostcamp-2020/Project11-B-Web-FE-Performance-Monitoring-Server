/* eslint-disable  */
import Router from 'koa-router';

import filenames from '../utils/filenames';
import authMiddleware from '../utils/authMiddleware';

const router = new Router();
const apiPrefix = '/api';

router.use('/', authMiddleware);

const routing = () => {
  const routes = filenames(__dirname);
  routes.map(async (route) => {
    const subRouter = await import(`./${route}/router.ts`); //import 함수에 대한 await
    const subrouter = await subRouter.default(); // 내부 async 함수에대한 await
    router.use(`${apiPrefix}`, subrouter.routes());
  });
  return router;
};
export default routing;
