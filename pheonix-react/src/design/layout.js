import './layout.css';

const layout = () => {

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        페이지 제목
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
                                    <a className="nav-link active" href="#">메뉴1
                                        <span className="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" href="#">메뉴2
                                        <span className="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" href="#">메뉴3
                                        <span className="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" href="#">메뉴4
                                        <span className="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" href="#">메뉴5
                                        <span className="visually-hidden">(current)</span>
                                    </a>
                                </li>
                            </ul>

                        </div>
                    </nav>
                </div>
            </div>


            {/* 페이지 주요 내용 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  content-head">
                    <div className="content-head-text">
                        페이지 제목
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="content-body-text">
                        페이지 내용
                    </div>
                </div>
            </div>
        </>
    );
};

export default layout;