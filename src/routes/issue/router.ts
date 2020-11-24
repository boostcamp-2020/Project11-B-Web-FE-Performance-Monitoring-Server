import Router from 'koa-router';

import controllers from './controllers';

export default async () => {
  const router = new Router();
  const controll: any = await controllers();

  //   get
  router.post('/issue', controll.addIssue);

  router.get('/issue', controll.addIssue);
  //   post

  //   put
  //   delete
  return router;
};
