import './AdminMovie.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../utils/CustomAxios";
import { Link, useLinkClickHandler } from 'react-router-dom';
import { CiEdit } from "react-icons/ci";



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

    const loadList = useCallback(async () => {
        const resp = await axios.get("/movie/");
        setMovies(resp.data);
    }, [movies]);

    useEffect(() => {
        loadList();
    }, []);

    //삭제
    const deleteMovie = useCallback(async (target) => {
        const choice = window.confirm("삭제하려는 영화가 맞으신가요? 정말 삭제하시겠습니까?");
        if (choice === false) return;

        const resp = await axios.delete("/movie/" + target.movieNo);
        loadList();
    }, [movies]);

    return (
        <>
            <br />
            <br />
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
            <hr/>

            <div className="row">
                <div className="offset-2 col-lg-8">
                    <br />
                    <div className="row">
                        {movies.map((movie) => (
                            <div className="col-md-3 item-wrapper mb-5" key={movie.movieNo}>
                                <div className='admin-flex-box mt-2'>
                                    <input type="hidden" value={movie.movieNo} />
                                    <span style={{ fontSize: '20px', fontWeight: 'bold' }} className='ms-2'>{movie.movieTitle}</span>
                                </div>
                                <hr />
                                <div className='image-wrapper'>
                                    <img src={movie.movieImgLink} className='img-thumbnail' />
                                    <Link to={`/movieEdit/${movie.movieNo}`} className='edit-button btn btn-secondary'>
                                        조회/수정
                                    </Link>
                                    <button onClick={e => deleteMovie(movie)} className='delete-button btn btn-primary'>
                                        바로삭제
                                    </button>
                                </div>
                                <hr />
                                <div className='content-wrapper'>
                                    <span>개봉일 {movie.movieOpenDate}</span>
                                    <br />
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