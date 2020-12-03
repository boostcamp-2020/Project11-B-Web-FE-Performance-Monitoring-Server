import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controll: any = await controllers();
  // get

  // post
  router.post('/project', controll.createProject);
  router.post('/invite', controll.sendInvite);

  // get
  router.get('/accept', controll.acceptInvite);
  router.get('/projects', controll.getProjects);

  //   post
  router.post('/project', controll.addProject);

  return router;
};
