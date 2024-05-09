// Personal.js

import React, { useState, useEffect } from 'react';
import axios from "../utils/CustomAxios";
import { NavLink } from 'react-router-dom';
import Pagination from './Pagination';

const Personal = () => {
    const [personals, setPersonals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    useEffect(() => {
        axios.get("/personal/")
            .then(resp => {
                setPersonals(resp.data);
            })
            .catch(error => {
                console.error("Error loading personals:", error);
            });
    }, []);

    const deletePersonal = async (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;

        try {
            await axios.delete("/personal/" + target.personalNo);
        } catch (error) {
            console.error("Failed to delete lost item!", error);
        }
    }

    const insertReply = (personal) => {
        axios.post("/write/reply", personal) // personal 객체를 전달하도록 수정
            .then(resp => {
                // 답글이 성공적으로 추가된 경우, 새로고침이나 추가된 답글을 화면에 표시하는 등의 작업을 수행할 수 있음
            })
            .catch(error => {
                console.error("Error inserting reply:", error);
            });
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = personals.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8 content-head">
                    <div className="content-head-text">
                        1:1 문의 게시판
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="content-body-text">
                        이지롱
                    </div>
                </div>
            </div>
            <div className="text-end mb-3">
                <NavLink to="/lost">
                    <img src="/image/bunsil.png" alt="분실물" />
                </NavLink>
            </div>
            <div className="text-end mb-3">
                <NavLink to="/chatbot">
                    <img src="/image/chatbot.png" alt="Chatbot" />
                </NavLink>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th scope="col">번호</th>
                                <th scope="col">제목</th>
                                <th scope="col">글쓴이</th>
                                <th scope="col">삭제</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map(item => (
                                <tr key={item.personalNo}>
                                    <td>{item.personalNo}</td>
                                    <td>
                                        <NavLink to={`/personaldetail/${item.personalNo}`} style={{ textDecoration: 'none', color: 'inherit' }}>{item.personalTitle}</NavLink>
                                    </td>
                                    <td>{item.personalId}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => deletePersonal(item)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <Pagination currentPage={currentPage} totalPages={Math.ceil(personals.length / postsPerPage)} paginate={paginate} />

                </div>
            </div>
        </div>

    );
};

export default Personal;
