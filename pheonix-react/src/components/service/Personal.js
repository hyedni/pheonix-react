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
        <>
            <br />
            <br />
            <div className="row justify-content-center">
                <div className="col-lg-8 title-head d-flex align-items-center justify-content-between"> {/* d-flex, align-items-center 및 justify-content-between 추가 */}
                    <div className="title-head-text">
                        1:1 문의게시판
                        <NavLink to="/personalwrite">
                            <button className="btn btn-outline-dark ms-4">글쓰기</button>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to="/chatbot" className="me-4">
                            <img src="/image/chatbot.png" alt="Chatbot" style={{ width: "105px" }} />
                        </NavLink>

                        <NavLink to="/lost">
                            <img src="/image/bunsil.png" alt="분실물" style={{ width: "123px" }} />
                        </NavLink>
                    </div>

                </div>
            </div>




            <div className="row justify-content-center">
                <div className="col-lg-8 mt-4 mb-4" style={{ height: '600px' }}>

                    <table className="table text-center" style={{ height: '50px' }}>
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
                                        <NavLink to={`/personaldetail/${item.personalNo}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => handleTitleClick(item)}><b>{item.personalTitle}</b></NavLink>
                                    </td>
                                    <td>{item.personalId}</td>
                                    <td>
                                        <button className="btn btn-outline-secondary" onClick={() => deletePersonal(item)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination currentPage={currentPage} totalPages={Math.ceil(personals.length / postsPerPage)} paginate={paginate} />

            {/* {selectedPersonal && (
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <WrapComments comments={selectedPersonal.comments} />
                    </div>
                </div>
            )} */}

        </>
    );
};

export default Personal;
