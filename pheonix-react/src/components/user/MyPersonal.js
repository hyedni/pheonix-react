import React, { useCallback, useEffect, useState } from "react";
import axios from "../utils/CustomAxios";
import { Link } from "react-router-dom"; // Link import 추가
import { useRecoilState, useRecoilValue } from "recoil"; 
import { loginIdState } from "../utils/RecoilData";

const MyPersonal = () => {
    const [userId] = useRecoilState(loginIdState);
    const [personals, setPersonals] = useState([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const response = await axios.get(`/personal/mypersonal/${userId}`);
            setPersonals(response.data); 
        } catch (error) {
            console.error('Error fetching personal list:', error);
        }
    }, [userId]);

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
                                </tr>
                            </thead>
                            <tbody>
                                {personals.map(personal => (
                                    <tr key={personal.personalNo}>
                                        <td>{personal.personalNo}</td>
                                        <td>
                                            {/* Link를 사용하여 personalDetail 페이지로 이동하는 링크 추가 */}
                                            <Link to={`/personalDetail/${personal.personalNo}`}>
                                                {personal.personalTitle}
                                            </Link>
                                        </td>
                                        <td>{personal.personalContent}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPersonal;
