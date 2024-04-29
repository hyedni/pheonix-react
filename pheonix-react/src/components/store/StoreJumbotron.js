//스토어의 메뉴바 점보트론
import { CiCirclePlus } from "react-icons/ci";
import '../../design/commons.css';
import '../../design/layout.css';

const StoreJumbotron = (props) =>{

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
                    <nav class="navbar navbar-expand-lg bg-light" data-bs-theme="light">
                        <div class="collapse navbar-collapse" id="navbarColor03">
                            <ul class="navbar-nav me-auto">
                                <li class="nav-item">
                                    <a class="nav-link active" href="/store/package">패키지
                                        <span class="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" href="/store/point">포인트
                                        <span class="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" href="/store/combo">콤보
                                        <span class="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" href="/store/popcorn">팝콘
                                        <span class="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" href="/store/drink">음료
                                        <span class="visually-hidden">(current)</span>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" href="/store/snack">스낵
                                        <span class="visually-hidden">(current)</span>
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
                    <div className="flex-cell">
                        <div className="content-head-text w-25">
                            {props.title}
                        </div>
                        <div className="content-body-text w-50">
                            {props.subTitle}
                        </div>
                        <div>
                            <CiCirclePlus  className="right w-25"/>
                        </div>
                    </div>
                    <hr/>
                </div>
            </div>
        </>
    );
}

export default StoreJumbotron;