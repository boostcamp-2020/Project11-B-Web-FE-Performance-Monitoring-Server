import Koa from 'koa';

import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import apiRouter from './routes/index';
import db from './models';
import Test, { TestType, TestTypeModel } from './models/Test';

const PORT = 3000;

const app = new Koa();

app.use(json());
app.use(logger());
app.use(bodyParser());

db.connect();

app.use(apiRouter().routes());

app.listen(PORT, () => {
  console.log(`Koa server listening on port ${PORT}`);
});
