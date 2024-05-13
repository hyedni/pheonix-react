import React, { useState } from "react";
import axios from "../utils/CustomAxios";
import CommentLists from "./CommentLists";

export default function WrapComments({ comments, addComment }) {
    const [newComment, setNewComment] = useState("");

    const handleAddComment = async () => {
        try {
            const response = await axios.post("/comments/", {
                commentsContent: newComment,
                commentsWriter: "작성자 이름"
            });
            console.log("New comment added:", response.data);
            addComment(response.data);
            setNewComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
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
            <CommentLists comments={comments} />
        </div>
    );
}
