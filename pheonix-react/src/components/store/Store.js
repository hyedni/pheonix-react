import StoreJumbotron from "./StoreJumbotron";
import StoreMenuJumbotron from "./StoreMenuJumbotron";
import { useState, useEffect, useCallback } from "react";
import axios from "../utils/CustomAxios";
import './Store.css';
import { NavLink } from "react-router-dom";


const Store= ()=>{
    //state
    const [products, setProducts] = useState([]);
    
    //const location = useLocation();

    //effect
    useEffect(()=> {
        loadData();
    }, []);

    //callback
    const loadData = useCallback(async ()=>{
        const resp = await axios.get("/product/" + "패키지");
        setProducts(resp.data);
    },[products]);

    const loadListData = useCallback(async (productType)=>{
        const resp = await axios.get("/product/" + productType);
        setProducts(resp.data);
    },[products]);


    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        스토어
                    </div>
                </div>
            </div>
            {/* 페이지 내부 메뉴 바 */}
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <nav className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
                        <div className="collapse navbar-collapse" id="navbarColor03">
                            <ul className="navbar-nav me-auto">
                                <li className="nav-item" onClick={e=>loadListData("패키지")}>
                                    <NavLink className="nav-link active" to="/store" >패키지</NavLink>
                                        {/* <span className="visually-hidden">(current)</span> */}
                                </li>
                                <li className="nav-item" onClick={e=>loadListData("포인트")}>
                                    <NavLink className="nav-link active" to="/store">포인트</NavLink>
                                </li>
                                <li className="nav-item" onClick={e=>loadListData("콤보")}>
                                    <NavLink className="nav-link active" to="/store">콤보</NavLink>
                                </li>
                                <li className="nav-item" onClick={e=>loadListData("팝콘")}>
                                    <NavLink className="nav-link active" to="/store">팝콘</NavLink>
                                </li>
                                <li className="nav-item" onClick={e=>loadListData("음료")}>
                                    <NavLink className="nav-link active" to="/store">음료</NavLink>
                                </li>
                                <li className="nav-item" onClick={e=>loadListData("스낵")}>
                                    <NavLink className="nav-link active" to="/store">스낵</NavLink>
                                </li>
                            </ul>

                        </div>
                    </nav>
                </div>
            </div>

            <StoreJumbotron title="패키지" subTitle="패키지 상품입니다:) 마음을 담아 선물하던지 말던지 웩" />

            <div className="row">
                <div className="col-lg-8 offset-2">
                    <div className="row m-4">
                        {products.map(product => (
                            <div className="col-md-3 item-wrapper" key={product.productNo}>
                                <div className='mt-2'>
                                    <div>
                                    이미지
                                    </div>
                                    <input type="hidden" value={product.productNo} />
                                    <span style={{ fontSize: '25px' }} className='ms-2'>{product.productName}</span>
                                </div><br />
                                <span>{product.productContent}</span><br />
                                <span>{product.productPrice}원</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Store;