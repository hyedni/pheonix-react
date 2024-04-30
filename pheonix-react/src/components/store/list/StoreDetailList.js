import { useCallback, useEffect, useState, } from "react";
import axios from "../../utils/CustomAxios";
import StoreMenu from "../StoreMenu";
import Notification from "./Notification";
import { useParams } from "react-router";
import { Link } from 'react-router-dom';
import { FaShoppingCart } from "react-icons/fa";

const StoreDetailList = ()=>{

    //state
    const { productNo } = useParams(); //파라미터에서 번호 추출
    const [products, setProducts] = useState({});

    useEffect(()=>{
        loadData();
    },[productNo]);

    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get("/product/detail/" + productNo);
            setProducts(resp.data);
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [productNo]);

    return(
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
                            <div className="col-md-4 mb-4">
                                <div className='mt-2'>
                                    이미지
                                </div>
                                <div>
                                    {/* ul로 하기 */}
                                    <span>{products.productPrice}원</span>
                                    <hr></hr>
                                    <span>상품 구성 {products.productContent}</span><br />
                                    <span>유효 기간</span><br />
                                    <span>원산지 {products.productOrigin}</span><br />
                                    <span>상품 교환 {products.productContent}</span><br />
                                    <hr></hr>
                                    {/* 개수 자리 */}
                                
                                
                                    <Link to={`/cart/${products.productNo}`} className='btn  btn-outline-primary'><FaShoppingCart /></Link>
                                    <Link to={`/gift/${products.productNo}`} className='btn  btn-outline-primary'>선물하기</Link>
                                    <Link to={`/purchase/${products.productNo}`} className='btn  btn-outline-primary'>구매하기</Link>
                                
                                
                                
                                
                                
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