import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import axios from "../../utils/CustomAxios";
import StoreMenu from "../StoreMenu";
import Notification from "./Notification";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';

//디자인 임포트
import './Store.css';

//아이콘 임포트
import { FaShoppingCart } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import { Modal } from "bootstrap";

//이미지 임포트
import nutritionFacts from "../image/bg_nutritionFacts.png";

 ///////////////////////////////////////////////////////////////////////////////////////
//로그인 작동하면 주석 풀기
//import { loginIdState } from "../../utils/RecoilData";


const StoreDetailList = () => {

    //state
    const { productNo } = useParams(); //파라미터에서 번호 추출
    const [products, setProducts] = useState({});
    //회원 아이디
    //const { userId } = useRecoilState(loginIdState);
    //상품 수량 정보
    const [itemQty, setItemQty] = useState(1);
    //장바구니 담기

    // 방법1 - useEffect
    // const [addCart, setAddCart] = useState({
    //     cartUserId :  "testuser4",//userId,
    //     cartProductNo : productNo,
    //     cartQty : itemQty
    // });
    // useEffect(()=>{
    //     setAddCart({
    //         ...addCart, cartQty:itemQty
    //     });
    // }, [itemQty]);

    // 방법2 - useMemo
    const addCart = useMemo(()=>{
        return {
                cartUserId :  "testuser4",//userId,
                cartProductNo : productNo,
                cartQty : itemQty
        }
    }, [itemQty]);


    useEffect(() => {
        loadData();
    }, [productNo]);

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get("/product/detail/" + productNo);
            setProducts(resp.data);
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [productNo]);

    //장바구니 담기
    const AddItemToCart = useCallback((e)=>{

        ///////////////////////////////////////////////////////////////////////////////////////
        //로그인 작동하면 주석 풀기
        // if(loginIdState === null) {
        //     const choice = window.confirm("로그인 상태가 아닙니다. \n로그인 페이지로 이동하시겠습니까?");
        //     if (choice === true) {
        //         return navigate('/login'); //로그인 페이지로 리다이렉트
        //     }
        // }
        // else {
        //     const choice = window.confirm("장바구니에 상품이 담겼습니다. \n장바구니로 이동하시겠습니까?");
        //     if(choice === true) {
        //         return navigate('/cart');
        //     }
        // }


        // console.log(addCart);
        axios({
            url: "/cart/add/",
            method: "post",
            data: addCart
        })
    }, [addCart]);

    //ref
    //사용가능한 피닉스
    const placeInfoModal = useRef();
    const openPlaceInfoModal = useCallback(() => {
        const modal = new Modal(placeInfoModal.current);
        modal.show();
    }, [placeInfoModal]);

    //영양성분 모달
    const nutritionModal = useRef();
    const openNutritionModal = useCallback(()=>{
        const modal = new Modal(nutritionModal.current);
        modal.show();
    }, [nutritionModal]);


    return (
        <>
            <StoreMenu />

            {/* 제품명 */}
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <span style={{ fontSize: '25px' }} className='ms-2'>{products.productName}</span>
                    <hr></hr>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="row">
                        <div className="col-4">
                            이미지
                        </div>
                        <div className="col-8">
                            <div>
                                <div className="row">
                                    <div className="col-2">
                                        {/* 할인가 표시 */}
                                        {Math.ceil(products.productPrice - (products.productPrice * products.productDiscount / 100))}원</div>
                                    <div className="col-10" style={{ textDecoration: 'line-through' }}>{products.productPrice}원</div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-3">상품 구성</div>
                                    <div className="col-9">{products.productContent}</div>
                                </div>
                                <div className="row">
                                    <div className="col-3">유효 기간</div>
                                    <div className="col-9">
                                        피닉스 영화관람권 : 구매일로부터 24개월 이내 <br />
                                        {products.productName} : 구매일로부터 6개월 이내
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">원산지</div>
                                    <div className="col-9">{products.productOrigin}</div>
                                </div>
                                <div className="row">
                                    <div className="col-3">상품교환</div>
                                    <div className="col-6">
                                        <button className="btn btn-link red" style={{ margin: '0', padding: '0' }} onClick={e => openPlaceInfoModal()}>
                                            사용가능한 Phoenix
                                        </button>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-dark btn-sm float-end" onClick={e => openNutritionModal()}>
                                            영양성분
                                        </button>
                                    </div>
                                </div>
                                <hr></hr>

                                {/* 수량 및 총금액 출력 위치 */}
                                <div className="row">
                                    <div className="col mb-4">
                                        <div className="quantity-container">
                                            <button className="quantity-button" onClick={(e) => itemQty > 1 && setItemQty(itemQty - 1)}><LuMinus size={28} /></button>
                                            <span className="quantity-span">{itemQty}</span>
                                            <button className="quantity-button" onClick={(e) => itemQty < 101 && setItemQty(itemQty + 1)}><GoPlus size={28} /></button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="total-design-right">
                                        <span>총 구매금액 &nbsp;&nbsp;</span>
                                        {(itemQty * Math.ceil(products.productPrice - (products.productPrice * products.productDiscount / 100))).toLocaleString()}
                                    </div>
                                </div>


                                <div className="row mt-4">
                                    <div className="col-3">
                                        <Link to={`/cart`} className='btn btn-primary w-100' onClick={e=>(AddItemToCart())}><FaShoppingCart /></Link>
                                    </div>
                                    <div className="col-3">
                                        <Link to={`/gift/${products.productNo}`} className='btn btn-dark w-100'>선물하기</Link>
                                    </div>
                                    <div className="col-6">
                                        <Link to={`/purchase/${products.productNo}`} className='btn btn-dark w-100'>구매하기</Link>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Notification />

            {/* 상품교환 모달 */}
            <div ref={placeInfoModal} class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white" >
                            <h1 class="modal-title fs-5 total-design-right" id="exampleModalLabel">사용가능한 Phoenix</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                        </div>
                        <div class="modal-body">
                            <p>해당 상품을 사용할 수 있는 Phoenix입니다.</p>
                            <div class="row mt-4">
                                <div class="col-md-4">
                                    <h5 class="fw-bold">서울(30)</h5>
                                </div>
                                <div class="col-md-8">
                                    <ul class="list-unstyled">
                                        <li>CGV강남</li>
                                        <li>CGV강변</li>
                                        <li>CGV건대입구</li>
                                        <li>CGV구로</li>
                                        <li>CGV대학로</li>
                                        <li>CGV동대문</li>
                                        <li>CGV등촌</li>
                                        <li>CGV명동</li>
                                        <li>CGV명동역 씨네라이브러리</li>
                                        <li>CGV미아</li>
                                        <li>CGV방학</li>
                                        <li>CGV본사</li>
                                        <li>CGV불광</li>
                                        <li>CGV상봉</li>
                                        <li>CGV성신여대입구</li>
                                        <li>CGV송파</li>
                                        <li>CGV수유</li>
                                        <li>CGV신촌아트레온</li>
                                        <li>CGV압구정</li>
                                        <li>CGV여의도</li>
                                        <li>CGV연남</li>
                                        <li>CGV영등포</li>
                                        <li>CGV왕십리</li>
                                        <li>CGV용산아이파크몰</li>
                                        <li>CGV중계</li>
                                        <li>CGV천호</li>
                                        <li>CGV청담씨네시티</li>
                                        <li>CGV피카디리1958</li>
                                        <li>CGV하계</li>
                                        <li>CGV홍대</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*  영양 성분 모달 */}
            <div ref={nutritionModal} class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header bg-dark text-white" >
                            <h1 class="modal-title fs-5 total-design-right" id="exampleModalLabel">영양성분표시 안내</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                        </div>
                        <div class="modal-body">
                            <img  src={nutritionFacts} alt="영양 성분 이미지" style={{ width: '100%' }}></img> 
                            {/* <img  src={`${process.env.PUBLIC_PATH}/image/bg_nutritionFacts.png`} alt="영양 성분 이미지"></img>  */}
                        </div>
                    </div>
                </div>
            </div>



        </>
    );
};

export default StoreDetailList;