import { useCallback, useEffect, useState, } from "react";
import axios from "../../utils/CustomAxios";
import StoreMenu from "../StoreMenu";
import Notification from "./Notification";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';

//디자인 임포트
import './Store.css';

import { useRecoilState } from "recoil";
import { itemQtyState } from "../../../recoil/StoreRecoil";
//아이콘 임포트
import { FaShoppingCart } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";


const StoreDetailList = () => {

    //state
    const { productNo } = useParams(); //파라미터에서 번호 추출
    const [products, setProducts] = useState({});

    const [itemQty, setItemQty] = useRecoilState(itemQtyState);

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

    //수량 계산


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
                                        {Math.ceil(products.productPrice - (products.productPrice * products.productDiscount/100))}원</div>
                                    <div className="col-10" style={{textDecoration: 'line-through'}}>{products.productPrice}원</div>
                                </div>
                                <hr></hr>
                                <div className="row">
                                    <div className="col-3">상품 구성</div>
                                    <div className="col-9">{products.productContent}</div>
                                </div>
                                <div className="row">
                                    <div className="col-3">유효 기간</div>
                                    <div className="col-9">
                                        CGV 영화관람권 : 구매일로부터 24개월 이내 <br />
                                        더블콤보 : 구매일로부터 6개월 이내
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-3">원산지</div>
                                    <div className="col-9">{products.productOrigin}</div>
                                </div>
                                <div className="row">
                                    <div className="col-3">상품교환</div>
                                    <div className="col-6">!!!!!!!!모달 자리 !!!!!!!!!!!!</div>
                                    <div className="col-3">
                                        영양성분 모달
                                    </div>
                                </div>
                                <hr></hr>

                                {/* 수량 및 총금액 출력 위치 */}
                                <div className="row">
                                    <div className="col-9 mb-4">
                                        <div className="quantity-container">
                                            <button className="quantity-button" onClick={(e) => itemQty > 1 && setItemQty(itemQty - 1)}><LuMinus size={28} /></button>
                                            <span className="quantity-span">{itemQty}</span>
                                            <button className="quantity-button" onClick={(e)=> itemQty < 101 && setItemQty(itemQty+1)}><GoPlus size={28}/></button>
                                        </div>
                                    </div>
                                    <div className="col-3">{itemQty * Math.ceil(products.productPrice - (products.productPrice * products.productDiscount/100))}</div>
                                </div>


                                <div className="row">
                                    <div className="col-3">
                                        <Link to={`/cart`} className='btn btn-primary w-100'><FaShoppingCart /></Link>
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
        </>
    );
};

export default StoreDetailList;