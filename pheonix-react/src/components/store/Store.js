import StoreJumbotron from "./StoreJumbotron";
import { useState, useEffect, useCallback } from "react";
import axios from "../utils/CustomAxios";
import './Store.css';
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Import the cart icon


const Store= ()=>{
    //state
    const [products, setProducts] = useState([]);
    //점보트론용state
    const [title, setTitle] = useState("패키지");
    const [subTitle, setSubTitle] = useState("패키지 상품입니다:) 마음을 담아 선물하던지 말던지~ㅋ");
    
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
        setTitle(productType);
        if(productType === "포인트") {
            setSubTitle("포인트름을 선물하세요");
        }
        else if(productType === "콤보") {
            setSubTitle("콤보고릴라");
        }
        else if(productType === "팝콘") {
            setSubTitle("팝콘만 먹으면 목이 말라요");
        }
        else if(productType === "음료") {
            setSubTitle("음료를 많이 마시면 중간에 화장실 갑니다");
        }
        else if(productType ==="스낵") {
            setSubTitle("간빼고 식사하기");
        }
        else {
            setSubTitle("패키지 상품입니다:) 마음을 담아 선물하던지 말던지~ㅋ");
        }
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
                <nav className="navbar navbar-expand-lg bg-light border-0"> {/* Remove the border */}
                    <div className="collapse navbar-collapse" id="navbarColor03">
                        <ul className="fw-bold navbar-nav d-flex justify-content-around w-100 align-items-center"> {/* Adjust navigation item width */}
                            <li className="nav-item" onClick={() => loadListData("패키지")}>
                                <NavLink className="nav-link active" to="/store">패키지</NavLink>
                            </li>
                            <li className="nav-item" onClick={() => loadListData("포인트")}>
                                <NavLink className="nav-link active" to="/store">포인트</NavLink>
                            </li>
                            <li className="nav-item" onClick={() => loadListData("콤보")}>
                                <NavLink className="nav-link active" to="/store">콤보</NavLink>
                            </li>
                            <li className="nav-item" onClick={() => loadListData("팝콘")}>
                                <NavLink className="nav-link active" to="/store">팝콘</NavLink>
                            </li>
                            <li className="nav-item" onClick={() => loadListData("음료")}>
                                <NavLink className="nav-link active" to="/store">음료</NavLink>
                            </li>
                            <li className="nav-item" onClick={() => loadListData("간식")}>
                                <NavLink className="nav-link active" to="/store">스낵</NavLink>
                            </li>
                            <li className="nav-item"> {/* Add a margin-left auto to push it to the right */}
                                <NavLink className="nav-link active" to="/cart">
                                    <FaShoppingCart /> {/* Cart icon */}
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>

            <StoreJumbotron title={title} subTitle={subTitle} />

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