// productType 별 리스트를 위한 점보트론
import { useCallback, useEffect, useState, useMemo  } from "react";
import axios from "../../utils/CustomAxios";
import { useLocation, useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { loginIdState } from '../../utils/RecoilData';
import { useRecoilState } from "recoil";
import { useParams } from "react-router";

//아이콘 임포트
import { FaShoppingCart } from "react-icons/fa";
import { FaGift } from "react-icons/fa";
import { IoBagHandle } from "react-icons/io5";

//디자인 임포트 
import '../../store/list/Store.css';

const StoreList = () => {

    //state
    const [products, setProducts] = useState([]);
    const [imagePreview] = useState(null);
    const [ userId ] = useRecoilState(loginIdState);
    const [itemQty] = useState(1);
    const navigate = useNavigate();
    
    //location
    const location = useLocation();

    //useMemo
    const productType = useMemo(() => {
        if (location.pathname === "/store/popcorn") {
            return "팝콘";
        }
        else if (location.pathname === "/store/combo") {
            return "콤보";
        }
        else if (location.pathname === "/store/drink") {
            return "음료";
        }
        else if (location.pathname === "/store/snack") {
            return "간식";
        }
        else if (location.pathname === "/store/point") {
            return "포인트";
        }
        else {
            return "패키지";
        }
    }, [location]);

    // const addCart = useCallback((productNo)=>{
    //     return {
    //             cartUserId :  "testuser4",//userId,
    //             cartProductNo : productNo,
    //             cartQty : itemQty
    //     }
    // }, []);

    //effect
    useEffect(() => {
        const loadData = async () => {
            try {
                const resp = await axios.get("/product/" + productType);
                setProducts(resp.data);
            }
            catch (error) {
                console.error("API 호출 중 오류 발생:", error);
            }
        };

        loadData();
    }, [productType]);

    //callback
    //장바구니 담기
    const AddItemToCart = useCallback((productNo)=>{

        if (userId === null) {
            const choice = window.confirm("로그인 상태가 아닙니다. \n로그인 페이지로 이동하시겠습니까?");
            if (choice === true) {
                navigate('/login'); // 로그인 페이지로 리다이렉트
                return;
            }
        } 
        axios({
            url: "/cart/add/",
            method: "post",
            data: {
                cartUserId: userId,
                cartProductNo: productNo,
                cartQty: itemQty
            }
        }).then(() => {
            const choice = window.confirm("장바구니에 상품이 담겼습니다. \n장바구니로 이동하시겠습니까?");
            if (choice === true) {
                navigate('/cart');
            } 
        }).catch(error => {
            console.error("Error adding item to cart:", error);
            // Handle error if necessary
        });

           
        
    }, [products]);

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="row justify-content-center">
                        {products.map(product => (
                            <div className="col-3 mb-4 item-wrapper" key={product.productNo}>
                                <Link to={`/productDetail/${product.productNo}`} className="text-dark text-decoration-none">
                                <div className='mt-2'>
                                    <div className="img-thumbnail mt-3 image-wrapper" style={{ height: "400px" }}>
                                        {!imagePreview && (
                                            <img src={product.productImgLink} alt="상품이미지" />
                                        )}
                                        {imagePreview && (
                                            <img src={imagePreview} alt="Preview" />
                                        )}
                                        <Link className='ms-1 edit-button btn btn-secondary' onClick={e => (AddItemToCart(product.productNo))}><FaShoppingCart /></Link>
                                        <Link to={`/purchase/${product.productNo}`} className='delete-button btn btn-secondary'><IoBagHandle /></Link>
                                    </div>

                                </div><br />
                                    <input type="hidden" value={product.productNo} />
                                    <span style={{ fontSize: '25px' }} className='ms-2'>{product.productName}</span><br />
                                    <span className="ms-2">{product.productContent}</span><br />
                                    <span className="ms-2">{product.productPrice}원</span>
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