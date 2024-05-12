import { useLinkClickHandler } from "react-router-dom";
import Pagination from "../service/Pagination";
import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useState, useRef } from 'react';



function MovieSchedule() {

    const [schedules, setSchedules] = useState([]);
    const [insertData, setInsertData] = useState({});
    const [input, setInput] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = schedules.slice(indexOfFirstPost, indexOfLastPost);

    const loadList = useCallback(async (input) => {
        const resp = await axios.post("/movieSchedule/", input);
        setSchedules(resp.data);
    }, [schedules]);

    useEffect(() => {
        loadList();
    }, []);

    const moveToStart = e => {
        loadList();
    };

    const cancelInput = useCallback(() => {
        setInput({
            cinemaName: '',
            movieTitle: '',
            startDate: ''
        });
    }, [input]);

    const changeInput = useCallback((e) => {
        setInput({
            [e.target.name]: e.target.value
        });
    }, [input]);

    const search = useCallback(() => {
        loadList({ ...input });
        cancelInput();
    }, [input]);

    const [movies, setMovies] = useState([]);
    const movieList = useCallback(async () => {
        const resp = await axios.get("/movieSchedule/movieList");
        setMovies(resp.data);
    }, [movies]);

    const insert = useCallback(() => {
        movieList();
        cinemaList();
    }, []);

    const getTotalSeats = useCallback(async (target)=>{
        const resp = await axios.get(`/movieSchedule/seats/${target}`)
        setInsertData({
            ...insertData,
            remainingSeats:resp.data
        });
    },[insertData]);

    const [cinemas, setCinemas] = useState([]);
    const cinemaList = useCallback(async () => {
        const resp = await axios.get("/movieSchedule/cinemaList");
        setCinemas(resp.data);
    }, [cinemas]);

    const [theaters, setTheaters] = useState([]);
    const theaterList = useCallback(async (target)=>{
        const resp = await axios.get(`/movieSchedule/theaterList/${target}`);
        setTheaters(resp.data);
        console.log(theaters);
    },[theaters]);

    const loadTheaterList = useCallback((target)=>{
        console.log(target);
        theaterList(target);
    },[theaters]);

    const saveData = useCallback((e) => {
        setInsertData({
            ...insertData,
            [e.target.name]: e.target.value
        });
        if(e.target.name === "theaterNo") {
            getTotalSeats(e.target.value);
            setInsertData({
                ...insertData,
                theaterNo: e.target.value
            });
        }
    }, [insertData]);

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        상영 일정 관리
                        <span style={{ fontSize: '15px', fontWeight: 'normal', marginLeft: '10px' }}> 검색어를 입력하여 원하는 조건의 상영일정을 찾으세요! </span>
                        <span style={{ marginLeft: '230px' }}><button className="btn btn-primary" onClick={e => insert(e)}>일정등록</button></span>
                        <span style={{ marginLeft: '10px' }}><button className="btn btn-dark" onClick={e => moveToStart(e)}>처음으로</button></span>
                    </div>
                    <hr />
                </div>
            </div>

            <div className="row">
                <div className="offset-2 col-md-8">

                    <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">영화</label>
                    <div className="row">
                        {movies.map((movie, index) => (
                            <div key={index} className="col-md-2"> {/* 각 라디오 버튼을 포함하는 열 */}
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="movieNo" value={movie.MOVIE_NO} onChange={e => saveData(e)} />
                                    <label class="form-check-label">
                                        {movie.MOVIE_TITLE}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">영화관</label>
                    <div className="row">
                        {cinemas.map((cinema, index) => (
                            <div key={index} className="col-md-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="cinemaNo" value={cinema.CINEMA_NO} onClick={e => loadTheaterList(cinema.CINEMA_NO)}/>
                                    <label class="form-check-label">
                                        {cinema.CINEMA_NAME}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>

                    <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">상영관</label>
                    <div className="row">
                        {theaters.map((theater, index) => (
                            <div key={index} className="col-md-2">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="theaterNo" value={theater.THEATER_NO} onChange={e => saveData(e)} />
                                    <label class="form-check-label">
                                        {theater.THEATER_NAME}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="row">
                        <div className="col">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">상영일</label>
                            <input type="text" name="startDate" value={insertData.startDate} className="form-control" onChange={e => saveData(e)}/>
                        </div>
                        <div className="col">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">종료일</label>
                            <input type="text" name="endDate" value={insertData.endDate} className="form-control" onChange={e => saveData(e)}/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">상영시작</label>
                            <input type="text" name="startTime" value={insertData.startTime} className="form-control" onChange={e => saveData(e)} placeholder="23:00"/>
                        </div>
                        <div className="col">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">상영종료</label>
                            <input type="text" name="endTime" value={insertData.endTime} className="form-control" onChange={e => saveData(e)} placeholder="23:00"/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">좌석수</label>
                            <input type="number" name="remainingSeats" value={insertData.remainingSeats} className="form-control" onChange={e => saveData(e)}/>
                        </div>
                        <div className="col">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">요일유형</label>
                            <select class="form-select" name="movieScheduleDateDisc" value={insertData.movieScheduleDateDisc} onChange={e => saveData(e)}>
                                        <option value="평일">평일</option>
                                        <option value="주말">주말</option>
                                        <option value="공휴일">공휴일</option>
                            </select>
                        </div>
                        <div className="col">
                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-2">시간유형</label>
                            <select class="form-select" name="movieScheduleTimeDisc" value={insertData.movieScheduleTimeDisc} onChange={e => saveData(e)}>
                                        <option value="일반">일반</option>
                                        <option value="조조">조조</option>
                                        <option value="심야">심야</option>
                            </select>
                        </div>
                    </div>
                
                <hr/>
                </div>
            </div>

            
            <div className="row mt-5">
                <div className="offset-2 col-md-8">

                    <div className="row mt-3 mb-5">
                        <div className="col">
                            <label>영화관</label>
                            <input className="form-control" name='cinemaName' value={input.cinemaName} onChange={e => changeInput(e)} />
                        </div>
                        <div className="col">
                            <label>영화</label>
                            <input className="form-control" name='movieTitle' value={input.movieTitle} onChange={e => changeInput(e)} />
                        </div>
                        <div className="col">
                            <label>상영일</label>
                            <input className="form-control" name='startDate' value={input.startDate} onChange={e => changeInput(e)} />
                        </div>
                        <div className="col">
                            <button className="mt-4 btn btn-dark w-100" onClick={e => search(e)}>검색하기</button>
                        </div>
                    </div>

                    <table className="table table-hover">
                        <thead>
                            <tr style={{ textAlign: 'center' }}>
                                <th>#</th>
                                <th>영화관<span style={{ color: 'gray', fontSize: '15px' }}> (상영관)</span></th>
                                <th>영화<span style={{ color: 'gray', fontSize: '15px' }}> (타입)</span></th>
                                <th>좌석수</th>
                                <th>상영일</th>
                                <th>상영시간</th>
                                <th>요일유형</th>
                                <th>시간유형</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.map((schedule, index) => (
                                <tr style={{ textAlign: 'center' }}>
                                    <td>{index + 1}</td>
                                    <td>{schedule.cinemaName} <span style={{ color: 'gray', fontSize: '14px' }}>({schedule.theaterName})</span></td>
                                    <td>{schedule.movieTitle} <span style={{ color: 'gray', fontSize: '14px' }}>({schedule.movieScreenType})</span></td>
                                    <td>{schedule.theaterTotalSeats}석</td>
                                    <td>{schedule.startDate}</td>
                                    <td>{schedule.startTime} ~ {schedule.endTime}</td>
                                    <td>{schedule.movieScheduleDateDisc}</td>
                                    <td>{schedule.movieScheduleTimeDisc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination currentPage={currentPage} totalPages={Math.ceil(schedules.length / postsPerPage)} paginate={paginate} />
                </div>
            </div>


        </>
    );
}

export default MovieSchedule;