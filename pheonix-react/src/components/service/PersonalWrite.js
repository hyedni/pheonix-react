import React, { useEffect, useState } from 'react';
import axios from "../utils/CustomAxios";
import { Link } from "react-router-dom";
import { RecoilState, useRecoilState } from 'recoil';
import { loginIdState } from '../utils/RecoilData';

const PersonalWrite = () => {
    const [ loginId, setLoginId ] = useRecoilState(loginIdState);
    const [personalTitle, setPersonalTitle] = useState("");
    const [personalContent, setPersonalContent] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            personalId: loginId,
            personalTitle: personalTitle,
            personalContent: personalContent
        };

        try {
            await axios.post("/personal/", data);
            alert('글쓰기가 완료되었습니다.');
            // 글쓰기가 완료되면 리스트 페이지로 이동
            window.location.href = '/personal#/personal';
        } catch (error) {
            console.error("Error while saving input:", error);
            alert('글쓰기에 실패했습니다.');
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "personalTitle") {
            setPersonalTitle(value);
        } else if (name === "personalContent") {
            setPersonalContent(value);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mb-4">글쓰기</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="personalTitle" className="form-label">제목</label>
                            <input type="text" className="form-control" id="personalTitle" name="personalTitle" value={personalTitle} onChange={handleInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="personalContent" className="form-label">내용</label>
                            <textarea className="form-control" id="personalContent" name="personalContent" rows="6" value={personalContent} onChange={handleInputChange} />
                        </div>
                        <div className="text-end">
                            <Link to="/personal" className="btn btn-outline-secondary me-2">목록으로 돌아가기</Link>
                            <button type="submit" className="btn btn-primary">저장</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PersonalWrite;
