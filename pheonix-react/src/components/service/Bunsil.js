import React, { useState } from 'react';
import axios from "../utils/CustomAxios";

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
        formData.append('lostAttach', file);

        try {
            await axios.post("/lost/", formData);
            alert('글쓰기가 완료되었습니다.');
            // 등록이 완료되면 분실물 게시판으로 이동
            window.location.href = '/lost';
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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mt-4 mb-4">분실물 등록</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="lostTitle">제목</label>
                            <input type="text" className="form-control" id="lostTitle" name="lostTitle" value={lostTitle} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lostContent">내용</label>
                            <textarea className="form-control" id="lostContent" name="lostContent" value={lostContent} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lostAttach">첨부 파일</label>
                            <input type="file" className="form-control-file" id="lostAttach" name="lostAttach" onChange={handleImageChange} />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
                                    <button type="button" className="btn btn-danger mt-2" onClick={clearImagePreview}>Remove</button>
                                </div>
                            )}
                        </div>
                        <div className="col-lg-8 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">등록</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Bunsil;
