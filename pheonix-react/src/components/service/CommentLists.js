import React from "react";
import Comment from "./Comment";

function CommentLists({ commentLists, editComment }) {
    if (!commentLists) return null; // commentLists가 유효하지 않은 경우 null을 반환하여 렌더링을 중지합니다.

    return (
        <ul className="list-cmt">
            {commentLists.map(comment => (
                <li key={comment.commentsId}>
                    <span className="cmt-user">{comment.commentsWriter}</span>
                    <span className="cmt-cont">{comment.commentsContent}</span>
                    <span className="cmt-written">{comment.commentsWritten}</span> {/* 작성 시간 표시 */}
                    {/* 댓글 수정 기능은 Comment 컴포넌트에서 처리하도록 전달 */}
                    <Comment comment={comment} editComment={editComment} />
                </li>
            ))}
        </ul>
    );
}

export default CommentLists;
