//스토어의 타이틀바 점보트론
import '../../design/commons.css';
import '../../design/layout.css';
import { NavLink } from "react-router-dom";
import "./Cart.css";
//아이콘 임포트
import { FaShoppingCart } from "react-icons/fa"; // Import the cart icon
import { MdPayment } from "react-icons/md";
import { IoBagHandle,  IoReceipt } from 'react-icons/io5';
import { IoIosArrowForward } from "react-icons/io";

const PruchaseMenu = (props) => {
    // activeStep에 따라서 현재 단계를 설정합니다.
    const activeStep = props.activeStep || "1";

    return (
        <>
            <br />
            <br />
            {/* 결제 진행과정 바 */}
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <ul className="purchase-menu">
                        <li className={activeStep === "1" ? "activeColor ms-4" : "ms-4"}>
                            <div className='row'>
                                <div className='col-3'>
                                    <FaShoppingCart className="icon" />
                                </div>
                                <div className='col-9'>
                                    <span>STEP 01</span><br></br>
                                    <strong>장바구니</strong>
                                </div>
                            </div>
                        </li>
                        <li>
                            <IoIosArrowForward className='icon' />
                        </li>
                        <li className={activeStep === "3" ? "activeColor" : ""}>
                            <div className='row'>
                                <div className='col-3'>
                                    <MdPayment className="icon" />
                                </div>
                                <div className='col-9'>
                                    <span>STEP 02</span><br />
                                    <strong>결제하기</strong>
                                </div>
                            </div>
                        </li>
                        <li>
                            <IoIosArrowForward className='icon' />
                        </li>
                        <li className={activeStep === "4" ? "activeColor me-4" : "me-4"}>
                            <div className='row'>
                                <div className='col-3'>
                                    <IoReceipt className="icon" />
                                </div>
                                <div className='col-9'>
                                    <span>STEP 03</span><br />
                                    <strong>결제완료</strong>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default PruchaseMenu;