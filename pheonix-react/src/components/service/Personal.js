import React, { useState, useEffect } from 'react';
import axios from "../utils/CustomAxios";
import { NavLink } from 'react-router-dom';
import Pagination from './Pagination';
import WrapComments from './WrapComments';

const Personal = () => {
    const [personals, setPersonals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
    const [selectedPersonal, setSelectedPersonal] = useState(null);

    useEffect(() => {
        axios.get("/personal/")
            .then(resp => {
                setPersonals(resp.data);
            })
            .catch(error => {
                console.error("Error loading personals:", error);
            });
    }, []);

    const deletePersonal = (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;

        axios.delete("/personal/" + target.personalNo)
            .then(() => {
                const updatedPersonals = personals.filter(item => item.personalNo !== target.personalNo);
                setPersonals(updatedPersonals);
            })
            .catch(error => {
                console.error("Failed to delete personal item!", error);
            });
    }

    const handleTitleClick = (personal) => {
        setSelectedPersonal(personal);
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = personals.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="content-head">
                        <div className="content-head-text">
                            1:1 문의게시판
                        </div>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="content-body">
                        <div className="content-body-text">
                            문의게시판이다람쥐
                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-2 mb-3">
                    <NavLink to="/chatbot">
                        <img src="/image/chatbot.png" alt="Chatbot" />
                    </NavLink>
                </div>
                <div className="col-lg-2 mb-3">
                    <NavLink to="/lost">
                        <img src="/image/bunsil.png" alt="분실물" />
                    </NavLink>
                </div>
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
                                        <NavLink to={`/personaldetail/${item.personalNo}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => handleTitleClick(item)}>{item.personalTitle}</NavLink>
                                    </td>
                                    <td>{item.personalId}</td>
                                    <td>
                                        <button className="btn btn-danger" onClick={() => deletePersonal(item)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="row justify-content-end">
                        <div className="col-lg-2">
                            <NavLink to="/personalwrite">
                                <button className="btn btn-success">글쓰기</button>
                            </NavLink>
                        </div>
                    </div>
                    <Pagination currentPage={currentPage} totalPages={Math.ceil(personals.length / postsPerPage)} paginate={paginate} />
                </div>
            </div>


            {selectedPersonal && (
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <WrapComments comments={selectedPersonal.comments} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Personal;
