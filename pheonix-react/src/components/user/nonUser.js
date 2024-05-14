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
            </div>

        </>
    )
}

export default NonUser;