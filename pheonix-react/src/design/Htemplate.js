import { NavLink, useNavigate } from 'react-router-dom';
import axios from "../components/utils/CustomAxios";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoginState, loginIdState, loginGradeState } from "../components/utils/RecoilData";
import { useCallback, useMemo } from "react";
import { RiCustomerService2Line } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { LuLogIn } from "react-icons/lu";
import { FiUserPlus } from "react-icons/fi";



function Htemplate() {

    //recoil state
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginGrade, setLoginGrade] = useRecoilState(loginGradeState);

    //recoil value
    const isLogin = useRecoilValue(isLoginState);

    //navigator
    const navigator = useNavigate();

    //callback
    const logout = useCallback(() => {
        //recoil 저장소에 대한 정리 + axios의 헤더 제거 + localStorage 청소
        setLoginId('');
        setLoginGrade('');
        delete axios.defaults.headers.common['Authorization'];
        window.localStorage.removeItem("refreshToken");

        navigator('/');

    }, [loginId, loginGrade]);


    return (
        <>

            <div className='container-fluid'>
                <div className='row' style={{ display: 'flex' }}>
                    <div className='offset-1 col-2'>
                        <NavLink to="/">
                            <img src={"/image/phoenixLogo.png"} style={{ width: '300px', maxWidth: '100%', height: '150px' }}></img>
                        </NavLink>
                    </div>
                    <div className='col-2 d-flex justify-content-start align-items-end'>
                        <p style={{ writingMode: 'initial', transform: 'none' }}>C U L T U R E P L E X</p>
                    </div>

                    <div className='offset-3 col-3 d-flex justify-content-end align-items-end'>

                        {/* isLogin에 따라 조건부 렌더링 */}
                        {isLogin ? (
                            <>
                                <div className="w-100 d-flex justify-content-middle text-center">
                                    <NavLink to="/mypage" className="dropdown-item">
                                        <IoPersonOutline style={{fontSize:'40px'}}/>
                                        <p>my phoenix</p>
                                    </NavLink>
                                </div>
                                <div className="w-100 d-flex justify-content-middle text-center">
                                    <NavLink onClick={logout} className="dropdown-item">
                                        <FiLogOut style={{fontSize:'40px'}} />
                                        <p>로그아웃</p>
                                    </NavLink>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="d-flex justify-content-middle w-100 text-center">
                                    <NavLink to="/login" className="dropdown-item">
                                        <LuLogIn style={{fontSize:'40px'}}/>
                                        <p>로그인</p>
                                    </NavLink>
                                </div>
                                <div className="w-100 d-flex justify-content-middle text-center">
                                    <NavLink to="/join" className="dropdown-item">
                                        <FiUserPlus style={{fontSize:'40px'}}/>
                                        <p>회원가입</p>
                                    </NavLink>
                                </div>
                            </>
                        )}
                        <div className="w-100 d-flex justify-content-middle text-center">
                            <NavLink className="dropdown-item" to="/personal">
                                <RiCustomerService2Line style={{fontSize:'40px'}}/>
                                <p>고객센터</p>
                            </NavLink>
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
                            {loginGrade === '관리자' &&
                                <>
                                    <li className="nav-item dropdown">
                                        <NavLink className="nav-link dropdown-toggle fs-5 me-5" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">관리자</NavLink>
                                        <div className="dropdown-menu">
                                            <NavLink className="dropdown-item" to="/adminMovie">영화</NavLink>
                                            <NavLink className="dropdown-item" to="/adminCinema">영화관</NavLink>
                                            <NavLink className="dropdown-item" to="/adminTheater">상영관</NavLink>
                                            <NavLink className="dropdown-item" to="/movieSchedule">상영일정</NavLink>
                                            <NavLink className="dropdown-item" to="/adminStore">스토어</NavLink>
                                        </div>
                                    </li>
                                    <li className='nav-item dropdown'>
                                        <NavLink className="nav-link fs-5" to="/reserveStats">통계</NavLink>
                                    </li>
                                </>
                            }

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