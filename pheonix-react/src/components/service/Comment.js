import React, { useState } from "react";

export default function Comment({ comment, editComment }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(comment.comments_content);

    const handleEditInput = () => {
        editComment(comment.id, editValue);
        setIsEditing(false);
    };

    return (
        <li id={comment.id}>
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
            </span>
        </li>
    );
}
