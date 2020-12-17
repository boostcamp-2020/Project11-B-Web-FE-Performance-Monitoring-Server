import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // post
  router.post('/alerts', controller.getAlerts);
  router.post('/alert/:projectId', controller.addAlert);

  return router;
};
