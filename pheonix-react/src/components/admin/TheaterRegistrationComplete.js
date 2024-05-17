

function TheaterRegistrationComplete(){

    return (
        <div className="container mt-5">
        <div className="card text-center">
            <div className="card-header">
                등록 완료
            </div>
            <div className="card-body">
                <h1 className="card-title">상영관 등록 완료</h1>
                <p className="card-text">상영관 등록이 성공적으로 완료되었습니다.</p>
                <button className="btn btn-primary" onClick={() => window.location.href = '/'}>홈으로</button>
            </div>
            <div className="card-footer text-muted">
                감사합니다
            </div>
        </div>
    </div>
    )
}

export default TheaterRegistrationComplete;