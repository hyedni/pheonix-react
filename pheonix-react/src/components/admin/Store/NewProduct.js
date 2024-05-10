import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "../../utils/CustomAxios";
import '../AdminMovie.css';


function NewProduct() {
    //첨부파일관련
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const [input, setInput] = useState({
        productName: '',
        productType: '',
        productContent: '',
        productPrice: '',
        productOrigin: '',
        productDiscount: '',
    });

    //등록
    const changeInput = useCallback(async (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    const cancelInput = useCallback(() => {
        setInput({
            productName: '',
            productType: '',
            productContent: '',
            productPrice: '',
            productOrigin: '',
            productDiscount: '',
        });
    }, [input]);

    //등록처리 (FormData에 객체에 파일과 input값을 함께 담아 전송)
    const saveInput = useCallback(async () => {
        const formData = new FormData();
        // 'input' 객체의 각 키와 값을 FormData에 추가
        //console.log(input);
        for (const key in input) {
            formData.append(key, input[key]);
        }
        // 파일도 FormData에 추가
        if (file) {
            formData.append("attach", file);
        }
        try {
            await axios.post("/product/", formData);
            cancelInput();  // 입력 필드 초기화
            clearImagePreview();
            navigate('/adminStore');  // /adminMovie 페이지로 리다이렉트
        } catch (error) {
            console.error("Failed to submit the form!", error);
        }
    }, [input, file]);

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
                    <div className="title-head-text">
                        신규 상품 등록
                        {/* <button className="btn btn-primary ms-5" onClick={e => openModal()}>신규 영화 등록</button> */}
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='offset-2 col-lg-8'>
                    <div className='row mt-4'>
                        <div className='col-md-3 me-4' style={{ borderRight: '0.5px solid rgb(197,198,199)' }}>
                            <div className="attach-file">
                                <span>상품이미지</span>
                                <hr />
                                <div className="mt-3">
                                    <div className="input-group">
                                        <input type="file" onChange={handleImageChange} className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                                    </div>
                                    {imagePreview && (
                                        <div className="img-preview img-thumbnail mt-3">
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                    <div id="imgArea" className="img-preview mt-3"></div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>

                            <div className="row">
                                <div className="col">
                                    <label>상품명</label>
                                    <input type="text" name="productName"
                                        value={input.productName}
                                        onChange={e => changeInput(e)} className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>상품종류</label>
                                    {/* <input type="text" name="productType"
                                        value={input.productType}
                                        onChange={e => changeInput(e)}
                                        className="form-control" /> */}
                                    <select className="form-select" aria-label="Default select example" name="productType" value={input.productType} onChange={e => changeInput(e)}>
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
                                <div className="col">
                                    <label>상품구성</label>
                                    <input type="text" name="productContent"
                                        value={input.productContent}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>상품 가격</label>
                                    <input type="number" name="productPrice"
                                        value={input.productPrice}
                                        onChange={e => changeInput(e)}
                                        className="form-control"/>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>할인율</label>
                                    <input type="text" name="productDiscount"
                                        value={input.productDiscount}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>판매가</label>
                                    <span className='input-group input-group-text'>
                                        {Math.ceil(input.productPrice - (input.productPrice * input.productDiscount / 100))}원
                                    </span>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>원산지</label>
                                    <input type="text" name="productOrigin"
                                        value={input.productOrigin}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3 mb-4">
                                <div className='col-md-6'>
                                    <button className='btn btn-light' onClick={e => saveInput()} style={{ width: '100%' }}>
                                        등록
                                    </button>
                                </div>
                                <div className='col-md-6'>
                                    <button className='btn btn-primary' onClick={e => cancelInput()} style={{ width: '100%' }}>
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





        </>
    );
}

export default NewProduct;