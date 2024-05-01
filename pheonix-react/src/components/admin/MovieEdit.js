import './AdminMovie.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../utils/CustomAxios";
import { useNavigate, useParams } from 'react-router-dom';

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

    //삭제
    const deleteMovie = useCallback(async (movieNo) => {
        const choice = window.confirm ("삭제하려는 영화가 맞으신가요? 정말 삭제하시겠습니까?");
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

    return (
        <>
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        영화 데이터 수정
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='offset-2 col-lg-8'>

                    <div className='row mt-4'>
                        <div className='col-md-3 me-4' style={{ borderRight: '0.5px solid rgb(197,198,199)' }}>
                            <div className="attach-file">
                                <span style={{ fontSize: '30px', fontWeight: 'bold' }}>포스터</span>
                                <hr />
                                <div className="mt-3">
                                    <div class="input-group mb-5">
                                        <input type="file" onChange={handleImageChange} class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                                    </div>
                                    {!imagePreview && (
                                        <img src={movie.movieImgLink} className='img-preview img-thumbnail' alt="Default Preview" />
                                    )}
                                    {imagePreview && (
                                        <div className="img-preview img-thumbnail mt-3">
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                    <div id="imgArea" className="img-preview mt-3"></div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>

                            <div className='row'>
                                <div className='col'>
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
                                    <div className="row mt-3s">
                                        <div className="col-3">줄거리</div>
                                        <div className="col-9 input-content ">{movie.movieSummary}</div>
                                    </div>

                                    <button onClick={e => deleteMovie(movie.movieNo)}className='delete-button btn btn-primary'>
                                        삭제하기
                                    </button>

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