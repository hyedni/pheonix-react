import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import Pagination from './Pagination';
import './Lost.css';
import { useRecoilState } from 'recoil';
import { loginGradeState, loginIdState } from '../utils/RecoilData';
import axios from '../utils/CustomAxios';

const Lost = () => {
    const [losts, setLosts] = useState([]);
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    const [loginGrade, setLoginGrade] = useRecoilState(loginGradeState);
    const [input, setInput] = useState({
        lostTitle: '',
        lostContent: '',
    });
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);

    const loadList = useCallback(async () => {
        try {
            const resp = await axios.get('/lost/');
            setLosts(resp.data);
        } catch (error) {
            console.error('Failed to load lost list!', error);
        }
    }, []);

    useEffect(() => {
        loadList();
    }, [loadList]);

    useEffect(() => {
        setPostsPerPage(12); // 보여지는 데이터의 수를 설정
    }, [losts]);

    const clearInput = () => {
        setInput({
            lostTitle: '',
            lostContent: '',
        });
        setFile(null);
        setImagePreview(null);
    };

    const deleteLost = async (target) => {
        const choice = window.confirm('정말 삭제하시겠습니까?');
        if (choice === false) return;

        try {
            // 관리자인 경우에만 삭제 요청을 보냅니다.
            if (loginGrade === '관리자') {
                await axios.delete('/lost/' + target.lostNo);
                loadList();
            } else {
                alert('관리자만 삭제할 수 있습니다.');
            }
        } catch (error) {
            console.error('Failed to delete lost item!', error);
        }
    };

    const changeInput = (e) => {
        if (e.target.name === 'lostAttach') {
            setFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setInput({
                ...input,
                [e.target.name]: e.target.value,
            });
        }
    };

    const saveInput = useCallback(async () => {
        if (loginGrade !== '관리자') {
            alert('관리자만 분실물을 등록할 수 있습니다.');
            return;
        }

        const formData = new FormData();
        for (const key in input) {
            formData.append(key, input[key]);
        }

        if (file) {
            formData.append('attach', file);
        }

        try {
            const response = await axios.post('/lost/', formData);
            const newLost = response.data;
            setLosts((prevLosts) => [newLost, ...prevLosts]);
            clearInput();
            setErrorMessage(null);
        } catch (error) {
            console.error('Failed to submit the form!', error);
            setErrorMessage('Failed to submit the form!');
        }
    }, [input, file, loginGrade]);

    const handleImageChange = (e) => {
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

    // 현재 페이지에 해당하는 항목들을 가져오는 함수
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = losts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            <br />
            <br />
            <div className="row justify-content-center">
                <div className="col-lg-8 title-head d-flex justify-content-between align-items-center">
                    <div className="title-head-text">분실물 저장소</div>
                    <div>
                        <NavLink to="/personal" className="btn btn-secondary me-4">
                            문의게시판으로 돌아가기
                        </NavLink>
                        <NavLink to="/bunsil" className="btn btn-dark">
                            분실물 등록하기
                        </NavLink>
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8 content-center text-center">
                    <NavLink to="/bunsil" className="btn btn-primary mt-3 mb-3">
                        분실물 등록하기
                    </NavLink>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8 content-head">
                    <div className="row">
                        {currentPosts.map((lost) => (
                            <div key={lost.lostNo} className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{lost.lostTitle}</h5>
                                        <p className="card-text">{lost.lostContent}</p>
                                        {lost.lostImgLink && (
                                            <div className="image-wrapper lost-image">
                                                <img src={lost.lostImgLink} alt="Lost Image" />
                                                <div className="edit-button">
                                                    {/* Your edit button JSX here */}
                                                </div>
                                            </div>
                                        )}
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button className="btn btn-outline-danger" onClick={() => deleteLost(lost)}>
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(losts.length / postsPerPage)}
                paginate={setCurrentPage}
            />
        </>
    );
};

export default Lost;
