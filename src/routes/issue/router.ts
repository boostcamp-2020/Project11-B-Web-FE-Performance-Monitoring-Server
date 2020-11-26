import Router from 'koa-router';

import controllers from './controllers';

export default async (): Promise<Record<string, unknown>> => {
  const router = new Router();
  const controll: any = await controllers();

  //   get
  router.get('/issues', controll.getIssues);
  router.get('/issue/:issueId', controll.getIssue);

  //   post
  router.post('/issue', controll.addIssue);

  //   put

  /**
   * @WARNING
   * @개발용
   * 전체 데이터 삭제 API
   */
  router.post('/dev/issues', controll.devAddIssues);
  router.delete('/dev/issues', controll.devDeleteIssues);

  return router;
};
