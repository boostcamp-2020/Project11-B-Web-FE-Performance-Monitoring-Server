import mongoose from 'mongoose';

require('dotenv').config();

mongoose.Promise = global.Promise; // Node 의 네이티브 Promise 사용
// mongodb 연결
const connect = async () => {
  await mongoose.connect(process.env.MONGO_URI as string, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  console.log('connected to database');
};
connect();
