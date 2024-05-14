import React, { useCallback, useEffect, useState } from "react";
import axios from "../utils/CustomAxios";
import { useParams } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil"; 
import { loginIdState } from "../utils/RecoilData";


export default function MyPersonal() {
    const [ userId ] = useRecoilState(loginIdState);
    const [personals, setPersonals] = useState([]);
    const loginId = useRecoilValue(loginIdState); 

    useEffect(() => {
        loadData();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const response = await axios.get(`/personal/mypersonal/${userId}`);
            console.log(response.data);
            setPersonals(response.data); 
        } catch (error) {
            console.error('Error fetching personal list:', error);
        }
    }, [userId]); // 이 부분에서 중괄호를 닫아주어야 합니다.

    return (
        <div>
            <h2>나의 문의내역</h2>
            <table className="table">
                <thead>
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
                            <td>{personal.personalTitle}</td>
                            <td>{personal.personalContent}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
