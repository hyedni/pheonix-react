import { useCallback, useEffect, useState, } from "react";
import axios from "../../utils/CustomAxios";
import StoreMenu from "../StoreMenu";
import Notification from "./Notification";
import { useParams } from "react-router";

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
            
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="row">
                            <div className="col-md-4 mb-4" >
                                <div className='mt-2'>
                                    <div>
                                    이미지
                                    </div>
                                    <span style={{ fontSize: '25px' }} className='ms-2'>{products.productName}</span>
                                </div>
                                <br />

                                    <span>{products.productContent}</span><br />
                                    <span>{products.productPrice}원</span>
                            </div>
                    </div>
                </div>
            </div>

            <Notification />
        </>
    );
};

export default StoreDetailList;