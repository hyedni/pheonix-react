import React, { useCallback, useEffect, useState } from "react";
import axios from "../utils/CustomAxios";
import { useParams, Link } from "react-router-dom";
import WrapComments from "./WrapComments";

const PersonalDetail = () => {
    const { personalNo } = useParams();
    const [personal, setPersonal] = useState({});
    const [comments, setComments] = useState([]);

    useEffect(() => {
        loadData();
    }, [personalNo]);

    const loadData = useCallback(async () => {
        try {
            if (!personalNo) return;
            const personalResp = await axios.get("/personal/" + personalNo);
            if (personalResp.data) {
                setPersonal(personalResp.data);
                setComments(personalResp.data.comments || []);
            }
        } catch (error) {
            console.error("Error loading data:", error);
        }
    }, [personalNo]);

    const addComment = async (newComment) => {
        try {
            const commentResp = await axios.post(`/comments`, { content: newComment });
            setComments([...comments, commentResp.data]);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

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
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <WrapComments comments={comments} addComment={addComment} />
                </div>
            </div>
        </div>
    );
};

export default PersonalDetail;
