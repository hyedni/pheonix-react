import './AdminMovie.css';
import layout from './../../design/layout';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../utils/CustomAxios";
import { Modal } from 'bootstrap';
import { Link, useLinkClickHandler } from 'react-router-dom';
import nullImg from '../image/attachNull.png';

function AdminMovie() {
    const [movies, setMovies] = useState([]);
    const [input, setInput] = useState({
        movieTitle: '',
        movieGenre: '',
        movieRunningTime: '',
        movieYear: '',
        movieOpenDate: '',
        movieCloseDate: '',
        movieAge: '',
        movieOrigin: '',
        movieOn: '',
        movieSummary: '',
        movieTranslation: '',
        movieScreenType: '',
        movieDirector: '',
        movieActor: ''
    });
    //첨부파일관련
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const loadList = useCallback(async() => {
        const resp = await axios.get("/movie/");
        setMovies(resp.data);
        console.log(resp.data);
    }, [movies]);

    useEffect(() => {
        loadList();
    }, []);

    // const cancelInput = useCallback(() => {
    //     setInput({
    //         movieTitle: '',
    //         movieGenre: '',
    //         movieRunningTime: '',
    //         movieYear: '',
    //         movieOpenDate: '',
    //         movieCloseDate: '',
    //         movieAge: '',
    //         movieOrigin: '',
    //         movieOn: '',
    //         movieSummary: '',
    //         movieTranslation: '',
    //         movieScreenType: '',
    //         movieDirector: '',
    //         movieActor: '',
    //     });
    //     closeModal();
    // }, [input]);

    // //등록
    // const changeInput = useCallback(async (e) => {
    //     setInput({
    //         ...input,
    //         [e.target.name]: e.target.value
    //     });
    // }, [input]);

    // //등록처리 (FormData에 객체에 파일과 input값을 함께 담아 전송)
    // const saveInput = useCallback(async () => {
    //     const formData = new FormData();
    //     // 'input' 객체의 각 키와 값을 FormData에 추가
    //     for (const key in input) {
    //         formData.append(key, input[key]);
    //     }
    //     // 파일도 FormData에 추가
    //     if (file) {
    //         formData.append("attach", file);
    //     }

    //     try {
    //         await axios.post("/movie/", formData);
    //         loadList();  // 목록 새로고침
    //         cancelInput();  // 입력 필드 초기화
    //         closeModal();  // 모달 닫기
    //     } catch (error) {
    //         console.error("Failed to submit the form!", error);
    //     }
    // }, [input, file]);

    // //첨부파일관련
    // const clearImagePreview = () => {
    //     setImagePreview(null);
    // };

    // const handleImageChange = e => {
    //     const file = e.target.files[0];
    //     const reader = new FileReader();
    //     reader.onloadend = () => {
    //         setImagePreview(reader.result);
    //     };
    //     if (file) {
    //         setFile(file);
    //         reader.readAsDataURL(file);
    //     }
    // };

    return (
        <>
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        영화 관리
                        <Link to="/newMovie" className="btn btn-primary ms-5">
                             신규 영화 등록
                        </Link>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="offset-2 col-lg-8">
                    <br />
                    <div className="row">
                        {movies.map((movie) => (
                            <div className="col-md-3 item-wrapper mb-5" key={movie.movieNo}>
                                <div className='admin-flex-box mt-2'>
                                    <input type="hidden" value={movie.movieNo} />
                                    <span style={{ fontSize: '20px', fontWeight:'bold'}} className='ms-2'>{movie.movieTitle}</span>
                                    <Link to={`/movieEdit/${movie.movieNo}`} className='btn  btn-outline-primary'>수정하기</Link>
                                </div>
                                <hr />
                                <div className='image-wrapper'>
                                    <img src={movie.movieImgLink} />
                                </div>
                                <hr />
                                <div className='content-wrapper'>
                                    <span>개봉일 {movie.movieOpenDate}</span> 
                                    <br/>
                                    <span>{movie.movieOn === 'Y' ? '상영중' : '미개봉'} </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminMovie;