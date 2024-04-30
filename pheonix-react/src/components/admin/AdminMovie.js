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


    // const fetchMoviesAndImages = async () => {
    //     try {
    //         const response = await axios.get("/movie/");
    //         const moviesData = response.data;

    //         const imageUrls = await Promise.all(moviesData.map(async (movie) => {
    //             try {
    //                 // 파일 이름 또는 경로 부분을 encodeURIComponent로 인코딩
    //                 // const encodedImageName = encodeURIComponent(movie.movieNo);
    //                 const imgResponse = await axios.get(`/movie/image/${movie.movieNo}`);
    //                 return imgResponse.url; // 이미지 URL 반환
    //             } catch (error) {
    //                 console.error("Failed to fetch image:", error);
    //                 return nullImg; // 오류 시 기본 이미지 URL 반환
    //             }
    //         }));
            
    //         const moviesWithImages = moviesData.map((movie, index) => ({
    //             ...movie,
    //             imageUrl: imageUrls[index]
    //         }));

    //         setMovies(moviesWithImages); // 영화 목록과 이미지 URL을 함께 설정
    //     } catch (error) {
    //         console.error("Failed to fetch movies", error);
    //     }
    // };

    // useEffect(() => {
    //     fetchMoviesAndImages();
    // }, [])

    const cancelInput = useCallback(() => {
        setInput({
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
            movieActor: '',
        });
        closeModal();
    }, [input]);

    //등록
    const changeInput = useCallback(async (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    //등록처리 (FormData에 객체에 파일과 input값을 함께 담아 전송)
    const saveInput = useCallback(async () => {
        const formData = new FormData();
        // 'input' 객체의 각 키와 값을 FormData에 추가
        for (const key in input) {
            formData.append(key, input[key]);
        }
        // 파일도 FormData에 추가
        if (file) {
            formData.append("attach", file);
        }

        try {
            await axios.post("/movie/", formData);
            loadList();  // 목록 새로고침
            cancelInput();  // 입력 필드 초기화
            closeModal();  // 모달 닫기
        } catch (error) {
            console.error("Failed to submit the form!", error);
        }
    }, [input, file]);

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

    //모달
    const bsModal = useRef();
    const openModal = useCallback(() => {
        clearImagePreview();
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);
    const closeModal = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    return (
        <>
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        영화 관리
                        <button className="btn btn-primary ms-5" onClick={e => openModal()}>신규 영화 등록</button>
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

            {/* Modal */}
            <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">신규 영화 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close"
                                onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 화면 */}

                            <div className="attach-file">
                                <label>포스터</label>
                                <div className="mt-3">
                                    <input type="file" onChange={handleImageChange} />
                                    {imagePreview && (
                                        <div className="img-preview mt-3">
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                    <div id="imgArea" className="img-preview mt-3"></div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>영화명</label>
                                    <input type="text" name="movieTitle"
                                        value={input.movieTitle}
                                        onChange={e => changeInput(e)} className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>장르</label>
                                    <input type="text" name="movieGenre"
                                        value={input.movieGenre}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>러닝타임</label>
                                    <input type="text" name="movieRunningTime"
                                        value={input.movieRunningTime}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>제작년도</label>
                                    <input type="text" name="movieYear"
                                        value={input.movieYear}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>개봉일</label>
                                    <input type="date" name="movieOpenDate"
                                        value={input.movieOpenDate}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>상영종료일</label>
                                    <input type="date" name="movieCloseDate"
                                        value={input.movieCloseDate}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>상영등급</label>
                                    <input type="text" name="movieAge"
                                        value={input.movieAge}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>제작국가</label>
                                    <input type="text" name="movieOrigin"
                                        value={input.movieOrigin}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>감독</label>
                                    <input type="text" name="movieDirector"
                                        value={input.movieDirector}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>배우</label>
                                    <input type="text" name="movieActor"
                                        value={input.movieActor}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>현재 상영 여부</label>
                                    <input type="text" name="movieOn"
                                        value={input.movieOn}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>줄거리</label>
                                    <input type="text" name="movieSummary"
                                        value={input.movieSummary}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>자막/더빙 여부</label>
                                    <input type="text" name="movieTranslation"
                                        value={input.movieTranslation}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>스크린 타입</label>
                                    <input type="text" name="movieScreenType"
                                        value={input.movieScreenType}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-light me-2' onClick={e => saveInput()}>
                                등록
                            </button>
                            <button className='btn btn-primary' onClick={e => cancelInput()}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminMovie;