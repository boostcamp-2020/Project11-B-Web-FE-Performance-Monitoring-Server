import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // get
  router.get('/sdk/test', controller.test);

  router.post('/sdk/:projectId/session', controller.addSession);
  // post

  return router;
};
