import { Context } from 'koa';
import { Types } from 'mongoose';
import Project from '../../../models/Project';
import User from '../../../models/User';

enum UserEnum {
  OWNER = 'owner',
  MEMBER = 'member',
  ALL = 'all',
}

interface IQuery {
  userType: UserEnum;
}

interface IState {
  user: { _id: string };
}

export default async (ctx: Context): Promise<void> => {
  const { userType = UserEnum.ALL }: IQuery = ctx.query;
  const { user } = ctx.state as IState;
  try {
    const userDocument = await User.findOne({ _id: user._id });
    if (userDocument === null) {
      throw Error();
    }
    let projects = await Project.find({ isDeleted: { $ne: true } })
      .populate('owner')
      .populate('users')
      .where('_id')
      .in(userDocument.projects.map((projectId: string) => Types.ObjectId(projectId)));
    if (userType === UserEnum.OWNER) {
      projects = projects.filter(({ owner }) => owner === userDocument._id);
    }
    if (userType === UserEnum.MEMBER) {
      projects = projects.filter(({ users }) => {
        return users.some((userId) => userId === user._id);
      });
    }
    ctx.response.status = 200;
    ctx.body = { projects };
  } catch (e) {
    ctx.throw(400);
  }
};
