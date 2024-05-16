import React, { useState, useEffect, useCallback } from "react";
import axios from "../utils/CustomAxios";
import { useParams, Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";

export default function PersonalDetail() {
    const { personalNo } = useParams();
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [user, setUser] = useState([]);
    const [personal, setPersonal] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [writerName, setWriterName] = useState("");

    useEffect(() => {
        loadData();
    }, [personalNo, loginId]);

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
                commentsWriter: loginId
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
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 offset-md-2">
                    <div className="card mb-4">
                        <div className="card-header bg-gray">
                            <h5 className="card-title">{personal.personalTitle}</h5>
                            <p className="card-text">작성자: {personal.personalId}</p>
                        </div>
                        <div className="card-body">
                            <p className="card-text">{personal.personalContent}</p>
                        </div>
                        <div className="card-footer bg-transparent">
                            <Link to="/personal" className="btn btn-outline-secondary">목록으로 돌아가기</Link>
                        </div>
                    </div>

                    <div className="card mb-4">
                        <div className="card-header bg-gray">
                            <h5 className="card-title">댓글</h5>
                        </div>
                        <div className="card-body">
                            <input
                                type="text"
                                className="form-control mb-2"
                                placeholder="댓글을 입력하세요..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <div className="d-flex justify-content-end mb-3">
                                <button className="btn btn-primary" onClick={handleAddComment}>댓글 작성</button>
                            </div>
                            {comments.map(comment => (
                                <div key={comment.commentsId} className="card mb-3">
                                    <div className="card-body">
                                        <p className="card-text">{comment.commentsContent}</p>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <p className="card-text">작성자: {comment.commentsWriter}</p>
                                        {comment.commentsWriter === loginId && (
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.commentsId)}>삭제</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
