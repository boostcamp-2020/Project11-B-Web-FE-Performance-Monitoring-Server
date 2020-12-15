import { Context } from 'koa';
import {
  getCrimesCountAggregate,
  setDefaultGroup,
  getDateByInterval,
} from '../services/crimesCount';
import Issue from '../../../models/Issue';

interface IParams {
  issueId: string;
}

interface IQuery {
  intervalType: string;
}

export default async (ctx: Context): Promise<void> => {
  const { issueId }: IParams = ctx.params;
  const { intervalType }: IQuery = ctx.query;
  const { start, end, interval } = getDateByInterval(intervalType);
  try {
    const [result] = await Issue.aggregate(
      getCrimesCountAggregate({ issueId, start, end, interval }),
    );
    const crimesByDate = setDefaultGroup({
      start,
      interval,
      crimes: result.crimes,
      intervalType,
    });
    ctx.response.body = { crimes: crimesByDate };
  } catch (e) {
    ctx.throw(400);
  }
};
