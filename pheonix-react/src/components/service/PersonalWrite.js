import React, { useState } from 'react';
import axios from "../utils/CustomAxios";

const PersonalWrite = () => {
    const [personalId, setPersonalId] = useState("");
    const [personalTitle, setPersonalTitle] = useState("");
    const [personalContent, setPersonalContent] = useState("");


    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            personalId: personalId,
            personalTitle: personalTitle,
            personalContent: personalContent
        };

        try {
            await axios.post("/personal/", data);
            alert('글쓰기가 완료되었습니다.');
            // 글쓰기가 완료되면 리스트 페이지로 이동
            window.location.href = '/personal';
        } catch (error) {
            console.error("Error while saving input:", error);
            alert('글쓰기에 실패했습니다.');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "personalId") {
            setPersonalId(value);
        } else if (name === "personalTitle") {
            setPersonalTitle(value);
        } else if (name === "personalContent") {
            setPersonalContent(value);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mt-4 mb-4">글쓰기</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="personalId">아이디</label>
                            <input type="text" className="form-control" id="personalId" name="personalId" value={personalId} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="personalTitle">제목</label>
                            <input type="text" className="form-control" id="personalTitle" name="personalTitle" value={personalTitle} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="personalContent">내용</label>
                            <textarea className="form-control" id="personalContent" name="personalContent" value={personalContent} onChange={handleInputChange} />
                        </div>
                        <div className="col-lg-8 d-flex justify-content-end">
                            <button type="submit" className="btn btn-primary">저장</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonalWrite;
