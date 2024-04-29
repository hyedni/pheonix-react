//스토어의 메뉴바 점보트론
import '../../design/commons.css';
import '../../design/layout.css';
import { NavLink } from "react-router-dom";

const StoreMenuJumbotron = () =>{

    return(
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        스토어
                    </div>
                </div>
            </div>
            {/* 페이지 내부 메뉴 바 */}
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <nav className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
                        <div className="collapse navbar-collapse" id="navbarColor03">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item">
                                    <NavLink className="nav-link active" to="/store">패키지</NavLink>
                                        {/* <span className="visually-hidden">(current)</span> */}
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link active" to="/store">포인트</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link active" to="/store">콤보</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link active" to="/store">팝콘</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link active" to="/store">음료</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="nav-link active" to="/store">스낵</NavLink>
                                </li>
                            </ul>

                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default StoreMenuJumbotron;