import Router from 'koa-router';

import controllers from './controllers';

export default async () => {
  const router = new Router();
  const controll: any = await controllers();

  //   get
  router.get('/issues', controll.getIssues);
  router.get('/issue/:issueId', controll.getIssue);

  //   post
  router.post('/issue', controll.addIssue);

  //   put
  //   delete
  router.delete('/issues', controll.cleanIssues);
  return router;
};
