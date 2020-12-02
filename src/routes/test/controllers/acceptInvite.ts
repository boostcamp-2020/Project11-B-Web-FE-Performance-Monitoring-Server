import { Context, Next } from 'koa';

import CryptoJS from 'crypto-js';
import Invite from '../../../models/Invite';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { key } = ctx.query;
  const decodeKey = decodeURIComponent(key);
  const result = await Invite.findOne({ key: decodeKey, expire: { $lte: new Date().getTime() } });
  if (result) {
    const bytes = CryptoJS.AES.decrypt(result.key, process.env.INVITE_SECRET_KEY as string);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    ctx.body = decryptedData;
    /**
     * @todo
     * ctx 에서 userId 찾아오기
     * project에서projectId를 통해 찾아온 후 project에 user추가
     */
  } else {
    console.log('err');
    ctx.redirect('/');
  }
  await next();
};
