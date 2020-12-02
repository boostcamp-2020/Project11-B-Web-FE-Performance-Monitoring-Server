import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controll: any = await controllers();

  // get
  router.get('/invite', controll.acceptInvite);

  // post
  router.post('/project', controll.createProject);
  router.post('/invite', controll.sendInvite);

  return router;
};
