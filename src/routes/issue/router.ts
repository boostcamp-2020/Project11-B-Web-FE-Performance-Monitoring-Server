import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controll: any = await controllers();

  //   get
  router.get('/issues', controll.getIssues);
  router.get('/issue/:issueId', controll.getIssue);

  //   put

  return router;
};
