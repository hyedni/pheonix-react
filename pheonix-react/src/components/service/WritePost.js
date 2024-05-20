import axios from "../utils/CustomAxios";
import React, { useState } from 'react';

function WritePost() {


    const [input, setInput] = useState({
        personalId: "",
        personalTitle: "",
        personalContent: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({
            ...prevInput,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post("/personal/", input)
            .then(resp => {
               // console.log("Post created:", resp.data);
                // 글쓰기가 완료되면 personal 게시판으로 이동
            })
            .catch(error => {
                console.error("Error creating post:", error);
            });
    };

    return (
        <div className="container">
             <div className="row justify-content-center">
                <div className="col-lg-8  content-head">
                    <div className="content-head-text">
                        글쓰는 데당
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="content-body-text">
                        글쓰는 곳이라고라고라고라
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="personalId" className="form-label">이름</label>
                    <input type="text" className="form-control" id="personalId" name="personalId" value={input.personalId} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="personalTitle" className="form-label">제목</label>
                    <input type="text" className="form-control" id="personalTitle" name="personalTitle" value={input.personalTitle} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="personalContent" className="form-label">내용</label>
                    <textarea className="form-control" id="personalContent" name="personalContent" value={input.personalContent} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">글쓰기 완료</button>
            </form>
        </div>
    );
}

export default WritePost;
