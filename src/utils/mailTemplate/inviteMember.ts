import header from './common/header';
import footer from './common/footer';

const inviteMember = (
  team: string,
  key: string,
): { subject: string; text: string; html: string } => {
  return {
    subject: `${team}으로부터 프로젝트 초대가 도착했습니다.`,
    text: '',
    html: `
    ${header()}
   <div style="text-align:center; padding: 20px; border:2px solid black;">
   <h2> ${team}으로부터 프로젝트 초대가 도착했습니다.</h2>

   <h2>수락하시려면 아래 수락버튼을 클릭해 주세요</h2>

   <a type="button" href="http://localhost:3000/api/accept?key=${key}" style="cursor:pointer; color:white;  background-color: #311b92;  text-decoration: none; margin-top:10px; padding:15px 30px; font-size:20px;  border-radius:5px;"> 수락 </a>
  
   </div>
    ${footer()}
    `,
  };
};

export default inviteMember;
