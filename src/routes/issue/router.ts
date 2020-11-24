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
  /**
   * @WARNING
   * @개발용
   * 전체 데이터 삭제 API
   */
  router.delete('/issues', controll.cleanIssues);
  return router;
};
