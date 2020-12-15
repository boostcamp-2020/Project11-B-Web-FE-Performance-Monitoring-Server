import Alert from '../models/Alert';
import { alertListAggregate, alertByCount, alertByPeriod } from './alertUtil';

const sendAlerts = async () => {
  const now = new Date();
  const alertlist = await Alert.aggregate(alertListAggregate());
  console.log('요청 발생');
  alertlist.map(async (alert) => {
    if (alert.period) {
      // 주기를 기준으로 보냄
      alertByPeriod(alert, now);
    } else {
      // 이슈 갯수를 기준으로 보냄
      alertByCount(alert);
    }
  });
};

export const startAlertsLoop = (): void => {
  // const MINUTE = 1000 * 60;
  setInterval(sendAlerts, 10000);
};
