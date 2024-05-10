import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useState } from "react";
import { NavLink } from 'react-router-dom';
import Pagination from './Pagination';
import './Lost.css';

const Lost = () => {
    const [losts, setLosts] = useState([]);
    const [input, setInput] = useState({
        lostTitle: "",
        lostContent: "",
    });
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(12);

    const loadList = useCallback(async () => {
        try {
            const resp = await axios.get("/lost/");
            setLosts(resp.data);
        } catch (error) {
            console.error("Failed to load lost list!", error);
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
            lostTitle: "",
            lostContent: "",
        });
        setFile(null);
        setImagePreview(null);
    };

    const deleteLost = async (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;

        try {
            await axios.delete("/lost/" + target.lostNo);
            loadList();
        } catch (error) {
            console.error("Failed to delete lost item!", error);
        }
    };

    const changeInput = (e) => {
        if (e.target.name === "lostAttach") {
            setFile(e.target.files[0]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setInput({
                ...input,
                [e.target.name]: e.target.value
            });
        }
    };

    const saveInput = useCallback(async () => {
        const formData = new FormData();
        for (const key in input) {
            formData.append(key, input[key]);
        }

        if (file) {
            formData.append("attach", file);
            try {
                const response = await axios.post("/lost/", formData);
                const newLost = response.data;
                setLosts(prevLosts => [newLost, ...prevLosts]);
                clearInput();
                setErrorMessage(null);
            } catch (error) {
                console.error("Failed to submit the form!", error);
                setErrorMessage("Failed to submit the form!");
            }
        }
    }, [input, file]);

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

    const cancelInput = () => {
        if (!file && errorMessage) {
            const choice = window.confirm("작성을 취소하시겠습니까?");
            if (choice === false) return;
        }
        clearInput();
    };

    // 현재 페이지에 해당하는 항목들을 가져오는 함수
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = losts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <>
            <div className="row justify-content-center">
                <div className="col-lg-8  content-head">
                    <div className="content-head-text">
                        분실물 저장소예욤
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body">
                    <div className="content-body-text">
                        분실물 저장소라니께
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-lg-8  content-center text-center">
                    <NavLink to="/bunsil" className="btn btn-primary mt-3 mb-3">분실물 등록하기</NavLink>
                </div>
            </div>


            <div className="row justify-content-center">
                <div className="col-lg-8  content-head">
                    <div className="row">
                        {currentPosts.map((lost, index) => (
                            <div key={lost.lostNo} className="col-lg-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{lost.lostTitle}</h5>
                                        <p className="card-text">{lost.lostContent}</p>
                                        {lost.lostImgLink && (
                                            <div className="card-image">
                                                <img src={lost.lostImgLink} alt="Lost Image" />
                                            </div>
                                        )}
                                        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                            <button className="btn btn-outline-danger" onClick={() => deleteLost(lost)}>삭제</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row justify-content-center">
                <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(losts.length / postsPerPage)}
                    paginate={setCurrentPage}
                />
                <NavLink to="/personal" className="btn btn-secondary btn-sm mt-1 mr-1">문의게시판으로 돌아가기</NavLink>
            </div>
        </>
    );
};

export default Lost;
