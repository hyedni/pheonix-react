import '../admin/AdminMovie.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from "../utils/CustomAxios";
import { Link, useLinkClickHandler, useNavigate, useNavigation } from 'react-router-dom';
import { TbNumber12Small } from "react-icons/tb";
import { TbNumber15Small } from "react-icons/tb";
import { TbNumber19Small } from "react-icons/tb";
import { FaCirclePlus } from "react-icons/fa6";


function MovieChart() {
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

    const navigate = useNavigate();
    const moveToDetail = (movieNo) => {
        navigate(`/movieEdit/${movieNo}`);
    };

    //관람등급 아이콘
    const getAgeIcon = (movieAge) => {
        switch (movieAge) {
            case '12세 이상':
                return <TbNumber12Small style={{ fontSize: '30px', backgroundColor: 'yellow', borderRadius: '10px' }} />;
            case '15세 이상':
                return <TbNumber15Small style={{ fontSize: '30px', backgroundColor: 'orange', borderRadius: '10px' }} />;
            case '청소년관람불가':
                return <TbNumber19Small style={{ fontSize: '30px', backgroundColor: 'red', borderRadius: '10px' }} />;
            case '전체관람가':
                return <span style={{ fontSize: '15px', color: 'white', fontWeight: 'bold', backgroundColor: 'green', borderRadius: '10px', width: '10px', padding: '5px' }}>all</span>;
        }
    };


    //예매율

    const today = new Date();
    function toChar() {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); 
        const day = String(today.getDate()).padStart(2, '0'); 
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    const [reserveData, setReserveData] = useState({});
    const getRate = useCallback(async (movieNo, reserveStatsDate) => {
        const resp = await axios.post("/movie/stats", { movieNo, reserveStatsDate });
        // setReserveData(resp.data);
        return resp.data;
    }, []);

    //리스트
    const loadList = useCallback(async () => {
        const date = toChar();
        const resp = await axios.get("/movie/");
        const moviesData = resp.data;
        for (const movie of moviesData) {
            const result = await getRate(movie.movieNo, date);
            const rate = result.reserveStatsRate; 
            movie.rate =rate; 
        }
        setMovies(moviesData);
        setIsClicked(false);
    }, [movies]);

    useEffect(() => {
        loadList();
    }, []);

    const [isClicked, setIsClicked] = useState(false);

    const loadOnList = useCallback(async () => {
        const resp = await axios.get("/movie/on");
        const moviesData = resp.data;
        setMovies(resp.data);
        setIsClicked(true);
    }, [movies]);

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        무비차트
                        {isClicked ? (
                            <>
                                <button className='btn movie-button' onClick={e => loadList()}>현재 상영작만 보기</button>
                            </>
                        ) : (
                            <>
                                <button className='btn movie-button' onClick={e => loadOnList()}>상영 예정작 보기</button>
                            </>
                        )}
                    </div>
                    <hr />
                </div>
            </div>

            <div className="row">
                <div className="offset-2 col-lg-9">
                    <br />
                    <div className="row">
                        {movies.map((movie) => (
                            <div className="col-md-3 item-wrapper mb-5" key={movie.movieNo}>
                                <div className='admin-flex-box mt-2'>
                                    <input type="hidden" value={movie.movieNo} />
                                    <span style={{ fontSize: '20px', fontWeight: 'bold' }} className='ms-2'>{movie.movieTitle}</span>
                                    <span> {getAgeIcon(movie.movieAge)}</span>
                                </div>
                                <hr />
                                <div className='image-wrapper'>
                                    <img src={movie.movieImgLink} className='img-thumbnail' />
                                    <Link to="/booking" className='edit-button btn btn-primary'>
                                        예매하기
                                    </Link>
                                    <button onClick={e => moveToDetail(movie.movieNo)} className='delete-button btn btn-secondary' style={{ margin: '0px' }}>
                                        상세정보
                                    </button>
                                </div>
                                <hr />
                                <div className='d-flex justify-content-between mb-2'>
                                    <div>
                                        <span style={{ fontWeight: 'bold', color: 'gray' }}>{movie.movieOpenDate} 개봉</span>
                                    </div>
                                    <div>
                                        <span style={{ fontWeight: 'bold', color: 'red' }}>{movie.movieOn === 'Y' ? '절찬상영중' : ''} </span>
                                    </div>
                                </div>
                                <div className='d-flex justify-content-between mb-2'>
                                    {isClicked ? (
                                        <>
                                            <span style={{ fontWeight: 'bold', color: 'gray' }}></span>
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ fontWeight: 'bold', color: 'gray' }}>예매율 {movie.rate.toFixed(2)}%</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </>
    );
}

export default MovieChart;