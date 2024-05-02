import '../AdminMovie.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../../utils/CustomAxios";
import { Link, useLinkClickHandler } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";



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

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        상품 관리
                        <Link to="/newProduct" className="btn btn-primary ms-5">
                            신규 상품 등록
                        </Link>
                    </div>
                </div>
            </div>
            <hr/>

            <div className="row">
                <div className="offset-2 col-lg-9">
                    <br />
                    <div className="row">
                        {products.map((product) => (
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
                                    <button onClick={e => deleteproduct(product)} className='delete-button btn btn-primary'>
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