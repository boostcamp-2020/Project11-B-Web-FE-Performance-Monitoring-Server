import Router from 'koa-router';

import controllers from './controllers';

export default async () => {
  const router = new Router();
  const controll: any = await controllers();

  //   get
  router.get('/stats', controll.getStats);

  return router;
};
