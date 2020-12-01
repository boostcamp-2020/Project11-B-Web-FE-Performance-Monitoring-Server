import Router from 'koa-router';

import controllers from './controllers';

// topPath = "/api"

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controll: any = await controllers();

  //   get
  router.get('/auth/github', controll.github);
  router.get('/auth/github/callback', controll.githubCallback);

  return router;
};
