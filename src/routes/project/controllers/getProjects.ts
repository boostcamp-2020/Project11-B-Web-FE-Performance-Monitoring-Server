import { Context } from 'koa';
import { Types } from 'mongoose';
import Project from '../../../models/project';

enum UserType {
  OWNER = 'owner',
  MEMBER = 'member',
  ALL = 'all',
}

interface IQuery {
  userType: UserType;
}
export default async (ctx: Context): Promise<void> => {
  const { userType = UserType.ALL }: IQuery = ctx.query;
  const user = {
    id: '5fc055d7d58baa2b2807974b',
    projects: [
      { _id: '5fc6026191611635d8983356' },
      { _id: '5fc6026191611635d8983358' },
      { _id: '5fc6026191611635d898335a' },
    ],
  };
  try {
    let projects = await Project.find()
      .where('_id')
      .in(user.projects.map((project) => Types.ObjectId(project._id)));
    if (userType === UserType.OWNER) {
      projects = projects.filter(({ owner }) => owner === user.id);
    }
    if (userType === UserType.MEMBER) {
      projects = projects.filter(({ users }) => {
        return !!users.find((id) => id === user.id);
      });
    }
    ctx.response.status = 200;
    ctx.body = { projects };
  } catch (e) {
    ctx.throw(500);
  }
};
