import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // post
  router.post('/sdk/:projectId/visits', controller.addVisits);
  router.post('/sdk/:projectId/crime', controller.addCrime);
  router.post('/sdk/:projectId/crimes', controller.addCrimes);

  router.post('/sdk/:projectId/session', controller.addSession);
  return router;
};
