import React from "react";
import Comment from "./Comment";

function CommentLists({ comments, editComment }) {
    if (!comments) return null; // comments가 유효하지 않은 경우 null을 반환하여 렌더링을 중지합니다.

    return (
        <ul className="list-cmt">
            {comments.map(comment => (
                <Comment key={comment.commentsId} comment={comment} editComment={editComment} /> // 수정된 부분
            ))}
        </ul>
    );
}

export default CommentLists;
