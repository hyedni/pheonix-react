import './AdminMovie.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../utils/CustomAxios";
import { useParams } from 'react-router-dom';

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

    const loadList = useCallback(async () => {
        const resp = await axios.get(`/movie/${movieNo}`);
        setMovie(resp.data);
    }, [movie]);

    useEffect(() => {
        loadList();
    }, []);

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

            <div className='row mt-4'>
                <div className='offset-2 col-lg-8'>
                    <table className='table table-hover'>
                        <tbody className='text-center'>
                            <tr className='align-middle'>
                                <td>관리번호</td>
                                <td>{movie.movieNo}</td>
                            </tr>
                            <tr className='align-middle'>
                                <td>장르</td>
                                <td>{movie.movieGenre}</td>
                            </tr>
                            <tr className='align-middle'>
                                <td>러닝타임</td>
                                <td>{movie.movieRunningTime}분</td>
                            </tr>
                            <tr className='align-middle'>
                                <td>제작년도</td>
                                <td>{movie.movieYear}</td>
                            </tr>
                            <tr className='align-middle'>
                                <td>개봉일</td>
                                <td>{movie.movieOpenDate}</td>
                            </tr>
                            <tr className='align-middle'>
                                <td>상영종료일</td>
                                <td>{movie.movieCloseDate}</td>
                            </tr>
                            <tr className='align-middle'>
                                <td>상영등급</td>
                                <td>{movie.movieAge} 관람가</td>
                            </tr>
                            <tr className='align-middle'>
                                <td>제작국</td>
                                <td>{movie.movieOrigin}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    );
}

export default MovieEdit;