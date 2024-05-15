import React, { useState, useEffect, useCallback } from "react";
import axios from "../utils/CustomAxios";
import { useParams, Link } from "react-router-dom";

export default function PersonalDetail() {
    const { personalNo } = useParams();
    const [personal, setPersonal] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [writerName, setWriterName] = useState("");

    useEffect(() => {
        loadData();
    }, [personalNo]);

    const loadData = useCallback(async () => {
        try {
            if (!personalNo) return;

            const personalResp = await axios.get(`/personal/${personalNo}`);
            if (personalResp.data) {
                setPersonal(personalResp.data);
                setComments(personalResp.data.comments || []);
            }

            listComments();
        } catch (error) {
            console.error("데이터를 불러오는 중 오류 발생:", error);
        }
    }, [personalNo]);

    const handleAddComment = async () => {
        try {
            const response = await axios.post("/comments/", {
                personalNo: personalNo,
                commentsContent: newComment,
                commentsWriter: writerName
            });
            console.log("새 댓글이 추가되었습니다:", response.data);
            setNewComment("");
            loadData();
        } catch (error) {
            console.error("댓글 추가 중 오류 발생:", error);
        }
    }

    const handleDeleteComment = async (commentId) => {
        try {
            const response = await axios.delete(`/comments/${commentId}`);
            console.log("댓글이 삭제되었습니다:", response.data);
            loadData();
        } catch (error) {
            console.error("댓글 삭제 중 오류 발생:", error);
        }
    }

    const listComments = async () => {
        try {
            const response = await axios.get(`/comments/?personalNo=${personalNo}`);
            console.log("댓글 목록:", response.data);
            setComments(response.data);
        } catch (error) {
            console.error("댓글 목록을 불러오는 중 오류 발생:", error);
        }
    }
    
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
                            <p className="card-text" style={{ width: "100%" }}>{personal.personalContent}</p>
                        </div>
                        <div className="card-footer">
                            <Link to="/personal" className="btn btn-primary btn-sm">목록으로 돌아가기</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mt-4">
                <div className="col-lg-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="댓글을 입력하세요..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="작성자 이름을 입력하세요..."
                            value={writerName}
                            onChange={(e) => setWriterName(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={handleAddComment}>작성</button>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mt-4">
                <div className="col-lg-8">
                    <div className="comment-lists">
                        {comments.map(comment => (
                            <div key={comment.commentsId} className="card mb-3">
                                <div className="card-body">
                                    <p className="card-text">{comment.commentsContent}</p>
                                </div>
                                <div className="card-footer text-muted d-flex justify-content-between align-items-center">
                                    <span>작성자: {comment.commentsWriter}</span>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.commentsId)}>삭제</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
