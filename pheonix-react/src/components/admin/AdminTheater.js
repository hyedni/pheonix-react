import { FaCirclePlus } from "react-icons/fa6";

function AdminTheater() {
    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        상영관 관리
                        {/* <span className='ms-3'><FaCirclePlus style={{ marginBottom: '10px', color:'rgb(240, 86, 86)'}} /></span> */}
                    </div>
                </div>
            </div>
            <hr />

            <div className="row">
                <div className="offset-2 col-lg-8">
                    <h3>등록할 영화관 선택/조회</h3>
                </div>
            </div>

            <div className="row">
                <div className="offset-2 col-lg-8">
                    <h3>상영관등록</h3>
                </div>
            </div>

            <div className="row">
                <div className="offset-2 col-lg-8">
                    <button className="btn btn-secondary">좌석설정</button>
                </div>
            </div>

        </>
    );
}

export default AdminTheater;