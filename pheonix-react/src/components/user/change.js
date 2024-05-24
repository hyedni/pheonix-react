import axios from "../utils/CustomAxios";
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

    const [isValid, setIsValid] = useState({
        userId: true,
        userNick: true,
        userName: true,
        userContact: true,
        userEmail: true
    });
    const [isFormValid, setIsFormValid] = useState(false);

    //수정용백업
    const [backup, setBackup] = useState({});
    const [isEdit, setIsEdit] = useState({
        edit: false
    });

    //수정입력
    const handleInputBlur = useCallback((e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }, [user]);

    //수정처리
    const saveEditUser = useCallback(async (user) => {
        if (isFormValid) {
            const resp = await axios.patch(`/user/edit`, user);
            setIsEdit({ edit: false });
            loadData();
        } else {
            console.log("실패");
        }
    }, [isFormValid, user]);

    //첨부파일관련
    const clearImagePreview = () => {
        setImagePreview(null);
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            setFile(file);
            reader.readAsDataURL(file);
        }
    };
    const saveEditPoster = useCallback(async ()=> {
        const formData = new FormData();
        if (file) {
            formData.append("attach", file);
        }
        try {
            await axios.post(`/user/editFile`, formData);
            clearImagePreview();
            loadData();
        } catch (error) {
            console.error("Failed to submit the form!", error);
        }
    }, [file]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    //수정취소
    const cancelEditUser = useCallback(() => {
        setUser({ ...backup });
        setIsEdit({ edit: false });
        clearImagePreview();
        loadData();
    }, [backup]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isFormValid) {
            await saveEditUser(user);
        } else {
            console.log("실패");
        }
        //console.log("변경된 개인정보:", user);
    };

    // 양식 유효성 확인 함수
    const validateForm = useCallback(() => {
        // 아이디 유효성 검사
        const idPattern = /^[a-z][a-z0-9]{7,19}$/;
        const isIdValid = idPattern.test(user.userId);
        setIsValid(prevState => ({ ...prevState, userId: isIdValid }));

        // 비밀번호 유효성 검사
        const pwPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$])[A-Za-z0-9!@#$]{6,15}$/;
        const isPwValid = pwPattern.test(user.userPw);
        setIsValid(prevState => ({ ...prevState, userPw: isPwValid }));

        // 닉네임 유효성 검사
        const isNickValid = !user.userNick || /^[가-힣a-zA-Z]{2,10}$/.test(user.userNick);
        setIsValid(prevState => ({ ...prevState, userNick: isNickValid }));

        // 이름 유효성 검사
        const namePattern = /^[가-힣a-zA-Z]{2,10}$/;
        const isNameValid = namePattern.test(user.userName);
        setIsValid(prevState => ({ ...prevState, userName: isNameValid }));

        // 연락처 유효성 검사
        const isContactValid = !user.userContact || /^010[1-9][0-9]{3}[0-9]{4}$/.test(user.userContact);
        setIsValid(prevState => ({ ...prevState, userContact: isContactValid }));

        // 이메일 유효성 검사
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isEmailValid = emailPattern.test(user.userEmail);
        setIsValid(prevState => ({ ...prevState, userEmail: isEmailValid }));

        // 모든 유효성 검사를 통과했는지 확인
        const isValid =
            isIdValid &&
            isPwValid &&
            isNickValid &&
            isNameValid &&
            isContactValid &&
            isEmailValid;

        return isValid;
    }, [user]);

    useEffect(() => {
        loadData();
    }, [loginId]);

    useEffect(() => {
        setIsFormValid(validateForm());
    }, [user, validateForm]);

    //값 출력
    const loadData = useCallback(async () => {
        try {
            const resp = await axios.get(`/user/mypage`, {
                params: {
                    userId: loginId
                }
            });
            setUser(resp.data);
        } catch (error) {
            console.error('사용자 정보를 불러오는 중 오류가 발생했습니다:', error);
        }
    }, [loginId]);

    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">개인정보 변경</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="attach-file">
                                        <span style={{ fontSize: '30px', fontWeight: 'bold' }}>포스터</span>
                                        {isEdit.edit === true && (
                                            <button onClick={saveEditPoster} className='btn btn-secondary mb-2 ms-2' style={{ fontWeight: 'bold' }}>
                                                선택파일 등록
                                            </button>
                                        )}
                                        <hr />
                                        <div className="mt-3" style={{ height: '450px' }}>
                                            <div class="input-group mb-5">
                                                <input type="file" onChange={handleImageChange} class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                                            </div>
                                            {!imagePreview && (
                                                <img src={user.userImgLink} className=' img-thumbnail' alt="프로필 이미지" />
                                            )}
                                            {imagePreview && (
                                                <div className="img-preview img-thumbnail mt-3">
                                                    <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                                </div>
                                            )}
                                            <div id="imgArea" className="img-preview mt-3"></div>
                                        </div>

                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="userName" className="form-label">이름</label>
                                        <input
                                            type="text"
                                            id="userName"
                                            name="userName"
                                            value={user.userName}
                                            onBlur={handleInputBlur}
                                            onChange={handleChange}
                                            className={`form-control ${user.userName && !isValid.userName ? "is-invalid" : ""}`}
                                        />
                                        {user.userName && !isValid.userName && (
                                            <div className="invalid-feedback">
                                                이름이 유효하지 않습니다.
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="userNick" className="form-label">닉네임</label>
                                        <input
                                            type="text"
                                            id="userNick"
                                            name="userNick"
                                            value={user.userNick}
                                            onBlur={handleInputBlur}
                                            onChange={handleChange}
                                            className={`form-control ${user.userNick && !isValid.userNick ? "is-invalid" : ""}`}
                                        />
                                        {user.userNick && !isValid.userNick && (
                                            <div className="invalid-feedback">
                                                닉네임이 유효하지 않습니다.
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="userContact" className="form-label">전화번호</label>
                                        <input
                                            type="text"
                                            id="userContact"
                                            name="userContact"
                                            value={user.userContact}
                                            onBlur={handleInputBlur}
                                            onChange={handleChange}
                                            className={`form-control ${user.userContact && !isValid.userContact ? "is-invalid" : ""}`}
                                        />
                                        {user.userContact && !isValid.userContact && (
                                            <div className="invalid-feedback">
                                                전화번호가 유효하지 않습니다.
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="userEmail" className="form-label">이메일</label>
                                        <input
                                            type="email"
                                            id="userEmail"
                                            name="userEmail"
                                            value={user.userEmail}
                                            onBlur={handleInputBlur}
                                            onChange={handleChange}
                                            className={`form-control ${user.userEmail && !isValid.userEmail ? "is-invalid" : ""}`}
                                        />
                                        {user.userEmail && !isValid.userEmail && (
                                            <div className="invalid-feedback">
                                                이메일 정보가 유효하지 않습니다.
                                            </div>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="userBirth" className="form-label">생년월일</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="userBirth"
                                            name="userBirth"
                                            value={user.userBirth}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button className='btn btn-dark ms-3' type="submit" style={{ fontWeight: 'bold' }} disabled={!isFormValid}>수정완료</button>
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
