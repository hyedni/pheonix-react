import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useRef, useState } from "react";
import Modal from 'bootstrap/js/dist/modal'; // 모달 라이브러리 import 추가
import { NavLink } from 'react-router-dom';

const Lost = () => {
    const [losts, setLosts] = useState([]);
    const [input, setInput] = useState({
        lostTitle:"",
        lostContent:"",
    });

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    
    const loadList = useCallback(async () => {
        try {
            const resp = await axios.get("/lost/");
            setLosts(resp.data);
        } catch(error) {
            console.error("Failed to load lost list!", error);
        }
    }, []);

    useEffect(() => {
        loadList();
    }, [loadList]);

    const clearInput = () => {
        setInput({
            lostTitle:"",
            lostContent:"",
        });
        setFile(null);
        setImagePreview(null);
    };

    const deleteLost = async (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;

        try {
            await axios.delete("/lost/"+target.lostNo);
            loadList();
        } catch(error) {
            console.error("Failed to delete lost item!", error);
        }
    };

    const changeInput = (e) => {
        if (e.target.name === "lostAttach") {
            setFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setInput({
                ...input,
                [e.target.name]: e.target.value
            });
        }
    };

    const saveInput = async () => {
        const formData = new FormData();
        formData.append("lostTitle", input.lostTitle);
        formData.append("lostContent", input.lostContent);
        if (file) {
            formData.append("attach", file);
        }
        try {
            await axios.post("/lost/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            loadList();
            clearInput();
            closeModal();
        } catch(error) {
            console.error("Failed to submit the form!", error);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const bsModal = useRef();
    const openModal = () => {
        const modal = new Modal(bsModal.current);
        modal.show();
    };
    
    const closeModal = () => {
        const modal = Modal.getInstance(bsModal.current);
        if (modal) {
            modal.hide();
        }
    };
    
    const cancelInput = () => {
        const choice = window.confirm("작성을 취소하시겠습니까?");
        if (choice === false) return;
        clearInput();
        closeModal();
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                    <img src="/image/lost.png" alt="Lost"/>
                    <ul className="list-group">
                        {losts.map((lost) => (
                            <li key={lost.lostNo} className="list-group-item">
                                <h2>{lost.lostTitle}</h2>
                                <p>{lost.lostContent}</p>
                                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button className="btn btn-outline-primary me-md-2" onClick={() => console.log("Edit button clicked")}>수정</button>
                                    <button className="btn btn-outline-danger" onClick={() => deleteLost(lost)}>삭제</button>
                                </div>
                            </li>
                        ))}
                    </ul>
        
                    <div className="mb-3">
                        <label htmlFor="lost_title" className="form-label">제목</label>
                        <input type="text" id="lost_title" name="lostTitle" value={input.lostTitle} onChange={changeInput} className="form-control" placeholder="제목을 입력하세요" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lost_content" className="form-label">내용</label>
                        <textarea id="lost_content" name="lostContent" value={input.lostContent} onChange={changeInput} className="form-control" placeholder="내용을 입력하세요"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">이미지 업로드</label>
                        <input type="file" id="image" name="lostAttach" onChange={handleImageChange} className="form-control" />
                        {imagePreview && (
                            <div className="img-preview mt-3">
                                <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                            </div>
                        )}
                    </div>
                    <div className="d-grid">
                        <button type="button" className="btn btn-primary" onClick={saveInput}>작성</button>
                        <button type="button" className="btn btn-secondary" onClick={cancelInput}>취소</button>
                    </div>
                    
                    <NavLink to="/personal" className="mt-3">이전</NavLink>
                </div>
            </div>
            
            {/* Modal */}
            <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">신규 분실물 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close" onClick={cancelInput}></button>
                        </div>
                        <div className="modal-body">
                           
                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-light me-2' onClick={saveInput}>등록</button>
                            <button className='btn btn-primary' onClick={cancelInput}>취소</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};    

export default Lost;
