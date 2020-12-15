import Router from 'koa-router';

import controllers from './controllers';

// topPath = "/api"

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  //   get
  router.get('/auth/github', controller.github);
  router.get('/auth/github/callback', controller.githubCallback);

  return router;
};
