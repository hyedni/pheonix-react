import React, { useState } from 'react';
import axios from "../utils/CustomAxios";

const ReplyForm = () => {
    const [personalNo, setPersonalNo] = useState(""); // personalNo 상태 추가

    const [writeId, setWriteId] = useState("");
    const [writeTitle, setWriteTitle] = useState("");
    const [writeContent, setWriteContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            personalNo: personalNo, // personalNo 추가
            writeId: writeId,
            writeTitle: writeTitle,
            writeContent: writeContent
        };

        try {
            await axios.post("/write/", data);
            alert('글쓰기가 완료되었습니다.');
            window.location.href='/write';
        } catch (error) {
            console.error("Error while saving input:", error);
            alert('글쓰기에 실패했습니다.');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "writeId") {
            setWriteId(value);
        } else if (name === "writeTitle") {
            setWriteTitle(value);
        } else if (name === "writeContent") {
            setWriteContent(value);
        } else if (name === "personalNo") { // personalNo 변경사항g 처리
            setPersonalNo(value);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mt-4 mb-4">글쓰기</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="writeId">아이디</label>
                            <input type="text" className="form-control" id="writeId" name="writeId" value={writeId} onChange={handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="writeTitle">제목</label>
                            <input type="text" className="form-control" id="writeTitle" name="writeTitle" value={writeTitle} onChange={handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="writeContent">내용</label>
                            <textarea className="form-control" id="writeContent" name="writeContent" value={writeContent} onChange={handleInputChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="personalNo">개인 번호</label>
                            <input type="text" className="form-control" id="personalNo" name="personalNo" value={personalNo} onChange={handleInputChange}/>
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

export default ReplyForm;
