import { useRecoilState } from "recoil";
import { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import { loginIdState } from "../utils/RecoilData";
import './join.css';
import Sidebar from "./Sidebar";

function Mypage() {

    const [user, setUser] = useState([]);
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [imagePreview] = useState(null);

    useEffect(() => {
        loadData();
    }, [loginId]);

    //값 출력
    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get(`http://localhost:8080/user/mypage`, {
                params: {
                    userId: loginId
                }
            });
            setUser(resp.data);
        } catch (error) {
            console.error('사용자 정보를 불러오는 중 오류가 발생했습니다:', error);
        }
    }, []);

    // 함수 정의
    function changeName() {
        // 새 이름을 받는다 (예를 들어, 사용자에게 입력 받는다)
        var newName = prompt("새로운 이름을 입력하세요:");

        // 새 이름이 유효한지 확인한다
        if (newName !== null && newName !== "") {
            // 새 이름을 설정한다
            setUser({ ...user, userName: newName });
        }
    }
    return (
        <>
            <div className="row justify-content-center mt-4">
                <div className="col-lg-10 title-head">
                    <div className="card mb-3" key={user.userId}>
                        <div className="card-header">
                            <div className="profile-header">
                                <div className="profile-img-container">
                                    <img className="profile-img" src={user.userImgLink} alt="프로필이미지" />
                                </div>
                                <div className="profile-info">
                                    <div className="info-wrapper">
                                        <h4 className="card-title" onClick={changeName}>{user.userName}</h4>
                                        <p className="userId">{user.userId}</p>
                                    </div>
                                    <hr></hr>
                                    <p className="card-text">등급: {user.userGrade}</p>
                                    <p className="card-text">포인트: {user.userPoint}</p>
                                </div>
                            </div>


                            <div className="profile-header d-flex justify-content-center"> {/* 가운데 정렬 */}
                               {/* 텍스트 가운데 정렬 */}
                                    <h3>MY COUPON</h3>
                                    <h3>PHEONIX POINT</h3>
                                    <h3>자주가는 PHEONIX</h3>

                            </div>


                        </div>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center mt-2">
                <div className="col-lg-10">
                    <Sidebar />
                </div>
            </div>



        </>

    )
}

export default Mypage;