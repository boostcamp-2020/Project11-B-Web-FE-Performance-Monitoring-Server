/* eslint-disable no-console */
import Koa from 'koa';

import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import apiRouter from './routes/index';
import './models';

require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = new Koa();

app.use(json());
app.use(bodyParser());
app.use(cors());

if (process.env.NODE_ENV === 'development') app.use(logger());
app.use(apiRouter().routes());

/**
 * @TODO
 * 에러 코드 분리
 */
app.on('error', (err, ctx) => {
  // 에러 코드
  console.log(err.status);
  // 에러 메시지
  console.log(err.message);
  // console.log('server error', err, ctx);
});

app.listen(PORT, () => {
  console.log(`Koa server listening on port ${PORT}`);
  console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
});
