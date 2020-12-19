import template from './common/mail';

const inviteMember = (
  team: string,
  key: string,
): { subject: string; text: string; html: string } => {
  const content = `
  <p style="font-size: 18px">
    ${team}으로부터 프로젝트 초대가 도착했습니다.
  </p>
  <p style="margin: 0">
    아래의 버튼을 클릭하면 프로젝트에 멤버로서 참가할 수
    있습니다.
  </p>
  <p style="margin: 0">
    초대를 원하지 않거나 관련이 없으시다면 누르시지 않아도
    됩니다. :)
  </p>
  <a
    type="button"
    href="${process.env.ADMIN_MAIN_URL}/accept?key=${key}"
    style="
      display: block;
      cursor: pointer;
      color: #005fff;
      text-decoration: none;
      font-size: 16px;
      border-radius: 5px;
      margin-top: 16px;
    "
  >
    test4 프로젝트로부터 초대를 수락
  </a>`.trim();
  return {
    subject: `${team}으로부터 프로젝트 초대가 도착했습니다.`,
    text: '',
    html: template(`${team}으로부터 프로젝트 초대가 도착했습니다.`, content),
  };
};

export default inviteMember;
