// productType 별 리스트를 위한 점보트론
import { useState, useEffect, useMemo } from "react";
import axios from "../../utils/CustomAxios";
import { useLocation } from "react-router";
import { Link } from 'react-router-dom';

const StoreList = ()=>{

    //state
    const [products, setProducts] = useState([]);

    //location
    const location = useLocation();
    //const productType = location.state.value;

    const productType = useMemo(()=>{
        if(location.pathname === "/store/popcorn") {
            return "팝콘";
        }
        else  if(location.pathname === "/store/combo") {
            return "콤보";
        }
        else  if(location.pathname === "/store/drink") {
            return "음료";
        }
        else  if(location.pathname === "/store/snack") {
            return "간식";
        }
        else  if(location.pathname === "/store/point") {
            return "포인트";
        }
        else {
            return "패키지";
        }
    }, [location]);

    //effect
    useEffect(()=> {
       const loadData = async ()=>{
        try {
            const resp = await axios.get("/product/" + productType);
            setProducts(resp.data);
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
        };

        loadData();
    } ,[productType]);

    return(
        <>
        <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="row">
                        {products.map(product => (
                            <div className="col-md-4 mb-4" key={product.productNo}>
                                <div className='mt-2'>
                                    <div>
                                    이미지
                                    </div>
                                    <input type="hidden" value={product.productNo} />
                                    <span style={{ fontSize: '25px' }} className='ms-2'>{product.productName}</span>
                                </div><br />
                                <Link to={`/productDetail/${product.productNo}`} className="text-dark text-decoration-none">
                                    <span>{product.productContent}</span><br />
                                    <span>{product.productPrice}원</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default StoreList;