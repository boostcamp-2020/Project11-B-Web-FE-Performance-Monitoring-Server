import template from './common/mail';
import issueTemplate from './common/issueTemplate';
import getPeriodLabel from '../alertMailUtils';

const alertMailTemplateByCount = (
  project: string,
  issues: any[],
  count: number,
): { subject: string; text: string; html: string } => {
  const title = `${project}에서 Issue 알림이 도착했습니다.`;
  const content = `<p>프로젝트에서 ${count}개의 새로운 이슈가 생겼습니다.${
    count >= 20 ? '(20개까지만 표시됩니다. 더 자세한 내용은 Admin 페이지에서 확인해주세요.)' : ''
  }</p>
  <p>이슈의 내용은 아래와 같습니다.</p>${issues
    .slice(0, 20)
    .reduce((html, issue) => html + issueTemplate(issue), '')}`;

  return {
    subject: `${project}으로부터 프로젝트 Issue 알림.`,
    text: '',
    html: template(title, content),
  };
};

const alertMailTemplateByPeriod = (
  project: string,
  issues: any[],
  period: string,
): { subject: string; text: string; html: string } => {
  const title = `${project}에서 최근 ${getPeriodLabel(
    period,
  )}동안 생성된 이슈 알림이 도착했습니다.`;
  const content = `<p>프로젝트에서 최근 이슈가 생겼습니다.(최근 최대 10개의 이슈)</p>
  <p>이슈의 내용은 아래와 같습니다.</p>${issues
    .slice(0, 20)
    .reduce((html, issue) => html + issueTemplate(issue), '')}`;
  return {
    subject: `${project}으로부터 프로젝트 이슈 알림.`,
    text: '',
    html: template(title, content),
  };
};

export { alertMailTemplateByCount, alertMailTemplateByPeriod };
