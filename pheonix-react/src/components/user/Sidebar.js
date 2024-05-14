import React from 'react';

function Sidebar() {
    return (

        <div className="row">
          <div className="col-lg-3">
            <div className="card mb-3">
              <div className="card-body">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link active" href="#">나의 예매내역</a>
                    <a className="nav-link active" href="#">나의 문의내역</a>
                    <a className="nav-link active" href="#">나의 상품구매내역</a>
                    <a className="nav-link" href="#">개인정보 변경</a>
                    <a className="nav-link" href="#">회원 탈퇴</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9">
            {/* 메인 컨텐츠 */}
          </div>
        </div>

    );
  }

export default Sidebar;