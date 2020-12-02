import Router from 'koa-router';

import controllers from './controllers';

export default async () => {
  const router = new Router();
  const controll: any = await controllers();

  //   get
  router.get('/test', controll.getTest);

  router.get('/invite', controll.acceptInvite);

  //   post
  router.post('/test', controll.addTest);
  router.post('/invite', controll.sendInvite);
  //   put
  //   delete
  return router;
};
