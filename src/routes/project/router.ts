import Router from 'koa-router';

import controllers from './controllers';
import isProjectOwner from '../../utils/isProjectOwnerMiddleware';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controller: any = await controllers();

  // get
  router.get('/accept', controller.acceptInvite);
  router.get('/project/:id', controller.getProject);
  router.get('/projects', controller.getProjects);

  // post
  router.post('/project', controller.addProject);
  router.post('/invite', isProjectOwner, controller.sendInvite);

  // put
  router.put('/project/:id/name', isProjectOwner, controller.updateProjectName);
  router.put('/project/:id/users', isProjectOwner, controller.deleteProjectUsers);
  router.put('/project/:id/user', isProjectOwner, controller.updateProjectOwner);

  // delete
  router.delete('/project/:id', isProjectOwner, controller.deleteProject);

  return router;
};
