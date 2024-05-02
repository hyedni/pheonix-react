import './AdminCinema.css';

function AdminCinema() {
    return (
        <>

            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        영화관 관리
                    </div>
                </div>
            </div>
            <hr/>

            <div className="row">
                <div className="offset-2 col-lg-8">
                    {/* 지역리스트 */}
                    <div>
                        <ul className="region-ul">
                            <li className="region-li">
                                서울
                                <div>
                                    <ul className="inner-ul">
                                        <li>pnix강남점</li>
                                        <li>pnix강남점</li>
                                        <li>pnix강남점</li>
                                        <li>pnix강남점</li>
                                        <li>pnix강남점</li>
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>


        </>
    );
}

export default AdminCinema;