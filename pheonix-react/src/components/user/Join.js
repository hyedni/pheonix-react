import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from "../utils/CustomAxios";
import './join.css';
import { useNavigate } from "react-router";

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
    "userCert": ""
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
  const [sending, setSending] = useState(false);//전송중 상태
  const [sent, setSent] = useState(false);//전송완료
  const [file, setFile] = useState(null);//파일
  const [imagePreview, setImagePreview] = useState(null);

  //navigator
  const navigator = useNavigate();

  // 값 입력 함수
  const handleInputBlur = useCallback((e) => {
    const { name, value } = e.target;

    setUser({
      ...user,
      [name]: value
    });
  }, [user]);

  //첨부파일관련
  const handleImageChange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      setFile(file);
      reader.readAsDataURL(file);
    }
  };

  // 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 양식 유효성 확인
    if (isFormValid && isCertified) {
      const formData = new FormData();
      for(const key in user){
        formData.append(key, user[key]);
        console.log(user);
      }

      if (file) {
        formData.append('attach', file); // 파일 추가
      }
      
      console.log(formData);
      try {
        // 서버로 데이터 전송
        const response = await axios.post('/user/join', formData);
        console.log("가입 성공:", response.data);
        // 추가 작업 수행 (예: 사용자에게 성공 메시지 표시)

        navigator("/");
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
    const namePattern = /^[가-힣a-zA-Z]{2,10}$/;
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
        setSending(true); // 전송 시작 시 sending 상태를 true로 설정
        const response = await axios.post('/user/sendCert', null, {
          params: {
            certEmail: user.userEmail
          }
        });

        console.log('이메일이 성공적으로 전송되었습니다.');
        setSending(false); // 전송 완료 후 sending 상태를 false로 설정
        setSent(true);
        setTimeout(() => {
          setSent(false);
          document.getElementById("emailCheckFeedback").innerText = "인증메일이 전송되지 않았나요?";
        }, 4000); // 4초 후에 전송 버튼으로 변경
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
    }
  };

  const handleCheckCert = async () => {
    console.log(user);
    try {
      const response = await axios.post('/user/checkCert', { certEmail: user.userEmail, certCode: user.userCert });

      console.log('응답 데이터:', response.data);

      // 여기서 인증에 성공했을 때 setIsCertified 상태를 true로 설정합니다.
      setIsCertified(true);
    } catch (error) {
      document.getElementById("certFeedback").innerText = "인증번호가 유효하지 않습니다.";
      console.error('요청 실패:', error);
    }
  };

  // 사용자 입력 변경 시 양식 유효성 다시 확인
  useEffect(() => {
    setIsFormValid(validateForm());
  }, [user]);

  return (
    <>

      <div className="join-container">
      <span style={{fontSize:'30px', fontWeight:'bolder'}}>회원가입 화면입니다.</span>
        <div className="join-form">

          {/* 입력 폼 */}
          <div className="form-group">
            <label htmlFor="userId">프로필 이미지 :</label>
            <div className="input-group">
              <input type="file" onChange={handleImageChange} className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userId">아이디 * :</label>
            <input type="text" id="userId" name="userId" onBlur={handleInputBlur} className={`form-control ${user.userId && !isValid.userId ? "is-invalid" : ""}`} />
            <div className="invalid-feedback">
              {user.userId && !isValid.userId && '아이디가 유효하지 않습니다.'}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userPw">비밀번호 * :</label>
            <input type="password" id="userPw" name="userPw" onBlur={handleInputBlur} className={`form-control ${user.userPw && !isValid.userPw ? "is-invalid" : ""}`} />
            <div className="invalid-feedback">
              {user.userPw && !isValid.userPw && '비밀번호가 유효하지 않습니다.'}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userName">이름 * :</label>
            <input type="text" id="userName" name="userName" onBlur={handleInputBlur} className={`form-control ${user.userName && !isValid.userName ? "is-invalid" : ""}`} />
            <div className="invalid-feedback">
              {user.userName && !isValid.userName && '이름이 유효하지 않습니다.'}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userNick">닉네임:</label>
            <input type="text" id="userNick" name="userNick" onBlur={handleInputBlur} className={`form-control ${user.userNick && !isValid.userNick ? "is-invalid" : ""}`} />
            <div className="invalid-feedback">
              {user.userNick && !isValid.userNick && '닉네임이 유효하지 않습니다.'}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userBirth">생일:</label>
            <input type="date" id="userBick" name="userBirth" onBlur={handleInputBlur} className="form-control" />
          </div>

          <div className="form-group">
            <label htmlFor="userContact">전화번호:</label>
            <input type="text" id="userContact" name="userContact" onBlur={handleInputBlur} className={`form-control ${user.userContact && !isValid.userContact ? "is-invalid" : ""}`} />
            <div className="invalid-feedback">
              {user.userContact && !isValid.userContact && '전화번호가 유효하지 않습니다.'}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="userEmail">이메일 * :</label>
            <div className="input-group">
              <input type="email" id="userEmail" name="userEmail" onBlur={handleInputBlur}
                className={`form-control ${user.userEmail && !isValid.userEmail ? "is-invalid" : ""}`}
                aria-describedby="button-addon2" />
              <button type="button" onClick={sent ? undefined : handleSendCert} className="btn btn-outline-secondary">
                {sending ? "전송 중..." : sent ? "전송 완료" : "전송"}
              </button>
            </div>
            <div id="emailFeedback" className="invalid-feedback d-block">
              {user.userEmail && !isValid.userEmail && '이메일이 유효하지 않습니다.'}
            </div>
            <div id="emailCheckFeedback" className="invalid-feedback d-block" />
          </div>


          {/* 인증번호 입력 필드 */}
          <div className="form-group">
            <label htmlFor="userCert">인증번호 * :</label>
            <div className="input-group">
              <input type="text" id="userCert" name="userCert" onChange={handleInputBlur}
                className={`form-control ${user.userCert && !isValid.userCert ? "is-invalid" : ""}`}
                aria-describedby="button-addon2" />
              <button type="button" onClick={isCertified ? undefined : handleCheckCert} className="btn btn-outline-primary">
                {isCertified ? "인증완료" : "인증"}
              </button>
            </div>
            <div id="certFeedback" className="invalid-feedback d-block" />
          </div>


          <button className='btn btn-success w-100 mt-4' onClick={handleSubmit}>가입하기</button>

        </div>
      </div>

    </>

  );
}

export default Join;
