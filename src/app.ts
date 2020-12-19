import Koa from 'koa';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import apiRouter from './routes/index';
import './models';
import { startAlertsLoop } from './utils/alert';

require('dotenv').config();

const PORT = process.env.PORT || 4000;

const app = new Koa();
app.proxy = true;

app.use(json());
app.use(bodyParser());
app.use(cors());

if (process.env.NODE_ENV === 'development') app.use(logger());
app.use(apiRouter().routes());

app.on('error', (err, ctx) => {
  if (err.status === 400) {
    ctx.status = 400;
    return;
  }
  if (err.status === 401) {
    ctx.status = 401;
    return;
  }
  ctx.status = 500;
});

app.listen(PORT, () => {
  console.log(`Koa server listening on port ${PORT}`);
  console.log(`NODE_ENV : ${process.env.NODE_ENV}`);
  // Alert 확인 루프
  startAlertsLoop();
});
