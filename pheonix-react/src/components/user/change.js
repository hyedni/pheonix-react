import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { loginIdState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router";

function Change() { 
    const [loginId, setLoginId] = useRecoilState(loginIdState);

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        userName: "",
        userId: "",
        userContact: "",
        userEmail: "",
        userBirth: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 변경된 개인정보를 서버로 전송하는 작업을 수행합니다.
        // axios.put 또는 axios.post 등을 사용하여 서버로 전송할 수 있습니다.
        console.log("변경된 개인정보:", user);
    };
   

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
             <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">개인정보 변경</h5>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="userName" className="form-label">이름</label>
                                    <input type="text" className="form-control" id="userName" name="userName" value={user.userName} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="userNick" className="form-label">닉네임</label>
                                    <input type="text" className="form-control" id="userNick" name="userNick" value={user.userNick} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="userContact" className="form-label">전화번호</label>
                                    <input type="text" className="form-control" id="userContact" name="userContact" value={user.userContact} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="userEmail" className="form-label">이메일</label>
                                    <input type="email" className="form-control" id="userEmail" name="userEmail" value={user.userEmail} onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="userBirth" className="form-label">생년월일</label>
                                    <input type="date" className="form-control" id="userBirth" name="userBirth" value={user.userBirth} onChange={handleChange} />
                                </div>
                                <button type="submit" className="btn btn-primary">저장</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

export default Change;
