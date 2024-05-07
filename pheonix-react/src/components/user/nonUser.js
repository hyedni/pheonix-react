import { loginIdState, loginGradeState, isLoginState } from "../utils/RecoilData";
import { useNavigate } from "react-router";
import { NavLink } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from "recoil";

function nonUser() {

    const isLogin = useRecoilValue(isLoginState);
    
    //recoil
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginGrade, setLoginGrade] = useRecoilState(loginGradeState);

    return (
        <>
            <div className="container mt-4" style={{ maxWidth: "400px" }}>
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
                <div className="mb-4">
                    <button className="btn btn-outline-secondary">
                        <NavLink to="/user/login">로그인</NavLink>
                    </button>
                    <button className="btn btn-outline-secondary">
                        <NavLink to="/user/nonUser">비회원 예매</NavLink>
                    </button>
                    <button className="btn btn-outline-secondary">
                        <NavLink to="/user/nonUserCheck">비회원 예매확인</NavLink>
                    </button>
                </div>
            </div>

        </>
    )
}

export default nonUser;