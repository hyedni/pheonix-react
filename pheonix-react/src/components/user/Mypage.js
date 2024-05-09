import { useRecoilState } from "recoil";
import { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import { loginIdState } from "../utils/RecoilData";

function Mypage() {

    const [user, setUser] = useState([]);
    const [loginId, setLoginId] = useRecoilState(loginIdState);

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

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-lg-8 title-head">
                    <div className="card mb-3" key={user.userId}>
                        <div className="card-header">
                            {user.userName}
                        </div>
                        <div className="card-body">
                            <img src={user.profileImageUrl} alt="사용자 프로필" className="card-img-top" />
                            <h5 className="card-title">{user.userId}</h5>
                            <p className="card-text">등급: {user.userGrade}</p>
                            <p className="card-text">포인트: {user.userPoint}</p>
                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default Mypage;