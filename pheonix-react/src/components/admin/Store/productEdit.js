import '../AdminMovie.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../../utils/CustomAxios";
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";
import { TbPencilCancel } from "react-icons/tb";


function ProductEdit() {
    const { productNo } = useParams();
    const [product, setProduct] = useState({
        productNo: '',
        productName: '',
        productType: '',
        productContent: '',
        productPrice: '',
        productOrigin: '',
        productDiscount: '',
    });
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const loadList = useCallback(async () => {
        const resp = await axios.get(`/product/detail/${productNo}`);
        setProduct(resp.data);
    }, [product]);

    useEffect(() => {
        loadList();
    }, []);

    //수정용백업
    const [backup, setBackup] = useState({});
    const [isEdit, setIsEdit] = useState({
        edit: false
    });

    //수정하기버튼클릭
    const editProduct = useCallback(() => {
        setBackup({ ...product });
        setIsEdit({ edit: true });
    }, [product]);

    //수정입력
    const changeProduct = useCallback((e) => {
        setProduct({
            ...product,
            [e.target.name]: e.target.value
        });
    }, [product]);

    //수정처리
    const saveEditProduct = useCallback(async () => {
        const resp = await axios.patch("/product/", product);
        setIsEdit({ edit: false });
        loadList();
    }, [product]);

    //수정취소
    const cancelEditProduct = useCallback(() => {
        setProduct({ ...backup });
        setIsEdit({ edit: false });
        loadList();
    }, [product]);

    //삭제
    const deleteProduct = useCallback(async (productNo) => {
        const choice = window.confirm("삭제하려는 상품이 맞음???????");
        if (choice === false) return;

        const resp = await axios.delete("/product/" + productNo);
        navigate('/adminStore');
    }, [product]);

    //첨부파일관련
    const clearImagePreview = () => {
        setImagePreview(null);
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            setFile(file);
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    {isEdit.edit === false ? (
                        <>
                            <div className="title-head-text">
                                상품 정보 조회
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="title-head-text">
                                상품 정보 수정
                            </div>
                        </>
                    )}
                </div>
            </div>
            <button className='btn btn-primary' onClick={e => editProduct()}>수정시작하기</button>
            <button className='btn btn-primary' onClick={e => cancelEditProduct()}>수정취소하기</button>
            <hr />

            <div className='row'>
                <div className='offset-2 col-lg-8'>

                    <div className='row mt-4'>
                        <div className='col-md-3 me-4' style={{ borderRight: '0.5px solid rgb(197,198,199)' }}>
                            <div className="attach-file">
                                <span style={{ fontSize: '30px', fontWeight: 'bold' }}>포스터</span>
                                <hr />
                                <div className="mt-3" style={{ height: '450px' }}>
                                    <div class="input-group mb-5">
                                        <input type="file" onChange={handleImageChange} class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                                    </div>
                                    {!imagePreview && (
                                        <img src={product.productImgLink} className='img-preview img-thumbnail' alt="상품이미지" />
                                    )}
                                    {imagePreview && (
                                        <div className="img-preview img-thumbnail mt-3">
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                    <div id="imgArea" className="img-preview mt-3"></div>
                                </div>
                                <div className='mt-5'>
                                    <div className="row me-2 mb-3">
                                        <button onClick={e => saveEditProduct()} className='delete-button btn btn-dark'>
                                            포스터 등록하기
                                        </button>
                                    </div>
                                    <div className="row me-2 mb-3">
                                        <button onClick={e => saveEditProduct()} className='delete-button btn btn-dark'>
                                            정보 수정 완료
                                        </button>
                                    </div>
                                    <div className="row me-2">
                                        <button onClick={e => deleteProduct(product.productNo)} className='delete-button btn btn-primary'>
                                            영화 삭제
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>

                            <div className='row'>
                                <div className='col'>

                                    {isEdit.edit === false ? (
                                        <>
                                            <div className="row">
                                                <div className="col-3" style={{ fontSize: '30px', fontWeight: 'bold' }}>상품명</div>
                                                <div className="col-9 input-content" style={{ fontSize: '30px', fontWeight: 'bold' }}>{product.productName}</div>
                                            </div>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="col-3">관리번호</div>
                                                <div className="col-9 input-content ">{product.productNo}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">상품종류</div>
                                                <div className="col-9 input-content ">{product.productType}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">상품구성</div>
                                                <div className="col-9 input-content ">{product.productContent}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">상품가격</div>
                                                <div className="col-9 input-content ">{product.productPrice}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">할인율</div>
                                                <div className="col-9 input-content ">{product.productDiscount}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">판매가</div>
                                                <div className="col-9 input-content ">{Math.ceil(product.productPrice - (product.productPrice * product.productDiscount / 100))}원</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">원산지</div>
                                                <div className="col-9 input-content ">{product.productOrigin}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="row">
                                                <div className="col-3" style={{ fontSize: '30px', fontWeight: 'bold' }}>상품명</div>
                                                <div className='col-9 pt-2'>
                                                    <input className="form-control" type="text" name='productName' style={{ width: '100%', textAlign: 'center' }}
                                                        value={product.productName} onChange={e => changeProduct(e)} />
                                                </div>
                                            </div>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="col-3">관리번호</div>
                                                <div className="col-9 input-content ">{product.productNo}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">상품종류</div>
                                                <div className='col-9'>
                                                    <select class="form-select" aria-label="Default select example" name="productType" value={product.productType} onChange={e => changeProduct(e)}>
                                                        <option selected>선택하세요</option>
                                                        <option value="패키지">패키지</option>
                                                        <option value="포인트">포인트</option>
                                                        <option value="콤보">콤보</option>
                                                        <option value="팝콘">팝콘</option>
                                                        <option value="음료">음료</option>
                                                        <option value="간식">간식</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">상품구성</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='productContent' style={{ width: '100%', textAlign: 'center' }}
                                                        value={product.productContent} onChange={e => changeProduct(e)} />
                                                </div>
                                            </div>
                                            
                                            <div className="row mt-3">
                                                <div className="col-3">상품가격</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="number" name='productPrice' style={{ width: '100%', textAlign: 'center' }}
                                                        value={product.productPrice} onChange={e => changeProduct(e)} />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-3">할인율</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="number" name='productDiscount' style={{ width: '100%', textAlign: 'center' }}
                                                        value={product.productDiscount} onChange={e => changeProduct(e)} />
                                                </div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-3">판매가</div>
                                                <div className="col-9 input-content ">{Math.ceil(product.productPrice - (product.productPrice * product.productDiscount / 100))}원</div>
                                            </div>

                                            <div className="row mt-3">
                                                <div className="col-3">원산지</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="type" name='productOrigin' style={{ width: '100%', textAlign: 'center' }}
                                                        value={product.productOrigin} onChange={e => changeProduct(e)} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ProductEdit;