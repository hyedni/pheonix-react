//스토어의 메뉴바 점보트론
import { CiCirclePlus } from "react-icons/ci";
import '../../design/commons.css';
import '../../design/layout.css';

const StoreJumbotron = (props) => {

    return (
        <>
            {/* 페이지 주요 내용 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  content-head">
                    <div className="flex-cell">
                        <div className="content-head-text me-2">
                            {props.title}
                        </div>
                        <div className="content-body-text mt-2">
                            {props.subTitle}
                        </div>
                        <div className="content-body-text ">
                            <CiCirclePlus />
                        </div>
                    </div>
                    <hr />
                </div>
            </div>
        </>
    );
}

export default StoreJumbotron;