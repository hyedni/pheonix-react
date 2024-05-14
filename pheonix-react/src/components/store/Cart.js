import './Cart.css';
import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { partnerOrderId, partnerUserId, tid, vo, loginIdState, btnPurchase } from './../utils/RecoilData';

//아이콘 임포트
import { FaGift } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";
import { FiMinusCircle } from "react-icons/fi";
import { LuCircleEqual } from "react-icons/lu";
import { FaArrowAltCircleLeft } from "react-icons/fa";

//이미지 임포트
import kakaopay from "./image/kakaopay.png";

import PurchaseMenu from './PurchaseMenu';


const Cart = () => {

    //state
    //이용약관 체크박스
    const [termsOfUseAllChecked, setTermsOfUserAllChecked] = useState(false); //전체동의
    const [paymentTermsChecked, setPaymentTermsChecked] = useState(false); //결제 대행 서비스 약관 모두 동의
    const [financialTermsChecked, setFinancialTermsChecked] = useState(false); //전자 금융거래 약관
    const [personalInfoTermsChecked, setPersonalInfoTermsChecked] = useState(false); //개인정보 수집 이용약관
    const [infoSharingTermsChecked, setInfoSharingTermsChecked] = useState(false); // 개인정보 제공 및 위탁
    const [giftConChecked, setGiftConChecked] = useState(false); //기프티콘 구매 동의

    const [ userId ] = useRecoilState(loginIdState);
    const [cartItems, setCartItems] = useState([]); //카트+상품 정보
    // const [userId] = useState('testuser4');
    const [imagePreview] = useState(null);
    const [checkedList, setCheckedLists] = useState([]);

    const [btnPurchase, setBtnPurchase] = useState(false);
    //const [btnPurchase, setBtnPurchase] = useRecoilState(btnPurchase);


    const [cartPartnerOrderId, setCartPartnerOrderId] = useRecoilState(partnerOrderId);
    const [cartPartnerUserId, setCartPartnerUserId] = useRecoilState(partnerUserId);
    const [cartTid, setCartTid] = useRecoilState(tid);
    const [cartVo, setCartVo] = useRecoilState(vo);

    const navigate = useNavigate();

    const [purchaseList, setPurchaseList] = useState({
        no: "",
        qty: ""
    });

    //장바구니 기능들....
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
        console.log(checkedList);
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
        if (btnPurchase) {
            checkedList();
        }
        else {
            loadCartData();
            getUserInfo();
        }
    }, []);


    useEffect(() => { //최초 실행 시 전체 선택
        const checkedListArray = [];
        cartItems.forEach((list) => checkedListArray.push(list));
        setCheckedLists(checkedListArray);
    }, [cartItems]);

    useEffect(() => {
        const newPurchaseList = checkedList.map(item => ({
          no: item.cartProductNo,
          qty: item.cartQty
        }));
        setPurchaseList(newPurchaseList);
      }, [checkedList]);


    //결제
    //결제 버튼 클릭시
    const isValidToPay = useCallback(() => {
        if (termsOfUseAllChecked) { //약관 동의 시
            purchase(); //구매 비동기 함수... 
        }
        else { //약관 미동의 시
            window.alert("결제대행서비스 약관에 모두 동의하셔야 결제가 가능합니다");
        }
    }, [termsOfUseAllChecked]);

    const purchase = useCallback(async () => {
        const resp = await axios.post("/purchase/", purchaseList);
        //useState에 필요한 데이터 저장
        setCartPartnerOrderId(resp.data.partnerOrderId);
        setCartPartnerUserId(resp.data.partnerUserId);
        setCartTid(resp.data.tid);
        setCartVo(resp.data.vo);
        //새 창을 열고 결제 프로세스 시작
        window.open(resp.data.nextRedirectPcUrl, "_blank", "width=400px, height=800px");        
    });

    const purchaseApprove = useCallback(async (pgToken)=> {
        //console.log("결제 성공");
        const postData = {
            cartPartnerOrderId,
            cartPartnerUserId,
            cartTid,
            pgToken,
            purchaseList
        };
        try {
            const resp = await axios.post("/purchase/success", postData);
            // Assuming these are state-setting functions
            setCartPartnerOrderId("");
            setCartPartnerUserId("");
            setCartTid("");
            setCartVo(""); 
            navigate('/purchase/success-complete');
        } catch (error) {
            console.error("Error processing purchase:", error);
        }
       
    });

    useEffect(()=> {
        const handleMessage = (e)=> {
            if(e.data.type && e.data.type === 'successComplete') {
                purchaseApprove(e.data.pgToken);
            }
        };
        window.addEventListener('message', handleMessage);
        return ()=> {
            window.removeEventListener('message', handleMessage);
        }
    }, [purchaseApprove]);

   

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
            await axios.patch("/cart/combine", target);
            loadCartData();
        } catch (error) {
            console.error("수량 변경 중 오류 발생:", error);
        }

    }, [cartItems]);

    const changeQty = useCallback(async (e, target) => {
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
        //saveEditQty(target);
    }, [cartItems]);

    //변경 버튼을 없애고 싶다면.. 생각해야하는 부분 
    // useEffect(()=>{
    //     //cartItems에 변경이 생기면 cartItems 전체를 DB로 전송해서 갱신
    //     //발생빈도를 줄이고 싶다면 lodash의 debounce를 적극적으로 사용할 것!

    // }, [cartItems]);

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


    //회원 정보 가져오기
    const [userInfo, setUserInfo] = useState([]);

    const getUserInfo = useCallback(async () => {
        await axios.get(`/cart/user/${userId}`).then(resp => {
            console.log(resp.data);
            setUserInfo(resp.data);
        });
    }, [userId]);

    //이용약관 체크박스
    const handleAllCheck = () => { //체크박스 전체 선택
        setTermsOfUserAllChecked(!termsOfUseAllChecked);
        setGiftConChecked(!giftConChecked);
        setPaymentTermsChecked(!paymentTermsChecked);
        setFinancialTermsChecked(!financialTermsChecked);
        setPersonalInfoTermsChecked(!personalInfoTermsChecked);
        setInfoSharingTermsChecked(!infoSharingTermsChecked);
    };

    const handleSingleCheck = (target) => { //체크박스 단일 선택에 대한 조건식..
        switch (target) {
            case 'paymentTerms':
                setPaymentTermsChecked(!paymentTermsChecked);
                setFinancialTermsChecked(!financialTermsChecked);
                setPersonalInfoTermsChecked(!personalInfoTermsChecked);
                setInfoSharingTermsChecked(!infoSharingTermsChecked);
                if (giftConChecked) setTermsOfUserAllChecked(true);
                break;
            case 'financialTerms':
                setFinancialTermsChecked(!financialTermsChecked);
                break;
            case 'personalInfoTerms':
                setPersonalInfoTermsChecked(!personalInfoTermsChecked);
                break;
            case 'infoSharingTerms':
                setInfoSharingTermsChecked(!infoSharingTermsChecked);
                break;
            case 'giftCon':
                setGiftConChecked(!giftConChecked);
                if (paymentTermsChecked) setTermsOfUserAllChecked(true);
                break;
            default:
                break;
        }
    };

    return (
        <>

            <div>

                {cartItems.length !== 0 ? ( //장바구니DB가 있으면 
                    btnPurchase === false ? ( //장바구니 내역 출력
                        <>
                            {/* 장바구니 헤더 출력 */}
                            <PurchaseMenu activeStep="1" />
                            <div className="row justify-content-center">
                                <div className="col-lg-8 content-body">

                                    <table className="table">
                                        <thead>
                                            <tr className='text-center'>
                                                <th scope="col"><input
                                                    type="checkbox"
                                                    className="large-checkbox"
                                                    onClick={(e) => onCheckedAll(e.target.checked)}
                                                    checked={
                                                        checkedList.length === 0 ? false :
                                                            checkedList.length === cartItems.length ? true : false
                                                    }
                                                /></th>
                                                <th scope="col" style={{ width: '30%' }}>상품명</th>
                                                <th scope="col" style={{ width: '17%' }}>판매금액</th>
                                                <th scope="col" style={{ width: '17%' }}>수량</th>
                                                <th scope="col" style={{ width: '13%' }}>구매금액</th>
                                                <th scope="col" style={{ width: '15%' }}>선택</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartItems.map((cartItem) => (
                                                <tr key={cartItem.cartProductNo} className='text-center'>
                                                    <td scope="row">
                                                        <input type="checkbox" className="large-checkbox"
                                                            key={cartItem.productNo} onChange={(e) => onCheckedElement(e.target.checked, cartItem)}
                                                            checked={checkedList.includes(cartItem) ? true : false}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="product-info">
                                                            <Link to={`/productDetail/${cartItem.productNo}`} className="text-dark text-decoration-none">
                                                                <div className="img-preview img-thumbnail">
                                                                    <img src={imagePreview || cartItem.productImgLink} alt="상품이미지" style={{ width: "90px", height: "90px" }} />
                                                                </div>
                                                                <div className="product-info-text">
                                                                    {cartItem.productName}
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="font-large">{(Math.ceil(cartItem.productPrice - (cartItem.productPrice * cartItem.productDiscount / 100))).toLocaleString()}원</span> <br />
                                                        <span className="original-price">{(cartItem.productPrice).toLocaleString()} 원</span>
                                                    </td>
                                                    <td>

                                                        <div className="custom-qty-container">
                                                            <input type='number' className="qty-value form-control" name='cartQty' value={cartItem.cartQty} onChange={e => { changeQty(e, cartItem) }} min={1} ></input>
                                                            <button className='qty-buttons btn btn-light' onClick={() => saveEditQty(cartItem)}>변경</button>
                                                        </div>

                                                    </td>
                                                    <td className="font-large">{(Math.ceil((cartItem.productPrice - (cartItem.productPrice * cartItem.productDiscount / 100)) * cartItem.cartQty)).toLocaleString()}원</td>
                                                    <td>
                                                        <div className="action-buttons-container">
                                                            <div className="edit-buttons">
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
                                                onClick={e => deleteBySelected(checkedList)}
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
                                            {/* <Link to={`/purchase/`} className='btn btn-dark w-100 btn-lg'>구매하기</Link> */}
                                            <button className='btn btn-dark w-100 btn-lg' onClick={() => setBtnPurchase(true)}>구매하기</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : ( //구매하기 출력
                        <>
                            <PurchaseMenu activeStep="3" />

                            {/* 구매할 정보 출력 */}
                            <div className="row justify-content-center">
                                <div className="col-lg-8 content-body">

                                    <h3 className="custom-heading mt-4 mb-4">구매상품 정보</h3>

                                    <table className="table" style={{ borderTop: '4px solid #000' }}>
                                        <thead>
                                            <tr className='text-center'>
                                                <th scope="col" style={{ width: '40%' }}>상품명</th>
                                                <th scope="col" style={{ width: '20%' }}>판매금액</th>
                                                <th scope="col" style={{ width: '20%' }}>수량</th>
                                                <th scope="col" style={{ width: '20%' }}>구매금액</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {checkedList.map((checkedItem) => (
                                                <tr key={checkedItem.cartProductNo} className='text-center'>
                                                    <td>
                                                        <div className="product-info">
                                                            <div className="img-preview img-thumbnail">
                                                                <img src={imagePreview || checkedItem.productImgLink} alt="상품이미지" style={{ width: "90px", height: "90px" }} />
                                                            </div>
                                                            <div className="product-info-text">
                                                                {checkedItem.productName}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="font-large">{(Math.ceil(checkedItem.productPrice - (checkedItem.productPrice * checkedItem.productDiscount / 100))).toLocaleString()}원</span> <br />
                                                        <span className="original-price">{(checkedItem.productPrice).toLocaleString()} 원</span>
                                                    </td>
                                                    <td>{checkedItem.cartQty}개</td>
                                                    <td className="font-large">{(Math.ceil((checkedItem.productPrice - (checkedItem.productPrice * checkedItem.productDiscount / 100)) * checkedItem.cartQty)).toLocaleString()}원</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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

                            {/* 주문자 정보 확인 */}
                            <div className="row justify-content-center mt-4">
                                <div className="col-lg-8 content-body">
                                    <h3 className="custom-heading me-4">주문자 정보 확인</h3>
                                    <hr className="custom-hr" />
                                    <div className='row'>
                                        <div className='col'>
                                            <span className="custom-span me-4">이름</span>
                                            <span>{userInfo.userName}</span>
                                        </div>
                                        <div className='col'>
                                            <span className="custom-span me-4">이메일</span>
                                            <span>{userInfo.userEmail}</span>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>

                            {/* 결제 수단 */}
                            <div className="row justify-content-center mt-4">
                                <div className="col-lg-8 content-body">
                                    <h3 className="custom-heading me-4">결제 수단</h3>
                                    <hr className="custom-hr" />
                                    <input type="radio" checked={true} />
                                    <label htmlFor="option1">
                                        <img style={{ width: '150px' }} src={kakaopay} alt="카카오페이" />
                                    </label>
                                    <hr />
                                    <span className="custom-span-info">
                                        ＊ 카카오페이는 신용카드 선할인과 카드사 포인트는 이용하실 수 없으며 신용카드별 청구 할인은 이용하실 수 있습니다.
                                    </span>
                                </div>
                            </div>

                            {/* 약관 동의 */}
                            <div className="row justify-content-center mt-4">
                                <div className="col-lg-8 content-body">
                                    <h3 className="custom-heading me-4">약관 동의</h3>
                                    <hr className="custom-hr" />
                                    <div className='row terms'>
                                        <label className="all-agree-label">
                                            <input type="checkbox" checked={termsOfUseAllChecked} onChange={handleAllCheck} />
                                            <span className='custom-span all-agree-text mb-3'> 주문정보/결제 대행 서비스 약관 모두 동의</span>
                                        </label>
                                        <div className="agreement-box" style={{ borderBottom: 'none' }}>
                                            <label className="agreement-label">
                                                <input type="checkbox" checked={giftConChecked} onChange={() => handleSingleCheck('giftCon')} />
                                                <span className='custom-span bold'> 기프티콘 구매 동의</span><br />
                                                <span className='m-4'> - 기프트콘 발송 및 CS처리 등을 이해 수신자로부터 CJCGV에 수신자의 휴대전화번호를 제공하는 것에 대한 적합한 동의를 받습니다.</span>
                                            </label>
                                        </div>
                                        <div className="agreement-box" style={{ borderTop: 'none' }}>
                                            <label className="agreement-label">
                                                <input type="checkbox" checked={paymentTermsChecked} onChange={() => handleSingleCheck('paymentTerms')} />
                                                <span className='custom-span bold'> 결제 대행 서비스 약관 모두 동의</span><br />
                                                <input type="checkbox" checked={financialTermsChecked} onChange={() => handleSingleCheck('financialTerms')} />
                                                <span className='m-4'> 전자 금융거래 이용약관</span><br />
                                                <input type="checkbox" checked={personalInfoTermsChecked} onChange={() => handleSingleCheck('personalInfoTerms')} />
                                                <span className='m-4'> 개인정보 수집 이용약관</span><br />
                                                <input type="checkbox" checked={infoSharingTermsChecked} onChange={() => handleSingleCheck('infoSharingTerms')} />
                                                <span className='m-4'> 개인정보 제공 및 위탁안내</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 결제하기 버튼 클릭 */}
                            <div className="row justify-content-center mt-4">
                                <div className="col-lg-8 content-body me-4">
                                    <div className='row'>
                                        <div className="col-3">
                                            <button className='btn btn-outline-dark w-100 btn-lg' onClick={() => setBtnPurchase(false)}><FaArrowAltCircleLeft /> 이전화면</button>
                                        </div>
                                        <div className="col-9">
                                            <button className='btn btn-dark w-100 btn-lg' onClick={() => isValidToPay()}>결제하기</button>
                                        </div>
                                    </div>

                                </div>
                            </div>



                        </>
                    )
                ) : ( //장바구니DB가 없으면
                    <>
                        {/* 장바구니 헤더 출력 */}
                        <PurchaseMenu activeStep="1" />

                        <div className="row justify-content-center">
                            <div className="col-lg-8 content-body">
                                <h1>아이템이 없습니다</h1>
                                <Link to="/store/package" className='btn btn-dark w-100 '>스토어 가기</Link>
                            </div>
                        </div>
                    </>
                )}

            </div >
        </>
    );
};

export default Cart;