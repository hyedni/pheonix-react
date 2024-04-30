import { NavLink } from 'react-router-dom';
import axios from "../components/utils/CustomAxios";


function Htemplate() {
    return (
        <>

            <div className='container-fluid'>
                <div className='row'>
                    <div className='offset-1 col-2'>
                        <img src={"/image/phoenixLogo.png"} style={{ width: '300px', maxWidth: '100%', height: 'auto' }}></img>
                    </div>
                    <div className='col-5'></div>
                    <div className='col-4 d-flex justify-content-end align-items-end'>
                        <div className="d-flex justify-content-middle w-100 text-center">
                            로그인
                        </div>
                        <div className="w-100 d-flex justify-content-middle text-center">
                            회원가입
                        </div>
                        <div className="w-100 d-flex justify-content-middle text-center">
                            My PHOENIX
                        </div>
                        <div className="w-100 d-flex justify-content-middle ms-4 text-center">
                        <NavLink className="dropdown-item" to="/personal">고객센터</NavLink>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="navbar navbar-expand-lg bg-light mt-4" data-bs-theme="light">
                <div className="container-fluid">
                    <span className='me-5'/>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarColor03">
                        <ul className="navbar-nav me-auto">
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle fs-5 me-5" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">영화</NavLink>
                                    <div className="dropdown-menu">
                                        <NavLink className="dropdown-item" href="#">예매</NavLink>
                                        <NavLink className="dropdown-item" href="#">something</NavLink>
                                        <NavLink className="dropdown-item" href="#">Something</NavLink>
                                        {/* <div className="dropdown-divider"></div>
                                        <NavLink className="dropdown-item" href="#">Separated </NavLink> */}
                                    </div>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle fs-5 me-5" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">극장</NavLink>
                                    <div className="dropdown-menu">
                                        <NavLink className="dropdown-item" href="#">Action</NavLink>
                                        <NavLink className="dropdown-item" href="#">Another action</NavLink>
                                        <NavLink className="dropdown-item" href="#">Something else here</NavLink>
                                        {/* <div className="dropdown-divider"></div>
                                        <NavLink className="dropdown-item" href="#">Separated link</NavLink> */}
                                    </div>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle fs-5 me-5" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">예매</NavLink>
                                    <div className="dropdown-menu">
                                        <NavLink className="dropdown-item" href="#">Action</NavLink>
                                        <NavLink className="dropdown-item" href="#">Another action</NavLink>
                                        <NavLink className="dropdown-item" href="#">Something else here</NavLink>
                                        {/* <div className="dropdown-divider"></div>
                                        <NavLink className="dropdown-item" href="#">Separated link</NavLink> */}
                                    </div>
                            </li>
                            
                            <li className="nav-item dropdown">
                                <NavLink  className="nav-link fs-5 me-5" to="/store">스토어</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <NavLink className="nav-link dropdown-toggle fs-5 me-5" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">관리자</NavLink>
                                <div className="dropdown-menu">
                                    <NavLink className="dropdown-item" to="/movieRegister">지점관리</NavLink>
                                    <NavLink className="dropdown-item" to="/adminMovie">영화관리</NavLink>
                                    <NavLink className="dropdown-item" to="/movieRegister">상영관관리</NavLink>
                                    <NavLink className="dropdown-item" to="/movieRegister">스토어관리</NavLink>
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