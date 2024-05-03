import './Cart.css';
import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
//import { useRecoilState } from 'recoil';

//아이콘 임포트
import { FaShoppingCart } from "react-icons/fa";
import { FaGift } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import countState from './../utils/RecoilData';

const Cart = () => {

    //state
    //const { userId } = useRecoilState({});
    const [cartItem, setCartItem] = useState([]);
    const [userId] = useState('testuser4');
    const [imagePreview] = useState(null);

    //effect
    useEffect(() => {
        loadCartData();
    }, []);

    //callback
    const loadCartData = useCallback(() => {
        //회원별 장바구니 정보
        try {
            axios.get(`/cart/combine/${userId}`).then(resp => {
                console.log(resp.data);
                setCartItem(resp.data);
            });
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }

    }, [userId]);

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
                {/* {cartItem.length !== 0 ? cartItem.map((e) =>( */}
                {/* // <CartItem data={e} key={e.id} /> */}

                {/* )) : <h1>아이템이 없습니다</h1>} */}


                {/* 장바구니 출력 */}


                <div className="row justify-content-center">
                    <div className="col-lg-8 content-body">
                        <h2><FaShoppingCart /> 장바구니 </h2>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8 content-body">

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col"><input type="checkbox" className="large-checkbox" /></th>
                                    <th scope="col" style={{width : '32%'}}>상품명</th>
                                    <th scope="col" style={{width : '15%'}}>판매금액</th>
                                    <th scope="col" style={{width : '10%'}}>수량</th>
                                    <th scope="col" style={{width : '15%'}}>구매금액</th>
                                    <th scope="col" style={{width : '20%'}}>선택</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItem.map(cartItem => (
                                    <tr key={cartItem.cartProductNo}>
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
                                            {/* <button className="quantity-button" onClick={(e) => itemQty > 1 && setItemQty(itemQty - 1)}><LuMinus size={28} /></button> */}

                                            <div class="custom-qty-container">
                                                <span class="qty-value">{cartItem.cartQty}</span>
                                                <div class="qty-buttons">
                                                    <button class="qty-button"><GoPlus  /></button>
                                                    <button class="qty-button"><LuMinus  /></button>
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












            </div>
        </>
    );
};

export default Cart;