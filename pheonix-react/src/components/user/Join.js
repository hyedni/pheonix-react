import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "../utils/CustomAxios";

function Join() {
  // State
  const [user, setUser] = useState({
    "userId": "",
    "userPw": "",
    "userNick": "",
    "userName": "",
    "userContact": "",
    "userEmail": "",
    "userBirth": "",
    "userCert":""
  });
  
  const [isValid, setIsValid] = useState({
    userId: true,
    userPw: true,
    userNick: true,
    userName: true,
    userContact: true,
    userEmail: true
  });

  
  const [isFormValid, setIsFormValid] = useState(false);
  const [isCertified, setIsCertified] = useState(false); // 추가: 인증번호 확인 상태
  const [isSending, setIsSending] = useState(false); // 전송 중 상태 추가

  // 값 입력 함수
  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value
    });
  }, [user]);

  // 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 양식 유효성 확인
    if (isFormValid && isCertified) {
      try {
        // 서버로 데이터 전송
        const response = await axios.post("/user/join", user);
        console.log("가입 성공:", response.data);
        // 추가 작업 수행 (예: 사용자에게 성공 메시지 표시)
      } catch (error) {
        console.error("가입 실패:", error);
        // 추가 작업 수행 (예: 사용자에게 오류 메시지 표시)
      }
    } else {
      alert("' * '표시는 무조건 작성해야함");
    }
  };

  // 양식 유효성 확인 함수
  const validateForm = () => {
    // 아이디 유효성 검사
    const idPattern = /^[a-z][a-z0-9]{7,19}$/;
    const isIdValid = idPattern.test(user.userId);
    setIsValid(prevState => ({ ...prevState, userId: isIdValid }));

    // 비밀번호 유효성 검사
    const pwPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$])[A-Za-z0-9!@#$]{6,15}$/;
    const isPwValid = pwPattern.test(user.userPw);
    setIsValid(prevState => ({ ...prevState, userPw: isPwValid }));

    // 닉네임 유효성 검사
    const isNickValid = !user.userNick || /^[가-힣a-zA-Z]{2,10}$/.test(user.userNick);
    setIsValid(prevState => ({ ...prevState, userNick: isNickValid }));

    // 이름 유효성 검사
    const namePattern = /^[가-힣a-zA-Z0-9]{2,10}$/;
    const isNameValid = namePattern.test(user.userName);
    setIsValid(prevState => ({ ...prevState, userName: isNameValid }));

    // 연락처 유효성 검사
    const isContactValid = !user.userContact || /^010[1-9][0-9]{3}[0-9]{4}$/.test(user.userContact);
    setIsValid(prevState => ({ ...prevState, userContact: isContactValid }));

    // 이메일 유효성 검사
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(user.userEmail);
    setIsValid(prevState => ({ ...prevState, userEmail: isEmailValid }));

    // 모든 유효성 검사를 통과했는지 확인
    const isValid =
      isIdValid &&
      isPwValid &&
      isNickValid &&
      isNameValid &&
      isContactValid &&
      isEmailValid;

    return isValid;
  };

  const handleSendCert = async () => {
    try {
      if (isValid.userEmail) {
        const response = await axios.post('/user/sendCert', null, {
          params: {
            certEmail: user.userEmail
          }
        });
        console.log('이메일이 성공적으로 전송되었습니다.');
        setUser({
          ...user,
          certEmail: response.data.certEmail
        });
      } else {
        console.error('유효하지 않은 이메일입니다.');
      }
    } catch (error) {
      if (error.response) {
        // 서버에서 상태 코드가 제공된 경우
        console.error('이메일 전송 중 오류가 발생했습니다:', error.response.data);
      } else if (error.request) {
        // 요청이 발생하지 않은 경우
        console.error('이메일 전송 요청에 문제가 발생했습니다:', error.request);
      } else {
        // 오류를 발생시킨 요청을 설정하는 데 문제가 있는 경우
        console.error('이메일 전송 요청에 오류가 있습니다:', error.message);
      }
      // 이메일 전송 중 오류가 발생했을 때 할 작업을 여기에 추가하세요.
    }
  };

  const handleCheckCert = async () => {
    try {
      const response = await axios.post('/user/checkCert', { userEmail: user.userEmail, certCode : user.userCert} );
      //저장
      setUser({
        ...user,
        certCode: response.data.certCode
      });
      console.log('응답 데이터:', response.data);

      // 여기서 인증에 성공했을 때 isValid.userCert 상태를 true로 설정합니다.
      setIsCertified(true);
    } catch (error) {
      console.error('요청 실패:', error);
    }
  };

  // 사용자 입력 변경 시 양식 유효성 다시 확인
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [user]);

  return (
    <>
      <h1>회원가입 화면입니다</h1>

      <div>
        {/* 입력 폼 */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="userId">아이디 * :</label>
          <input type="text" id="userId" name="userId" onBlur={handleInputBlur} />
          <span className={user.userId && !isValid.userId ? "invalid" : ""}>
            {user.userId && !isValid.userId && '아이디가 유효하지 않습니다.'}
          </span><br /><br />

          <label htmlFor="userPw">비밀번호 * :</label>
          <input type="password" id="userPw" name="userPw" onBlur={handleInputBlur} />
          <span className={user.userPw && !isValid.userPw ? "invalid" : ""}>
            {user.userPw && !isValid.userPw && '비밀번호가 유효하지 않습니다.'}
          </span><br /><br />

          <label htmlFor="userName">이름 * :</label>
          <input type="text" id="userName" name="userName" onBlur={handleInputBlur} />
          <span className={user.userName && !isValid.userName ? "invalid" : ""}>
            {user.userName && !isValid.userName && '이름이 유효하지 않습니다.'}
          </span><br /><br />

          <label htmlFor="userNick">닉네임:</label>
          <input type="text" id="userNick" name="userNick" onBlur={handleInputBlur} />
          <span className={user.userNick && !isValid.userNick ? "invalid" : ""}>
            {user.userNick && !isValid.userNick && '닉네임이 유효하지 않습니다.'}
          </span><br /><br />

          <label htmlFor="userContact">전화번호:</label>
          <input type="text" id="userContact" name="userContact" onBlur={handleInputBlur} />
          <span className={user.userContact && !isValid.userContact ? "invalid" : ""}>
            {user.userContact && !isValid.userContact && '전화번호가 유효하지 않습니다.'}
          </span><br /><br />

          <label htmlFor="userEmail">이메일 * :</label>
          <input type="email" id="userEmail" name="userEmail" onBlur={handleInputBlur} />
          <button onClick={handleSendCert} disabled={isSending}>전송{isSending && <span>전송 중...</span>}</button>
          <span className={user.userEmail && !isValid.userEmail ? "invalid" : ""}>
            {user.userEmail && !isValid.userEmail && '이메일이 유효하지 않습니다.'}
          </span><br /><br />

          <label htmlFor="userCert">인증번호 * :</label>
          <input type="text" id="userCert" name="userCert" onBlur={handleInputBlur} />
          <button onClick={handleCheckCert}>인증확인</button>
          <span className={user.userCert && !isValid.userCert ? "invalid" : ""}>
            {user.userCert && !isValid.userCert && '인증번호가 유효하지 않습니다.'}
          </span><br /><br />

          <button type="submit" className='btn btn-success'>가입하기</button>
        </form>
      </div>
    </>
  );
}

export default Join;
