import React, { useCallback, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { NavLink } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIdState, loginGradeState, isLoginState } from "../utils/RecoilData";

function NonUser() {



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


                <div className="form-group mb-4">
                    <label htmlFor="nonUserBirth">생년월일 :</label>
                    <input type="text" id="nonUserBirth" name="nonUserBirth"
                        // onBlur={handleInputBlur} className={`form-control ${user.nonUserBirth && !isValid.nonUserBirth ? "is-invalid" : ""}`}
                        className="form-control"
                    />
                    {/* <div className="invalid-feedback">
                        {user.nonUserBirth && !isValid.nonUserBirth && '아이디가 유효하지 않습니다.'}
                    </div> */}
                </div>

                <div className="form-group mb-4">
                    <label htmlFor="nonUserEmail">이메일 * :</label>
                    <div className="input-group">
                        <input type="email" id="nonUserEmail" name="nonUserEmail"
                             // onBlur={handleInputBlur} className={`form-control ${user.nonUserEmail && !isValid.nonUserEmail ? "is-invalid" : ""}`}
                              className="form-control"
                            aria-describedby="button-addon2" />
                        <button type="button" 
                        // onClick={sent ? undefined : handleSendCert} 
                        className="btn btn-outline-secondary">
                            전송
                            {/* {sending ? "전송 중..." : sent ? "전송 완료" : "전송"} */}
                        </button>
                    </div>
                    {/* <div id="emailFeedback" className="invalid-feedback d-block">
                        {user.nonUserEmail && !isValid.nonUserEmail && '이메일이 유효하지 않습니다.'}
                    </div> */}
                    <div id="emailCheckFeedback" className="invalid-feedback d-block" />
                </div>


                {/* 인증번호 입력 필드 */}
                <div className="form-group mb-4">
                    <label htmlFor="nonUserCert">인증번호 * :</label>
                    <div className="input-group">
                        <input type="text" id="nonUserCert" name="nonUserCert" 
                        // onChange={handleInputBlur} className={`form-control ${user.nonUserCert && !isValid.nonUserCert ? "is-invalid" : ""}`}
                        className="form-control"
                            aria-describedby="button-addon2" />
                        <button type="button" 
                        // onClick={isCertified ? undefined : handleCheckCert} 
                        className="btn btn-outline-primary">
                            인증
                            {/* {isCertified ? "인증완료" : "인증"} */}
                        </button>
                    </div>
                    <div id="certFeedback" className="invalid-feedback d-block" />
                </div>

                <div className="form-group mt-4">
                    <label htmlFor="nonUserPw">비밀번호 * :</label>
                    <input type="password" id="nonUserPw" name="nonUserPw"
                        // onBlur={handleInputBlur} className={`form-control ${user.nonUserPw && !isValid.nonUserPw ? "is-invalid" : ""}`}
                        className="form-control"
                    />
                    {/* <div className="invalid-feedback">
                        {user.nonUserPw && !isValid.nonUserPw && '비밀번호가 유효하지 않습니다.'}
                    </div> */}
                </div>

                <div className="form-group mt-4">
                    <label htmlFor="nonUserPwCheck">비밀번호 * :</label>
                    <input type="password" id="nonUserPwCheck" name="nonUserPwCheck"
                        // onBlur={handleInputBlur} className={`form-control ${user.nonUserPw && !isValid.nonUserPw ? "is-invalid" : ""}`}
                        className="form-control"
                    />
                    {/* <div className="invalid-feedback">
                        {user.nonUserPw && !isValid.nonUserPw && '비밀번호가 유효하지 않습니다.'}
                    </div> */}
                </div>

                <button className='btn btn-success w-100 mt-4 mb-4' 
                // onClick={handleSubmit}
                >비회원 예매하기</button>

            </div>

        </>
    )
}

export default NonUser;