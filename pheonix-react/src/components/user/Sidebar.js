import React from 'react';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router-dom";
import './Mypage.css';

function Sidebar() {


    return (
        <div className="col-3">

            <ul className="nav flex-column">
                {/* 헤더 */}
                <li className="nav-item">
                    <Link to="/mypage" className="link-offset-2 link-underline link-underline-opacity-0 content-body-text phoenix-side-title">
                        나의 Phoenix Home
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="#" className="link-offset-2 link-underline link-underline-opacity-0 content-body-text phoenix-side-mid">
                        이용내역
                    </Link>
                    <NavLink className="nav-link" to="/mypage/myReservation">나의 예매내역</NavLink>
                    <NavLink className="nav-link" to="/mypage/myReservation">나의 예매내역</NavLink>
                    <NavLink className="nav-link" to="/mypage/myPersonal">나의 문의내역</NavLink>
                    <NavLink className="nav-link" to="#">나의 리뷰내역</NavLink>
                    <NavLink className="nav-link" to="/mypage/myStore">나의 상품구매내역</NavLink>
                </li>

                <li className="nav-item">
                    <Link to="/mypage/infoPheonix" className="link-offset-2 link-underline link-underline-opacity-0 content-body-text phoenix-side-mid">
                        Phoenix 이용 안내
                    </Link>
                    <NavLink className="nav-link" to="/mypage/infoPheonix">Pheonix 이용</NavLink>
                    <NavLink className="nav-link" to="/mypage/infoPoint">포인트 사용</NavLink>
                </li>
                <li className="nav-item">
                    <Link to="#" className="link-offset-2 link-underline link-underline-opacity-0 content-body-text phoenix-side-mid">
                        내 정보 관리
                    </Link>
                    <NavLink className="nav-link" to="/mypage/change">개인정보 변경</NavLink>
                    <NavLink className="nav-link" href="#">회원 탈퇴</NavLink>
                </li>
                
            </ul>
        </div>
    );
}

export default Sidebar;
