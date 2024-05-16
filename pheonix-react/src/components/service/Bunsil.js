import React, { useState } from 'react';
import axios from "../utils/CustomAxios";
import { Link } from "react-router-dom";

const Bunsil = () => {
    const [lostTitle, setLostTitle] = useState("");
    const [lostContent, setLostContent] = useState("");
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('lostTitle', lostTitle);
        formData.append('lostContent', lostContent);
        formData.append('attach', file);

        try {
            await axios.post("/lost/", formData);
            alert('글쓰기가 완료되었습니다.');
            // 등록이 완료되면 분실물 게시판으로 이동
            window.location.href = '/personal#/lost';
        } catch (error) {
            console.error("Error while saving input:", error);
            alert('글쓰기에 실패했습니다.');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if(name === "lostTitle") {
            setLostTitle(value);
        } else if (name === "lostContent") {
            setLostContent(value);
        }
    };

    const clearImagePreview = () => {
        setImagePreview(null);
        setFile(null); // 이미지 미리보기를 지우면 파일 상태도 초기화
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if(file) {
            setFile(file);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mb-4">분실물 등록</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="lostTitle" className="form-label">제목</label>
                            <input type="text" className="form-control" id="lostTitle" name="lostTitle" value={lostTitle} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lostContent" className="form-label">내용</label>
                            <textarea className="form-control" id="lostContent" name="lostContent" rows="6" value={lostContent} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lostAttach" className="form-label">첨부 파일</label>
                            <input type="file" className="form-control" id="attach" name="attach" onChange={handleImageChange} />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
                                    <button type="button" className="btn btn-danger mt-2" onClick={clearImagePreview}>Remove</button>
                                </div>
                            )}
                        </div>
                        <div className="text-end">
                            <Link to="/lost" className="btn btn-negative me-2">이전</Link>
                            <button type="submit" className="btn btn-primary">저장</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Bunsil;
