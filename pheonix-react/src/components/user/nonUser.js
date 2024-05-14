import React, { useCallback, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { NavLink } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIdState, loginGradeState, isLoginState, isNonUserState } from "../utils/RecoilData";

function NonUser() {
    const [isNonUserEmail, setIsNonUserEmail] = useRecoilState(isNonUserState);

    const [nonUser, setNonUser] = useState({
          "nonUserEmail": "",
          "nonUserBirth": "",
          "nonUserPw": "",
          "nonUserPwCheck":"",
          "nonUserCertCode": ""
  });
    const [isValid, setIsValid] = useState({
        nonUserEmail: true,
        nonUserBirth: true,
        nonUserPw: true,
        nonUserPwCheck: true
    });

    const [isFormValid, setIsFormValid] = useState(false);
    const [isCertified, setIsCertified] = useState(false); // 추가: 인증번호 확인 상태
    const [sending, setSending] = useState(false);//전송중 상태
    const [sent, setSent] = useState(false);//전송완료

    //navigator
    const navigator = useNavigate();

    // 값 입력 함수
    const handleInputBlur = useCallback((e) => {
        const { name, value } = e.target;

        setNonUser({
            ...nonUser,
            [name]: value
        });
    }, [nonUser]);

     // 폼 제출 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 양식 유효성 확인
    if (isFormValid && isCertified) {
      try {
        // 서버로 데이터 전송
        const response = await axios.post('/user/nonUserJoin', nonUser);
        console.log("가입 성공:", response.data);
        // 추가 작업 수행 (예: 사용자에게 성공 메시지 표시)
        //setIsNonUserEmail(response.data.nonUser);
        //예매페이지로 이동
        navigator("/booking");
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
    // 생년월일 유효성 검사
    const birthPattern = /^([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
    const isBirthValid = birthPattern.test(nonUser.nonUserBirth);
    setIsValid(prevState => ({ ...prevState, nonUserBirth: isBirthValid }));
    
    // 이메일 유효성 검사
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isEmailValid = emailPattern.test(nonUser.nonUserEmail);
    setIsValid(prevState => ({ ...prevState, nonUserEmail: isEmailValid }));

    // 비밀번호 유효성 검사
    const pwPattern = /^[0-9]{4}$/;
    const isPwValid = pwPattern.test(nonUser.nonUserPw);
    setIsValid(prevState => ({ ...prevState, nonUserPw: isPwValid }));

    // 비밀번호 확인 유효성 검사
    const isConfirmPwValid = nonUser.nonUserPw === nonUser.nonUserPwCheck;
    setIsValid(prevState => ({ ...prevState, nonUserPwCheck: isConfirmPwValid }));

    // 모든 유효성 검사를 통과했는지 확인
    const isValid =

      isBirthValid &&
      isEmailValid&&
      isPwValid &&
      isConfirmPwValid;

    return isValid;
  };

  const handleSendCert = async () => {
    try {
      if (isValid.nonUserEmail) {
        setSending(true); // 전송 시작 시 sending 상태를 true로 설정
        const response = await axios.post('/user/nonUserSend', null, {
          params: {
            nonUserCertEmail: nonUser.nonUserEmail
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
    console.log(nonUser);
    try {
      const response = await axios.post('/user/nonUserCheck',
       { nonUserCertEmail: nonUser.nonUserEmail, nonUserCertCode: nonUser.nonUserCertCode });
      
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
    sessionStorage.setItem("nonUser", JSON.stringify(nonUser));
  }, [nonUser]);



    return (
        <>
            <div className="container mt-4" style={{ maxWidth: "400px" }}>
                <h1>회원가입 화면입니다</h1>
                
                <div className="mb-4">
                    <button className="btn btn-outline-secondary">
                        <NavLink to="/login">로그인</NavLink>
                    </button>
                    <button className="btn btn-outline-secondary">
                        <NavLink to="/nonUser">비회원 예매</NavLink>
                    </button>
                    <button className="btn btn-outline-secondary">
                        <NavLink to="/nonUserCheck">비회원 예매확인</NavLink>
                    </button>
                </div>
            </div>

        </>
    )
}

export default NonUser;