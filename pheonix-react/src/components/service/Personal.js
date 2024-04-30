import React from 'react';
import { NavLink } from 'react-router-dom';

const Personal = () => {
    return (
        <div className="container">
            <div className="text-center mb-3">
                <img src="/image/personal.png"/>
            </div>
            <div className="text-end mb-3">
                <NavLink to="/lost">분실물</NavLink>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 title head">
                    <div className="d-flex justify-content-between align-items-center">
                        <div style={{ fontSize: '18px' }}>번호</div>
                        <div className="title-head-text" style={{ fontSize: '18px', textAlign: 'center' }}>제목</div>
                        <div style={{ fontSize: '18px' }}>글쓴이</div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-end">
                <div className="col-lg-8 text-end">
                    <NavLink to="/writepost" className="btn btn-positive">글쓰기</NavLink>
                </div>
            </div>
        </div>
    );
};

export default Personal;
