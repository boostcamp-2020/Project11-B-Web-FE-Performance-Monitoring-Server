import { Context, Next } from 'koa';

import CryptoJS from 'crypto-js';
import Invite from '../../../models/Invite';
import Project from '../../../models/Project';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { key } = ctx.query;
  const decodeKey = decodeURIComponent(key);
  const result = await Invite.findOne({ key: decodeKey, expire: { $lte: new Date().getTime() } });
  if (result) {
    const bytes = CryptoJS.AES.decrypt(result.key, process.env.INVITE_SECRET_KEY as string);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const project = await Project.findOne({ _id: decryptedData.projectId });
    if (!project) {
      ctx.throw('something error');
      // return;
    }
    project.addUser(ctx.state.user._id);
    project.save();
    /**
     * @todo
     * project에 맞는 issue로 redirect
     */
  } else {
    // ctx.throw('something error');
    // ctx.redirect('/');
  }

  ctx.redirect('/');
  await next();
};
