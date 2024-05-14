import PruchaseMenu from "../PurchaseMenu";
import '../Cart.css';
import axios from "../../utils/CustomAxios";
import { useRecoilState } from 'recoil';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { partnerOrderId, partnerUserId, tid, vo, loginIdState } from './../../utils/RecoilData';
import { Navigate, useNavigate, useParams } from "react-router";


//아이콘 임포트
import { FaGift } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";
import { FiMinusCircle } from "react-icons/fi";
import { LuCircleEqual } from "react-icons/lu";
import { FaArrowAltCircleLeft } from "react-icons/fa";

import kakaopay from "../image/kakaopay.png";

const Purchase = () => {

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
    const [product, setProduct] = useState({});

    const [cartPartnerOrderId, setCartPartnerOrderId] = useRecoilState(partnerOrderId);
    const [cartPartnerUserId, setCartPartnerUserId] = useRecoilState(partnerUserId);
    const [cartTid, setCartTid] = useRecoilState(tid);
    const [cartVo, setCartVo] = useRecoilState(vo);

    const { productNo } = useParams();

    const navigate = useNavigate();

    const [purchaseList, setPurchaseList] = useState({
        no: "",
        qty: ""
    });

    useEffect(() => {
        loadData();
        getUserInfo();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get("/product/detail/" + productNo);
            setProduct(resp.data);
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [productNo]);

    //결제
    useEffect(() => {
        const newPurchaseList = ({
          no: productNo,
          qty: 1
        });
        setPurchaseList(newPurchaseList);
      }, []);

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
        const resp = await axios.post("/purchase/one", purchaseList);
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
            const resp = await axios.post("/purchase/success/one", postData);
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

    //선택된 상품의 총 상품 금액
    const getProductPriceOfproducts = useMemo(() => {
        let totalPrice = 0;

            const price = product.productPrice * 1 || 0; // 만약 가격 정보가 없으면 0으로 간주
            totalPrice += price;
        return totalPrice.toLocaleString();
    }, [product]);
    //선택된 상품의 총 할인 금액
    const getDiscountPriceOfproducts = useMemo(() => {
        let totalDiscountPrice = 0;

            const discount = Math.ceil((product.productPrice * product.productDiscount / 100) * 1) || 0;
            totalDiscountPrice += discount;
        return totalDiscountPrice.toLocaleString();
    }, [product]);
    //선택된 상품의 총 결제 예정 금액
    const getTotalPriceOfproducts = useMemo(() => {
        let totalPrice = 0;

            const price = (product.productPrice - Math.ceil((product.productPrice * product.productDiscount / 100))) * 1 || 0;
            totalPrice += price;
        return totalPrice.toLocaleString();
    }, [product]);

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
            <PruchaseMenu activeStep="3" />

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
                                <tr key={product.productNo} className='text-center'>
                                    <td>
                                        <div className="product-info">
                                            <div className="img-preview img-thumbnail">
                                                <img src={imagePreview || product.productImgLink} alt="상품이미지" style={{ width: "90px", height: "90px" }} />
                                            </div>
                                            <div className="product-info-text">
                                                {product.productName}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {/* <span className="font-large">{(Math.ceil(product.productPrice - (product.productPrice * product.productDiscount / 100))).toLocaleString()}원</span> <br /> */}
                                        {/* <span className="original-price">{(product.productPrice).toLocaleString()} 원</span> */}
                                        <span className="font-large">{(Math.ceil(product.productPrice - (product.productPrice * product.productDiscount / 100)))}원</span> <br />
                                        <span className="original-price">{(product.productPrice)} 원</span>
                                    </td>
                                    <td>1 개</td>
                                    {/* <td className="font-large">{(Math.ceil((product.productPrice - (product.productPrice * product.productDiscount / 100)) * 1)).toLocaleString()}원</td> */}
                                    <td className="font-large">{(Math.ceil((product.productPrice - (product.productPrice * product.productDiscount / 100)) * 1))}원</td>
                                </tr>
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
                            {getProductPriceOfproducts}원
                        </div>
                        <div className='col-4 section-design2-icon'>
                            <div className='mt-2'>
                                <FiMinusCircle />
                            </div>
                            <div className="section-design2-mid">
                                {getDiscountPriceOfproducts}원
                            </div>
                            <div className='mt-2'>
                                <LuCircleEqual />
                            </div>
                        </div>

                        <div className='col-4 section-design2'>
                            {getTotalPriceOfproducts}원
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
                            <button className='btn btn-outline-dark w-100 btn-lg'><FaArrowAltCircleLeft /> 스토어가기</button>
                        </div>
                        <div className="col-9">
                            <button className='btn btn-dark w-100 btn-lg' onClick={() => isValidToPay()}>결제하기</button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default Purchase;