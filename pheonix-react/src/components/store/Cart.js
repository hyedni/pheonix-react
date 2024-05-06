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
import { FiMinusCircle } from "react-icons/fi";
import { LuCircleEqual } from "react-icons/lu";
import PruchaseMenu from './PurchaseMenu';

const Cart = () => {

    //state
    //const { userId } = useRecoilState({});
    const [cartItems, setCartItems] = useState([]); //카트+상품 정보
    const [userId] = useState('testuser4');
    const [imagePreview] = useState(null);
    const [itemQty, setItemQty] = useState();
    const [checkedList, setCheckedLists] = useState([]);


    //체크박스
    const onCheckedAll = useCallback((checked) => {
        if (checked) {
            const checkedListArray = [];

            cartItems.forEach((list) => checkedListArray.push(list));

            setCheckedLists(checkedListArray);
        }
        else {
            setCheckedLists([]);
        }
    }, [cartItems]);

    const onCheckedElement = useCallback((checked, list) => {
        if (checked) {
            setCheckedLists([...checkedList, list]);
        }
        else {
            setCheckedLists(checkedList.filter((el) => el !== list));
        }
    }, [checkedList]);

    //effect
    useEffect(() => {
        loadCartData();
    }, []);

    //callback
    const loadCartData = useCallback(() => {
        //회원별 장바구니 정보
        try {
            axios.get(`/cart/combine/${userId}`).then(resp => {
                setCartItems(resp.data);
                setItemQty(resp.data);

            });

        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }

    }, [userId]);

    //수량 변경 버튼을 눌렀을 때, 수정
    const saveEditQty = useCallback(async (target) => {
        try {
            await axios.patch("/cart/", target);
            loadCartData();
        } catch (error) {
            console.error("수량 변경 중 오류 발생:", error);
        }

    }, [cartItems]);

    const changeQty = useCallback((e, target) => {
        const copy = [...cartItems];
        const copy2 = copy.map(cartItem => {
            if (target.cartProductNo === cartItem.cartProductNo) { //이벤트 발생한 상품이라면
                return {
                    ...cartItem,//나머지 정보는 유지
                    [e.target.name]: e.target.value//단, 입력항목만 교체
                };
            }
            else {//다른 학생이라면
                return { ...cartItem };//현상유지
            }
        });
        setCartItems(copy2);
    }, [cartItems]);






    //삭제
    const deleteProduct = useCallback(async (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;
        await axios.delete("/cart/", {
            params: {
                productNo: target.cartProductNo,
                userId: target.cartUserId
            }
        });
        loadCartData();
    }, [cartItems]);

    const deleteBySelected = useCallback(async (targetList) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;
    
        for (const list of targetList) { //forEach 사용 불가.
            await axios.delete("/cart/", {
                //뭔가 for문으로 풀어서.. 하나씩 값을 백으로 넘겨줘야...?? 될 것만 같다. 아닌가?
                //변수 두 개를 넘거야 하는디
                params: {
                    productNo: list.cartProductNo,
                    userId: list.cartUserId
                }
            });
        }
    
        loadCartData();
    }, [checkedList]);
    


    //선택된 상품의 총 상품 금액
    const getProductPriceOfCheckedItems = useMemo(() => {
        let totalPrice = 0;

        checkedList.forEach(list => {
            const price = list.productPrice * list.cartQty || 0; // 만약 가격 정보가 없으면 0으로 간주
            totalPrice += price;
        });
        return totalPrice.toLocaleString();
    }, [checkedList]);
    //선택된 상품의 총 할인 금액
    const getDiscountPriceOfCheckedItems = useMemo(() => {
        let totalDiscountPrice = 0;

        checkedList.forEach(list => {
            const discount = Math.ceil((list.productPrice * list.productDiscount / 100) * list.cartQty) || 0;
            totalDiscountPrice += discount;
        });
        return totalDiscountPrice.toLocaleString();
    }, [checkedList]);
    //선택된 상품의 총 결제 예정 금액
    const getTotalPriceOfCheckedItems = useMemo(() => {
        let totalPrice = 0;

        checkedList.forEach(list => {
            const price = (list.productPrice - Math.ceil((list.productPrice * list.productDiscount / 100))) * list.cartQty || 0;
            totalPrice += price;
        });
        return totalPrice.toLocaleString();
    }, [checkedList]);


    return (
        <>

            <div>
                {/* 장바구니 헤더 출력 */}
                <PruchaseMenu activeStep="1" />

                {/* 장바구니 내용 출력 */}
                {cartItems.length !== 0 ? ( //장바구니에 담긴 물건이 있으면               
                    <>
                        <div className="row justify-content-center">
                            <div className="col-lg-8 content-body">

                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col"><input
                                                type="checkbox"
                                                className="large-checkbox"
                                                onClick={(e) => onCheckedAll(e.target.checked)}
                                                checked={
                                                    checkedList.length === 0 ? false :
                                                        checkedList.length === cartItems.length ? true : false
                                                }
                                            /></th>
                                            <th scope="col" style={{ width: '32%' }}>상품명</th>
                                            <th scope="col" style={{ width: '15%' }}>판매금액</th>
                                            <th scope="col" style={{ width: '10%' }}>수량</th>
                                            <th scope="col" style={{ width: '15%' }}>구매금액</th>
                                            <th scope="col" style={{ width: '20%' }}>선택</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((cartItem) => (
                                            <tr key={cartItem.cartProductNo}>
                                                <td scope="row">
                                                    <input type="checkbox" className="large-checkbox"
                                                        key={cartItem.productNo} onChange={(e) => onCheckedElement(e.target.checked, cartItem)}
                                                        checked={checkedList.includes(cartItem) ? true : false}
                                                    />
                                                </td>
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
                                                        <input type='number' class="qty-value form-control" name='cartQty' value={cartItem.cartQty} onChange={e => { changeQty(e, cartItem) }}></input>

                                                        {/* <div className="qty-buttons">
                                                            <button onClick={() => handleQtyChange(cartItem.cartProductNo, 1)}>+</button>
                                                            <button onClick={() => handleQtyChange(cartItem.cartProductNo, -1)}>-</button>
                                                        </div> */}

                                                        {/* <div>
                                                            <button onClick={()=> saveEditQty(cartItem)}>변경</button>

                                                        </div> */}


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
                                                            <button className="delete-button btn btn-light" onClick={e => deleteProduct(cartItem)}>삭제</button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className='row'>
                                    <div className="col-6">
                                        <button className="btn btn-light"
                                            onClick={e=> deleteBySelected(checkedList)}
                                        >선택상품 삭제({checkedList.length})</button>
                                    </div>
                                    <div className="col-6">
                                        <p className='text-end'>장바구니에 담긴 상품은 최대 30일까지 보관됩니다.</p>
                                    </div>
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
                                    <div className='col-4 section-design2'>
                                        {getProductPriceOfCheckedItems}원
                                    </div>
                                    <div className='col-4 section-design2-icon'>
                                        <div className='mt-2'>
                                            <FiMinusCircle />
                                        </div>
                                        <div className="section-design2-mid">
                                            {getDiscountPriceOfCheckedItems}원
                                        </div>
                                        <div className='mt-2'>
                                            <LuCircleEqual />
                                        </div>
                                    </div>

                                    <div className='col-4 section-design2'>
                                        {getTotalPriceOfCheckedItems}원
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
                            <Link to="/store/package" className='btn btn-dark w-100 '>스토어 가기</Link>
                        </div>
                    </div>

                }

            </div>
        </>
    );
};

export default Cart;