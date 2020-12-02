import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controll: any = await controllers();

  //   post
  router.post('/project', controll.addProject);

  return router;
};
