import './Cart.css';
import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
//import { useRecoilState } from 'recoil';

//아이콘 임포트
import { FaShoppingCart } from "react-icons/fa";
import { FaGift } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import countState from './../utils/RecoilData';
import { FaCheck } from "react-icons/fa";

const Cart = () => {

    //state
    //const { userId } = useRecoilState({});
    const [cartItems, setCartItems] = useState([]);
    const [userId] = useState('testuser4');
    const [imagePreview] = useState(null);
    const [itemQty, setItemQty] = useState();
    const [cartChangeItem, setCartChangeItem] = useState([]);

    //effect
    useEffect(() => {
        loadCartData();
    }, []);

    //useMemo 
    // const changeQty = useMemo(()=>{
    //     // setCartItem({
    //     //     ...cartItem, //원래 있던 값 유지
    //     //     [e.target.name] : [e.target.value] //여기선 수량 값만 바꾸기. 
    //     // });
    //     return {
    //         ...cartItems, 
    //         cartQty : itemQtys //변경된 값만 보여주기
    //     }
    // }, [itemQtys]);//수량이 바뀔 때 탁! 타ㅏ닥

    //callback
    const loadCartData = useCallback(() => {
        //회원별 장바구니 정보
        try {
            axios.get(`/cart/combine/${userId}`).then(resp => {
                setCartItems(resp.data);
            });
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }

    }, [userId]);

    //수량 변경 버튼을 눌렀을 때, 수정
    const saveEditQty = useCallback(async (target) => {
        try {
            // setCartChangeItem({
            //     ...cartItem,
            //     addCart
            // });

            await axios.patch("/cart/", target);
            loadCartData();
        } catch (error) {
            console.error("수량 변경 중 오류 발생:", error);
        }

    }, [cartItems]);


    const [selectedItems, setSelectedItems] = useState([]);

    //체크박스
    // const handleCheckboxChange = (event) => {
    //     const value = event.target.value;
    //     const isChecked = event.target.checked;

    //     if (isChecked) {
    //         setSelectedItems([...selectedItems, value]);
    //     } else {
    //         setSelectedItems(selectedItems.filter(item => item !== value));
    //     }
    // };

    return (
        <>

            <div>
                {/* 장바구니 출력 */}
                <div className="row justify-content-center">
                    <div className="col-lg-8 content-body">
                        <h2><FaShoppingCart /> 장바구니 </h2>
                    </div>
                </div>
                {cartItems.length !== 0 ? ( //장바구니에 담긴 물건이 있으면               
                    <>
                        <div className="row justify-content-center">
                            <div className="col-lg-8 content-body">

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"><input type="checkbox" className="large-checkbox" /></th>
                                            <th scope="col" style={{ width: '32%' }}>상품명</th>
                                            <th scope="col" style={{ width: '15%' }}>판매금액</th>
                                            <th scope="col" style={{ width: '10%' }}>수량</th>
                                            <th scope="col" style={{ width: '15%' }}>구매금액</th>
                                            <th scope="col" style={{ width: '20%' }}>선택</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((cartItem) => (
                                            <tr key={cartItems.cartProductNo}>
                                                <td scope="row"><input type="checkbox" className="large-checkbox" /></td>
                                                <td>
                                                    <div className="product-info">
                                                        <div className="img-preview img-thumbnail">
                                                            <img src={imagePreview || cartItem.productImgLink} alt="상품이미지" style={{ width: "90px", height: "90px" }} />
                                                        </div>
                                                        <div className="product-info-text">
                                                            {cartItem.productName}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="font-large">{(Math.ceil(cartItem.productPrice - (cartItem.productPrice * cartItem.productDiscount / 100))).toLocaleString()}원</span> <br />
                                                    <span className="original-price">{(cartItem.productPrice).toLocaleString()} 원</span>
                                                </td>
                                                <td>

                                                    <div class="custom-qty-container">
                                                        <span class="qty-value">{cartItem.cartQty}</span>

                                                        <div className="qty-buttons">
                                                            <button className="qty-button" onClick={() => saveEditQty({ ...cartItem, cartQty: (cartItem.cartQty + 1) })}><GoPlus /></button>
                                                            <button className="qty-button" onClick={() => saveEditQty({ ...cartItem, cartQty: (cartItem.cartQty - 1) })}><LuMinus /></button>
                                                        </div>

                                                    </div>

                                                </td>
                                                <td className="font-large">{(Math.ceil((cartItem.productPrice - (cartItem.productPrice * cartItem.productDiscount / 100)) * cartItem.cartQty)).toLocaleString()}원</td>
                                                <td>
                                                    <div className="action-buttons-container">
                                                        <div className="edit-buttons">
                                                            <Link to={`/gift/${cartItem.productNo}`} className='edit-button btn btn-outline-dark'><FaGift />선물하기</Link>
                                                            <Link to={`/purchase/${cartItem.productNo}`} className='edit-button btn btn-outline-dark mt-2'><IoBagHandle />구매하기</Link>
                                                        </div>
                                                        <div className="delete-button-container">
                                                            <button className="delete-button btn btn-light">삭제</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                        </div>


                        <div className="row justify-content-center">
                            <div className="col-lg-8 content-body">
                                <div className="delete-button-container">
                                    <button className="delete-button btn btn-light">선택상품 삭제()</button>
                                </div>
                                <div>
                                    <p className='text-right'>장바구니에 담긴 상품은 최대 30일까지 보관됩니다.</p>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-lg-8 content-body outline-design">
                                <div className='row  botton-line header-line'>
                                    <div className='col-4 section-design'>
                                        총 상품 금액
                                    </div>
                                    <div className='col-4 section-design'>
                                        할인금액
                                    </div>
                                    <div className='col-4 section-design-last'>
                                        총 결제 예정금액
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-4 section-design'>
                                        총 상품 금액
                                    </div>
                                    <div className='col-4 section-design'>
                                        할인금액
                                    </div>
                                    <div className='col-4 section-design-last'>
                                        총 결제 예정금액
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="row justify-content-center">
                            <div className="col-lg-8 content-body">
                                <div className='row'>
                                    <div className="col-6">
                                        <Link to={`/gift/`} className='btn btn-dark w-100 btn-lg'>선물하기</Link>
                                    </div>
                                    <div className="col-6">
                                        <Link to={`/purchase/`} className='btn btn-dark w-100 btn-lg'>구매하기</Link>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </>

                ) : //장바구니에 아이템이 없을 때

                    <div className="row justify-content-center">
                        <div className="col-lg-8 content-body">
                            <h1>아이템이 없습니다</h1>
                            <Link to="{`/cart/`}" className='btn btn-dark w-100 '>스토어 가기</Link>
                        </div>
                    </div>

                }

            </div>
        </>
    );
};

export default Cart;