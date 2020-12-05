import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  //   get
  router.get('/test', controller.getTest);

  //   post
  router.post('/test', controller.addTest);
  router.post('/test/project/:id', controller.addUsers);
  //   put
  //   delete
  return router;
};
