//스토어의 타이틀바 점보트론
import '../../design/commons.css';
import '../../design/layout.css';

const StoreJumbotron = (props) => {

    return (
        <>
            {/* 페이지 주요 내용 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  content-head d-flex justify-content-between align-items-center">
                    <div>
                        <div className="content-head-text me-2">
                            {props.title}
                        </div>
                        <div className="content-body-text mt-2">
                            {props.subTitle}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StoreJumbotron;