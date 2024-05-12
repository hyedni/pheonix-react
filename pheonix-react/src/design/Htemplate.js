import { NavLink } from 'react-router-dom';
import axios from "../components/utils/CustomAxios";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, loginIdState, loginGradeState } from "../components/utils/RecoilData";
import { useCallback, useMemo } from "react";



function Htemplate() {

    //recoil state
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginGrade, setLoginGrade] = useRecoilState(loginGradeState);

    //recoil value
    const isLogin = useRecoilValue(isLoginState);

    //callback
    const logout = useCallback(() => {
        //recoil 저장소에 대한 정리 + axios의 헤더 제거 + localStorage 청소
        setLoginId('');
        setLoginGrade('');
        delete axios.defaults.headers.common['Authorization'];
        window.localStorage.removeItem("refreshToken");
    }, [loginId, loginGrade]);


    return (
        <>

            <div className='container-fluid'>
                <div className='row' style={{ display: 'flex' }}>
                    <div className='offset-1 col-2'>
                        <img src={"/image/phoenixLogo.png"} style={{ width: '300px', maxWidth: '100%', height: 'auto' }}></img>
                    </div>
                    <div className='col-2 d-flex justify-content-start align-items-end'>
                        <p style={{ writingMode: 'initial', transform: 'none' }}>C U L T U R E P L E X</p>
                    </div>

                    <div className='offset-1 col-4 d-flex justify-content-end align-items-end'>

                        {/* isLogin에 따라 조건부 렌더링 */}
                        {isLogin ? (
                            <>
                                <div className="w-100 d-flex justify-content-middle text-center">
                                    <NavLink to="/mypage">My PHOENIX</NavLink>
                                </div>
                                <div className="w-100 d-flex justify-content-middle text-center">
                                    <NavLink onClick={logout}>로그아웃</NavLink>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="d-flex justify-content-middle w-100 text-center">
                                    <NavLink to="/login">로그인</NavLink>
                                </div>
                                <div className="w-100 d-flex justify-content-middle text-center">
                                    <NavLink to="/join">회원가입</NavLink>
                                </div>
                            </>
                        )}

                        <div className="w-100 d-flex justify-content-middle ms-4 text-center">
                            <NavLink className="dropdown-item" to="/personal">고객센터</NavLink>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand-lg bg-light mt-4" data-bs-theme="light">
                <div className="container-fluid">
                    <span className='me-5' />
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarColor03">
                        <ul className="navbar-nav me-auto">
                            <li className='nav-item dropdown'>
                                <NavLink className="nav-link fs-5 me-5" to="/moviechart">영화</NavLink>
                            </li>
                            <li className='nav-item dropdown'>
                                <NavLink className="nav-link fs-5 me-5" to="/adminCinema">영화관</NavLink>
                            </li>
                            <li className='nav-item dropdown'>
                                <NavLink className="nav-link fs-5 me-5" to="/booking">예매</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle fs-5 me-5" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">스토어</NavLink>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/store/package">패키지</NavLink>
                                    <NavLink className="dropdown-item" to="/store/point">포인트</NavLink>
                                    <NavLink className="dropdown-item" to="/store/combo">콤보</NavLink>
                                    <NavLink className="dropdown-item" to="/store/popcorn">팝콘</NavLink>
                                    <NavLink className="dropdown-item" to="/store/drink">음료</NavLink>
                                    <NavLink className="dropdown-item" to="/store/snack">스낵</NavLink>
                                </div>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle fs-5 me-5" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">관리자</NavLink>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/adminCinema">영화관</NavLink>
                                    <NavLink className="dropdown-item" to="/adminMovie">영화</NavLink>
                                    <NavLink className="dropdown-item" to="/adminTheater">상영관</NavLink>
                                    <NavLink className="dropdown-item" to="/movieSchedule">상영일정</NavLink>
                                    <NavLink className="dropdown-item" to="/adminStore">스토어</NavLink>
                                    <NavLink className="dropdown-item" to="/movieRegister">회원관리</NavLink>
                                </div>
                            </li>
                            <li className='nav-item dropdown'>
                                <NavLink className="nav-link fs-5" to="/movieRegister">통계</NavLink>
                            </li>
                        </ul>
                        {/* <form className="d-flex">
                            <input className="form-control me-sm-2" type="search" placeholder="Search"/>
                                <button className="btn btn-secondary my-2 my-sm-0" type="submit">Search</button>
                        </form> */}
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Htemplate;