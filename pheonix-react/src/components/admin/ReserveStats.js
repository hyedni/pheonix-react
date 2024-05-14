import './RserveStats.css';

function ReserveStats() {
    return (
        <>

            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        예매율
                    </div>
                    <hr />
                    <div>
                        <ul className='detail-wrapper'>
                            <li>[예매율]은 매일 00시에 예매데이터를 집계하여 예매율 정보를 제공합니다.</li>
                            <li>예매율 산출기준 = A(예매관객수) / B(전체 예매관객수) * 100</li>
                            <li>예매관객수(A) : 매일 00시 기준 특정영화의 예매 건수</li>
                            <li>전체 예매관객수(B) : 매일 00시 기준 모든 영화의 예매 건수</li>
                            <li>즉, 현재 조회되는 예매율은 24시간 동안 유효하며 24시간 동안 변동되지 않습니다.</li>
                            <li>예매율은 현재 상영중인 영화에만 적용됩니다.</li>
                        </ul>
                    </div>
                </div>
            </div>


            


        </>
    );
}

export default ReserveStats;