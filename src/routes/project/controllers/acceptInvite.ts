import { Context, Next } from 'koa';

import CryptoJS from 'crypto-js';
import Invite from '../../../models/Invite';
import Project from '../../../models/Project';
import User, { IUserDocument } from '../../../models/User';

export default async (ctx: Context, next: Next): Promise<void> => {
  const { key } = ctx.query;
  const decodeKey = decodeURIComponent(key);
  const result = await Invite.findOne({ key: decodeKey, expire: { $lte: new Date().getTime() } });
  if (result) {
    const bytes = CryptoJS.AES.decrypt(result.key, process.env.INVITE_SECRET_KEY as string);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    const project = await Project.findOne({ _id: decryptedData.projectId });
    const user = (await User.findOne({ _id: ctx.state.user._id })) as IUserDocument;
    if (!project) {
      ctx.response.status = 404;
      ctx.throw('project not found');
    }
    try {
      await project.addUser(ctx.state.user._id);
      user.addProject(project._id);
      user.save();
      project.save();
      ctx.response.status = 200;
    } catch (error) {
      ctx.response.status = 500;
    }
    /**
     * @todo
     * project에 맞는 issue로 redirect
     */
  } else {
    ctx.response.status = 500;
  }
  await next();
};
