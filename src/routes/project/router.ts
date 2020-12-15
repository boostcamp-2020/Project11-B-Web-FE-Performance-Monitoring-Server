import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // get
  router.get('/accept', controller.acceptInvite);
  router.get('/project/:id', controller.getProject);
  router.get('/projects', controller.getProjects);

  // post
  router.post('/project', controller.addProject);
  router.post('/invite', controller.sendInvite);

  // put
  router.put('/project/:id/name', controller.updateProjectName);
  router.put('/project/:id/users', controller.deleteProjectUsers);
  router.put('/project/:id/user', controller.updateProjectOwner);

  // delete
  router.delete('/project/:id', controller.deleteProject);

  return router;
};
