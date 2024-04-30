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
    "userCert": "" // 인증번호 필드 추가
  });

  const [isValid, setIsValid] = useState({
    userId: true,
    userPw: true,
    userNick: true,
    userName: true,
    userContact: true,
    userEmail: true,
    userCert: true // 인증번호 유효성 상태 추가
  });

  const [isFormValid, setIsFormValid] = useState(false);

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
    if (isFormValid) {
      try {
        // 서버로 데이터 전송
        const response = await axios.post("/user/join", user);
        console.log("가입 성공:", response.data);
        // 추가 작업 수행 (예: 사용자에게 성공 메시지 표시)

        // Now send verification email
        await sendVerificationEmail(user.userEmail);
      } catch (error) {
        console.error("가입 실패:", error);
        // 추가 작업 수행 (예: 사용자에게 오류 메시지 표시)
      }
    } else {
      alert("' * '표시는 무조건 작성해야함");
    }
  };

  // Send verification email
  const sendVerificationEmail = async () => {
    try {
      const response = await axios.post("/user/sendCert", { certEmail: user.userEmail });
      console.log("성공이야:", response.data);
    } catch (error) {
      console.error("실패:", error);
    }
  };

  // 인증번호 확인 함수
  const handleVerifyCert = async () => {
    try {
      const response = await axios.post("/user/checkCert", { certCode: user.userCert });
      if (response.data) {
        setIsValid(prevState => ({ ...prevState, userCert: true }));
      } else {
        setIsValid(prevState => ({ ...prevState, userCert: false }));
      }
    } catch (error) {
      console.error("인증번호 확인 실패:", error);
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
          <button type="button" onClick={sendVerificationEmail}>전송</button>
          <span className={user.userEmail && !isValid.userEmail ? "invalid" : ""}>
            {user.userEmail && !isValid.userEmail && '이메일이 유효하지 않습니다.'}
          </span><br /><br />

          {/* 인증번호 입력 필드 */}
          <label htmlFor="userCert">인증번호 * :</label>
          <input type="text" id="userCert" name="userCert" value={user.userCert} onChange={handleInputBlur} onBlur={handleVerifyCert} />
          <span className={!isValid.userCert ? "invalid" : ""}>
            {!isValid.userCert && '인증번호가 유효하지 않습니다.'}
          </span><br /><br />

          <button type="submit" className='btn btn-success'>가입하기</button>
        </form>
      </div>
    </>
  );
}

export default Join;
