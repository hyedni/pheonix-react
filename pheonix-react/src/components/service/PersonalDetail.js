// PersonalDetail.js

import React, { useCallback, useEffect, useState } from "react";
import axios from "../utils/CustomAxios";
import { useParams, Link } from "react-router-dom";

const PersonalDetail = () => {
    const { personalNo } = useParams(); // 파라미터에서 번호 추출
    const [personal, setPersonal] = useState({});

    useEffect(() => {
        loadData();
    }, [personalNo]);

    const loadData = useCallback(async () => {
        try {
            if (!personalNo) return; // personalNo가 없으면 함수 종료
            const resp = await axios.get("/personal/" + personalNo);
            if (resp.data) {
                setPersonal(resp.data);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, [personalNo]);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card mt-4 text-center">
                        <div className="card-header">
                            <h2 className="card-title">{personal.personalTitle}</h2>
                            <p className="card-text text-muted">작성자: {personal.personalId}</p>
                        </div>
                        <div className="card-body">
                            <p className="card-text">{personal.personalContent}</p>
                        </div>
                        <div className="card-footer">
                            <Link to="/personal" className="btn btn-primary">목록으로 돌아가기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
    
};

export default PersonalDetail;
