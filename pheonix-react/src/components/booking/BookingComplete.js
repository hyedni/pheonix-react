

function BookingComplete(){

    return(
        <div className="container mt-5">
        <div className="card text-center">
            <div className="card-header">
                예매 성공
            </div>
            <div className="card-body">
                <h1 className="card-title">예매 완료</h1>
                <p className="card-text">영화 예매가 성공적으로 완료되었습니다.</p>
                <button className="btn btn-success" onClick={() => window.location.href = '/'}>홈으로 돌아가기</button>
            </div>
            <div className="card-footer text-muted">
                영화 관람을 기대해주세요!
            </div>
        </div>
    </div>
    );
}

export default BookingComplete;