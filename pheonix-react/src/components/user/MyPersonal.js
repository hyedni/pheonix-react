import React, { useCallback, useEffect, useState } from "react";
import axios from "../utils/CustomAxios";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import Pagination from "../service/Pagination";

const MyPersonal = () => {
    const [mypersonals, setMypersonals] = useState([]);
    const [userId] = useRecoilState(loginIdState);
    const [personals, setPersonals] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(12);

    const loadData = useCallback(async () => {
        try {
            const response = await axios.get(`/personal/mypersonal/${userId}`);
            setPersonals(response.data);
        } catch (error) {
            console.error('Error fetching personal list:', error);
        }
    }, [userId]);

    useEffect(() => {
        loadData();
    }, [loadData]); // Corrected dependency array

    useEffect(() => {
        setMypersonals(personals);
    }, [personals]);


    const deleteMypersonal = (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if(choice === false) return;

        axios.delete("/personal/"+target.personalNo)
        .then(()=> {
            const updatedPersonals = personals.filter(item=>item.personalNo!==target.personalNo);
            setPersonals(updatedPersonals);
        })
        .catch(error=> {
            console.error("Failed to delete personal item!", error);
        });
    }

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = mypersonals.slice(indexOfFirstPost, indexOfLastPost); // Changed to mypersonals

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <h2 className="mt-5 mb-4">나의 문의내역</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th scope="col">번호</th>
                                    <th scope="col">제목</th>
                                    <th scope="col">내용</th>
                                    <th scope="col">삭제</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentPosts.map(personal => (
                                    <tr key={personal.personalNo}>
                                        <td>{personal.personalNo}</td>
                                        <td>
                                            <Link to={`/personalDetail/${personal.personalNo}`}>
                                                {personal.personalTitle}
                                            </Link>
                                        </td>
                                        <td>{personal.personalContent}</td>
                                   
                                    <td>
                                        <button className="btn btn-danger" onClick={() => deleteMypersonal(personal)}>삭제</button>
                                    </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(mypersonals.length / postsPerPage)}
                    paginate={setCurrentPage}
                />
            </div>
        </div>
    );
}

export default MyPersonal;
