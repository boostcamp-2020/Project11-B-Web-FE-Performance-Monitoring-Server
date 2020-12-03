import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controll: any = await controllers();

  // get
  router.get('/accept', controll.acceptInvite);
  router.get('/project/:id', controll.getProject);
  router.get('/projects', controll.getProjects);

  // post
  router.post('/project', controll.addProject);
  router.post('/invite', controll.sendInvite);

  // put
  router.put('/project/name/:id', controll.updateProjectName);
  router.put('/project/:id/users', controll.deleteProjectUsers);

  // delete
  router.delete('/project/:id', controll.deleteProject);

  return router;
};
