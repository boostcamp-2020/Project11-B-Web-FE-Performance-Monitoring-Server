import header from './common/header';
import footer from './common/footer';

const alertMailTemplateByCount = (
  project: string,
  issues: any[],
): { subject: string; text: string; html: string } => {
  return {
    subject: `${project}으로부터 프로젝트 알림.`,
    text: '',
    html: `
    ${header()}
   <div style="text-align:center; padding: 20px; border:2px solid black;">
   <h2> ${project}으로부터 프로젝트 알림.</h2>

   ${issues.reduce((acc, issue, index) => {
     const newStr = `${acc}<p>${index + 1}. 이슈 타입 : ${issue.type}, 이슈 메세지 : ${
       issue.message
     }</p>`;
     return newStr;
   }, '')}
  
   </div>
    ${footer()}
    `,
  };
};

const alertMailTemplateByPeriod = (
  project: string,
  issues: any[],
): { subject: string; text: string; html: string } => {
  return {
    subject: `${project}으로부터 프로젝트 알림.`,
    text: '',
    html: `
      ${header()}
      <div style="text-align:center; padding: 20px; border:2px solid black;">
        <h2> ${project}으로부터 프로젝트 알림.</h2>
        <h2> 최근 생성 이슈(최대:10개) </h2>
        ${issues.reduce((acc, issue, index) => {
          const newStr = `${acc}<p>${index + 1}. 이슈 타입 : ${issue.type}, 이슈 메세지 : ${
            issue.message
          }</p>`;
          return newStr;
        }, '')}
      </div>
      ${footer()}`,
  };
};

export { alertMailTemplateByCount, alertMailTemplateByPeriod };
