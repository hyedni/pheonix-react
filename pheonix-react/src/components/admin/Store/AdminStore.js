import '../AdminMovie.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from "../../utils/CustomAxios";
import { Link } from 'react-router-dom';
import { FaCirclePlus } from "react-icons/fa6";



function AdminStore() {
    const [products, setProducts] = useState([]);
    const [input, setInput] = useState({
        productName: '',
        productType: '',
        productContent: '',
        productPrice: '',
        productOrigin: '',
        productDiscount: '',
        productImgLink: "",
    });
    //첨부파일관련
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const loadList = useCallback(async () => {
        const resp = await axios.get("/product/");
        setProducts(resp.data);
    }, [products]);

    useEffect(() => {
        loadList();
    }, []);

    //삭제
    const deleteproduct = useCallback(async (target) => {
        const choice = window.confirm("돈 안벌고 싶으면 삭제 하시구요.");
        if (choice === false) return;

        const resp = await axios.delete("/product/" + target.productNo);
        loadList();
    }, [products]);

    const [productType, setProductType] = useState(''); // 제품 유형
    const filteredProducts = useMemo(() => {
        if (!productType) return products; // 제품 유형이 선택되지 않은 경우 전체 목록 반환
        return products.filter(product => product.productType === productType);
    }, [products, productType]);
    

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className='row'>

                    <div className="title-head-text col-9">
                        상품 관리
                        <Link to="/newProduct" className="ms-3">
                            <FaCirclePlus style={{ marginBottom: '10px', color: 'rgb(240, 86, 86)' }} />
                        </Link>
                    </div>
                    <div className='col-3 mt-4' style={{ textAlign: 'right' }}>
                        <select value={productType} onChange={(e) => setProductType(e.target.value)}  className='form-select'>
                            <option value="">전체</option>
                            <option value="패키지">패키지</option>
                            <option value="포인트">포인트</option>
                            <option value="콤보">콤보</option>
                            <option value="팝콘">팝콘</option>
                            <option value="음료">음료</option>
                            <option value="간식">스낵</option>
                        </select>
                    </div>
                    </div>
                    <hr />
                </div>
            </div>


            <div className="row">
                <div className="offset-2 col-lg-9">
                    <br />
                    <div className="row">
                        {filteredProducts.map((product) => (
                            <div className="col-md-3 item-wrapper mb-5" key={product.productNo}>
                                <div className='admin-flex-box mt-2'>
                                    <input type="hidden" value={product.productNo} />
                                    <span style={{ fontSize: '20px', fontWeight: 'bold' }} className='ms-2'>{product.productName}</span>
                                </div>
                                <hr />
                                <div className='image-wrapper'>
                                    <img src={product.productImgLink} className='img-thumbnail' />
                                    <Link to={`/productEdit/${product.productNo}`} className='edit-button btn btn-secondary'>
                                        조회/수정
                                    </Link>
                                    <button onClick={e => deleteproduct(product)} className='delete-button btn btn-primary' style={{ margin: '0px' }}>
                                        바로삭제
                                    </button>
                                </div>
                                <hr />
                                <div className='content-wrapper'>
                                    <span>상품명 {product.productName}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminStore;