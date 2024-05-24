import React, { useCallback, useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "../utils/CustomAxios";
import { useNavigate } from "react-router";
import { NavLink } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";
import { loginIdState, loginGradeState, isLoginState } from "../utils/RecoilData";
import { createUserWithEmailAndPassword } from 'firebase/auth'


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
    const [user, setUser] = useState({
        userId: "", userPw: ""
    });

    const [userData, setUserData] = useState(null);

    //recoil
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginGrade, setLoginGrade] = useRecoilState(loginGradeState);
    // const [nonLoginId, setNonLoginId] = useRecoilState(nonUser)


    //callback
    const changeUser = useCallback((e) => {
        const { name, value } = e.target;

        setUser({
            ...user,
            [name]: value
        });
    }, [user]);

    useEffect(() => {
        
    }, [loginId]);

    //navigator
    const navigator = useNavigate();

    const login = useCallback(async () => {
        try {
            if (user.userId.length === 0) throw new Error("사용자 ID를 입력하세요.");
            if (user.userPw.length === 0) throw new Error("비밀번호를 입력하세요.");

            const resp = await axios.post(`/user/login`, user);
            setLoginId(resp.data.userId);
            setLoginGrade(resp.data.userGrade);

            // accessToken은 이후의 axios 요청에 포함시켜서 서버로 가져가야 합니다.
            // 이 순간 이후로 모든 요청의 header에 Authorization이라는 이름으로 토큰을 첨부하겠습니다.
            axios.defaults.headers.common['Authorization'] = resp.data.accessToken;

            // refreshToken을 localStorage에 저장합니다.
            window.localStorage.setItem("refreshToken", resp.data.refreshToken);

            navigator("/");

        } catch (error) {
            // 로그인 과정에서 오류가 발생한 경우 오류를 콘솔에 기록합니다.
            console.error("로그인 오류:", error.message);
            alert("틀렸습니다 다시해주세요");
        }
    }, [user]);

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
                setUserData(user); // 사용자 정보 설정
                //console.log(user); // 사용자 정보 출력
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

            <div className="container mt-4" style={{ maxWidth: "400px" }}>

            <img src={"/image/phoenixLogo.png"} style={{ width: '300px', maxWidth: '100%', height: '150px' }}></img>

            <div className="mb-4">
               


     
 
                </div>


                <div className="row">
                    <div className="col">
                        <label>아이디:</label>
                        <input type="text" name="userId" className="form-control"
                            value={user.userId} onChange={changeUser} />
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col">
                        <label>비밀번호:</label>
                        <input type="password" name="userPw" className="form-control"
                            value={user.userPw} onChange={changeUser} />
                    </div>
                </div>

                <div className="row mt-4 mb-4">
                    <div className="col">
                        <button className="btn btn-success w-100" onClick={login}>로그인</button>
                    </div>
                </div>

                <div className="row mt-2">
                    <div className="col">
                        <button className="btn btn-success w-100" onClick={handleGoogleLogin}>구글 아이디로 로그인</button>
                    </div>
                </div>

                <div className="row mt-2 mb-5">
                    <div className="col">
                        <NavLink to="/nonUser" style={{textDecoration: 'none', color: 'inherit'}}>
                            <button className="btn btn-secondary w-100" style={{}}>비회원 예매</button>
                        </NavLink>
                    </div>
                </div>

            </div>

        </>

    );
}

export default Login;
