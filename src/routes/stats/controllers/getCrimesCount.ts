import { Context } from 'koa';
import { getCrimesCountAggregate, setDefaultGroup } from '../services/crimesCount';
import Issue from '../../../models/Issue';

const MILLISECOND_OF_TWELVE_HOUR = 3600 * 24 * 1000;

interface IParams {
  issueId: string;
}

export default async (ctx: Context): Promise<void> => {
  const { issueId }: IParams = ctx.params;
  const start = new Date(Date.now() - MILLISECOND_OF_TWELVE_HOUR);
  const end = new Date(Date.now());
  const INTERVAL_ONE_HOUR = 60 * 1000 * 60;
  try {
    const [result] = await Issue.aggregate(
      getCrimesCountAggregate({ issueId, start, end, interval: INTERVAL_ONE_HOUR }),
    );
    const crimesByDate = setDefaultGroup({
      start,
      interval: INTERVAL_ONE_HOUR,
      crimes: result.crimes,
    });
    ctx.response.body = { crimes: crimesByDate };
  } catch (e) {
    ctx.throw(400);
  }
};
