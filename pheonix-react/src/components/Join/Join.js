import { NavLink } from 'react-router-dom';

function Join() {

  return (
    <>
      <h1>회원가입 화면입니다</h1>

      <div>
        {/* 입력 폼 */}
        <form>
          <label htmlFor="userId">아이디:</label>
          <input type="text" id="userId" name="userId" /><br/><br/>

          <label htmlFor="userPw">비밀번호:</label>
          <input type="password" id="userPw" name="userPw" /><br/><br/>

          <label htmlFor="userName">이름:</label>
          <input type="text" id="userName" name="userName" /><br/><br/>

          <label htmlFor="userContact">전화번호:</label>
          <input type="text" id="userContact" name="userContact" /><br/><br/>

          <label htmlFor="userEmail">이메일:</label>
          <input type="email" id="userEmail" name="userEmail" />
          <button>전송</button><br/><br/>
          
          <label htmlFor="userEmail">인증번호:</label>
          <input type='text'></input>
          <button>확인</button><br/><br/>

          <label htmlFor="userBirth">생년월일:</label>
          <input type="date" id="userBirth" name="userBirth" /><br/><br/>

          
          <button type="submit">가입하기</button>
        </form>
      </div>
    </>
  );
}

export default Join;
