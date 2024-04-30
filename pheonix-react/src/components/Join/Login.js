import React, { useCallback, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router";
import { NavLink } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIdState, loginLevelState, isLoginState } from "/utils/RecoilData";


const firebaseConfig = {
    apiKey: "AIzaSyCH_qQKgvX04MCiInM0t-1el2gXoNc9YpI",
    authDomain: "easylogin-69172.firebaseapp.com",
    projectId: "easylogin-69172",
    storageBucket: "easylogin-69172.appspot.com",
    messagingSenderId: "507786873248",
    appId: "1:507786873248:web:a4effc2440a8e81bfbfcc5",
    measurementId: "G-VHQWRQTS8W"
};

function Login() {
    const isLogin = useRecoilValue(isLoginState);
    //state
    const [users, setUsers] = useState({
        userId: "", userPw: ""
    });

    //recoil
    const [loginId, setLoginId] = useRecoilState(loginIdState);

    //callback
    const changeUser = useCallback(e => {
        setUsers({
            ...users,
            [e.target.name]: e.target.value
        });
    }, [users]);

    //navigator
    const navigator = useNavigate();

    const login = useCallback(async () => {
        if (users.userId.length === 0) return;
        if (users.userPw.length === 0) return;

        const resp = await axios.post("/user/login", users);
        console.log(resp.data);

        setLoginId(resp.data.userId);

        //accessToken은 이후의 axios 요청에 포함시켜서 서버로 가져가야 한다
        //-> 이 순간 이후로 모든 요청의 header에 Authorization이라는 이름으로 토큰을 첨부하겠다
        axios.defaults.headers.common['Authorization'] = resp.data.accessToken;

        //(+추가) refreshToken을 localStroage에 저장
        window.localStorage.setItem("refreshToken", resp.data.refreshToken);

        //강제 페이지 이동 - useNavigate()
        //navigator("/");
    }, [users]);

    const handleGoogleLogin = () => {
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        auth.languageCode = "ko"; 

        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(result);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.error(error);
            });
    };


    return (
        <>
            <h1>회원가입 화면입니다</h1>
            <div className="d-flex">
                {isLogin ? (//로그인
                    <>
                        로그인됨
                    </>
                ) : (//로그아웃
                    <>
                        로그아웃됨
                    </>
                )}
            </div>

            <div>
                <button className="clicked">로그인</button>
                <button>
                    <NavLink to="/non-user">비회원예매</NavLink>
                </button>
                <button>
                    <NavLink to="/non-user-check">비회원 예매확인</NavLink>
                </button>
            </div><br /><br />

            <form>
                <label>아이디:</label>
                <input type="text" />
                <label>비밀번호:</label>
                <input type="password" /><br /><br />
                <button type="submit">로그인</button>
            </form><br /><br />

            <div>
                <button onClick={handleGoogleLogin}>구글 아이디로 로그인</button>
            </div>



        </>

    );
}

export default Login;