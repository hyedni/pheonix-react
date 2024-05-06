import './AdminMovie.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../utils/CustomAxios";
import { useNavigate, useParams } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";
import { TbPencilCancel } from "react-icons/tb";


function MovieEdit() {
    const { movieNo } = useParams();
    const [movie, setMovie] = useState({
        movieNo: '',
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
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const loadList = useCallback(async () => {
        const resp = await axios.get(`/movie/${movieNo}`);
        setMovie(resp.data);
    }, [movie]);

    useEffect(() => {
        loadList();
    }, []);

    //수정용백업
    const [backup, setBackup] = useState({});
    const [isEdit, setIsEdit] = useState({
        edit: false
    });

    //수정하기버튼클릭
    const editMovie = useCallback(() => {
        setBackup({ ...movie });
        setIsEdit({ edit: true });
    }, [movie]);

    //수정입력
    const changeMovie = useCallback((e) => {
        setMovie({
            ...movie,
            [e.target.name]: e.target.value
        });
    }, [movie]);

    //수정처리
    const saveEditMovie = useCallback(async (movie) => {
        const resp = await axios.patch("/movie/", movie);
        setIsEdit({ edit: false });
        loadList();
    }, [movie]);

    //수정취소
    const cancelEditMenu = useCallback(() => {
        setMovie({ ...backup });
        setIsEdit({ edit: false });
        // clearImagePreview();
        loadList();
    }, [movie]);

    //삭제
    const deleteMovie = useCallback(async (movieNo) => {
        const choice = window.confirm("삭제하려는 영화가 맞으신가요? 정말 삭제하시겠습니까?");
        if (choice === false) return;

        const resp = await axios.delete("/movie/" + movieNo);
        navigate('/adminMovie');
    }, [movie]);

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

    const saveEditPoster = useCallback(async (movieNo) => {
        const formData = new FormData();
        if (file) {
            formData.append("attach", file);
        }
        try {
            await axios.post(`/movie/${movieNo}`, formData);
            clearImagePreview();
            loadList();
        } catch (error) {
            console.error("Failed to submit the form!", error);
        }
    }, [file]);

    return (
        <>
            {/* 페이지 제목 */}
            <br />
            <br />
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    {isEdit.edit === false ? (
                        <>
                            <div className="title-head-text">
                                영화 정보 조회
                                <button className='btn btn-secondary ms-3' onClick={e => editMovie()} style={{ fontWeight: 'bold' }}>수정시작</button>
                                <button className='btn btn-primary ms-3' onClick={e => deleteMovie(movie.movieNo)} style={{ fontWeight: 'bold' }}> 영화삭제 </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="title-head-text">
                                영화 정보 수정
                                <button className='btn btn-primary ms-3' onClick={e => cancelEditMenu()} style={{ fontWeight: 'bold' }}>되돌리기</button>
                                <button className='btn btn-dark ms-3' onClick={e => saveEditMovie(movie)} style={{ fontWeight: 'bold' }}> 수정완료 </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <hr />

            <div className='row'>
                <div className='offset-2 col-lg-8'>

                    <div className='row mt-4'>
                        <div className='col-md-3 me-4' style={{ borderRight: '0.5px solid rgb(197,198,199)' }}>
                            <div className="attach-file">
                                <span style={{ fontSize: '30px', fontWeight: 'bold' }}>포스터</span>
                                {isEdit.edit === true && (
                                    <button onClick={e => saveEditPoster(movieNo)} className='btn btn-secondary mb-2 ms-2' style={{ fontWeight: 'bold' }}>
                                        선택파일 등록
                                    </button>
                                )}
                                <hr />
                                <div className="mt-3" style={{ height: '450px' }}>
                                    <div class="input-group mb-5">
                                        {isEdit.edit === true && (
                                            <input type="file" onChange={handleImageChange} class="form-control" />
                                        )}
                                    </div>
                                    {!imagePreview && (
                                        <img src={movie.movieImgLink} className='img-preview-admin img-thumbnail' alt="Default Preview" />
                                    )}
                                    {imagePreview && (
                                        <div className="img-preview-admin img-thumbnail mt-3">
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                    <div id="imgArea" className="img-preview-admin mt-3"></div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>

                            <div className='row'>
                                <div className='col'>

                                    {isEdit.edit === false ? (
                                        <>
                                            <div className="row">
                                                <div className="col-3" style={{ fontSize: '30px', fontWeight: 'bold' }}>Title</div>
                                                <div className="col-9 input-content" style={{ fontSize: '30px', fontWeight: 'bold' }}>{movie.movieTitle}</div>
                                            </div>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="col-3">관리번호</div>
                                                <div className="col-9 input-content ">{movie.movieNo}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">장르</div>
                                                <div className="col-9 input-content ">{movie.movieGenre}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">러닝타임</div>
                                                <div className="col-9 input-content ">{movie.movieRunningTime} 분</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">감독</div>
                                                <div className="col-9 input-content ">{movie.movieDirector}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">출연진</div>
                                                <div className="col-9 input-content ">{movie.movieActor}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">제작년도</div>
                                                <div className="col-9 input-content ">{movie.movieYear}년</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">개봉일자</div>
                                                <div className="col-9 input-content ">{movie.movieOpenDate}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">상영종료일자</div>
                                                <div className="col-9 input-content ">{movie.movieCloseDate}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">관람등급</div>
                                                <div className="col-9 input-content ">{movie.movieAge}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">제작국</div>
                                                <div className="col-9 input-content ">{movie.movieOrigin}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">현재상영여부</div>
                                                <div className="col-9 input-content ">
                                                    {movie.movieOn === 'Y' ? (
                                                        <span>
                                                            상영중
                                                        </span>
                                                    ) : (
                                                        '상영 종료'
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">자막/더빙</div>
                                                <div className="col-9 input-content ">{movie.movieTranslation}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">출력화면유형</div>
                                                <div className="col-9 input-content ">{movie.movieScreenType}</div>
                                            </div>
                                            <hr></hr>
                                            <div className="row mb-4">
                                                <div className="col-3">줄거리</div>
                                                <div className="col-9 input-content " style={{ whiteSpace: 'pre-wrap' }}>{movie.movieSummary}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="row">
                                                <div className="col-3" style={{ fontSize: '30px', fontWeight: 'bold' }}>Title</div>
                                                <div className='col-9 pt-2'>
                                                    <input className="form-control" type="text" name='movieTitle' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieTitle} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <hr></hr>
                                            <div className="row">
                                                <div className="col-3">관리번호</div>
                                                <div className="col-9 input-content ">{movie.movieNo}</div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">장르</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='movieGenre' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieGenre} onChange={e => changeMovie(e)} />
                                                </div>

                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">러닝타임</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="number" name='movieRunningTime' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieRunningTime} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">감독</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='movieDirector' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieDirector} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">출연진</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='movieActor' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieActor} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">제작년도</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="number" name='movieYear' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieYear} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">개봉일자</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='movieOpenDate' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieOpenDate} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">상영종료일자</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='movieCloseDate' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieCloseDate} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">관람등급</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='movieAge' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieAge} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">제작국</div>
                                                <div className='col-9'>
                                                    <input className="form-control" type="text" name='movieOrigin' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieOrigin} onChange={e => changeMovie(e)} />
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">현재상영여부</div>
                                                <div className='col-9'>
                                                    <select className="form-control" type="text" name='movieOn' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieOn} onChange={e => changeMovie(e)}>
                                                        <option selected>선택하세요</option>
                                                        <option value='N'>개봉 전</option>
                                                        <option value='Y'>상영중</option>
                                                        <option value='X'>상영종료</option>
                                                    </select>
                                                </div>

                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">자막/더빙</div>
                                                <div className='col-9'>
                                                    <select className="form-control" type="text" name='movieTranslation' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieTranslation} onChange={e => changeMovie(e)}>
                                                        <option selected>선택하세요</option>
                                                        <option value='Y'>자막</option>
                                                        <option value='N'>더빙</option>
                                                        <option value='K'>일반(한국영화)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-3">출력화면유형</div>
                                                <div className='col-9'>
                                                    <select className="form-control" type="text" name='movieScreenType' style={{ width: '100%', textAlign: 'center' }}
                                                        value={movie.movieScreenType} onChange={e => changeMovie(e)}>
                                                        <option selected>선택하세요</option>
                                                        <option value="2D">2D</option>
                                                        <option value="3D">3D</option>
                                                        <option value="4D">4D</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <hr></hr>
                                            <div className="row mb-4">
                                                <div className="col-3">줄거리</div>
                                                <div className='col-9'>
                                                    <textarea className="form-control" type="text" name='movieSummary' style={{ width: '100%', height: '300px', whiteSpace: 'pre-wrap' }}
                                                        value={movie.movieSummary} onChange={e => changeMovie(e)}></textarea>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default MovieEdit;