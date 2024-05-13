import React, { useState, useEffect, useCallback } from "react";
import axios from "../utils/CustomAxios";
import { useParams, Link } from "react-router-dom";

export default function PersonalDetail() {
    const { personalNo } = useParams();
    const [personal, setPersonal] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

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
        } catch (error) {
            console.error("Error loading personal data:", error);
        }
    }, [personalNo]);

    const handleAddComment = async () => {
        try {
            const response = await axios.post("/comments/", {
                commentsContent: newComment,
                commentsWriter: "작성자 이름"
            });
            console.log("New comment added:", response.data);
            setNewComment("");
            // 댓글이 추가되면 해당 개인 정보를 다시 로드하여 업데이트된 댓글을 표시할 수 있도록 함
            loadData();
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    }

    const deleteComment = async (comment) => {
        try {
            const response = await axios.delete(`/comments/${comment.commentsId}`);
            console.log("Comment deleted:", response.data);
            // 댓글이 삭제되면 해당 개인 정보를 다시 로드하여 업데이트된 댓글을 표시할 수 있도록 함
            loadData();
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    }

    const Comment = ({ comment }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editValue, setEditValue] = useState(comment.comments_content);

        const handleEditInput = async () => {
            try {
                const response = await axios.put(`/comments/${comment.commentsId}`, {
                    commentsContent: editValue
                });
                console.log("Comment edited:", response.data);
                setIsEditing(false);
                // 댓글이 수정되면 해당 개인 정보를 다시 로드하여 업데이트된 댓글을 표시할 수 있도록 함
                loadData();
            } catch (error) {
                console.error("Error editing comment:", error);
            }
        };

        return (
            <li id={comment.commentsId}>
                <span className="wrap-cmt">
                    <span className="cmt-user">{comment.comments_writer}</span>
                    {isEditing ? (
                        <input
                            type="text"
                            className="form-control"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => (e.key === 'Enter' ? handleEditInput() : null)}
                        />
                    ) : (
                        <span className="cmt-cont">{comment.comments_content}</span>
                    )}
                </span>
                <span className="wrap-btn">
                    <button
                        className="btn btn-edit"
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? "저장" : "수정"}
                    </button>
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteComment(comment)}
                    >
                        삭제
                    </button>
                </span>
            </li>
        );
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
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="댓글을 입력하세요..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button className="btn btn-outline-secondary" type="button" onClick={handleAddComment}>작성</button>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="comment-lists">
                        <ul>
                            {comments.map(comment => (
                                <Comment key={comment.commentsId} comment={comment} />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className='row mt-4'>
                <div className='col'>
                    <table className='table'>
                        <thead className='text-center'>
                            <tr>
                                <th>번호</th>
                                <th>작성자</th>
                                <th>내용</th>
                                <th>관리</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {comments.map(comment => (
                                <tr key={comment.commentsId}>
                                    <td>{comment.commentsId}</td>
                                    <td>{comment.commentsWriter}</td>
                                    <td>{comment.commentsContent}</td>
                                    <td>
                                        <button className='btn btn-danger btn-sm'
                                            onClick={e => deleteComment(comment)}>
                                            삭제
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};
