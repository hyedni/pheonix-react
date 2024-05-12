import React, { useState } from "react";
import axios from "../utils/CustomAxios";
import CommentLists from "./CommentLists";

export default function WrapComments({ comments, addComment: addNewComment, editComment }) {
    const [newComment, setNewComment] = useState("");

    const addComment = async (newComment) => {
        try {
            const response = await axios.post(`/comments`, {
                commentsContent: newComment.content,
                commentsWriter: newComment.writer // 필드 이름을 commentsWriter로 수정
            });
            console.log("New comment added:", response.data);
            // 요청에 성공하면 새로운 댓글을 화면에 반영할 수 있도록 상태를 업데이트합니다.
            addNewComment(response.data); // 기존의 addComment 함수로 전달
            setNewComment(""); // 입력 필드 초기화
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    

    const handleAddComment = () => {
        if (newComment.trim() === "") return;
        addComment({ content: newComment, writer: "작성자 이름" }); // 작성자 이름 추가
    };

    return (
        <div className="wrap-comment">
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
            <CommentLists commentLists={comments} editComment={editComment} />
        </div>
    );
}
