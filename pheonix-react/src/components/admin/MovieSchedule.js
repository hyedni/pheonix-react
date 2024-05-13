import { useLinkClickHandler } from "react-router-dom";
import Pagination from "../service/Pagination";
import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useState, useRef } from 'react';
import { Modal } from "bootstrap";



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
        setCurrentPage(1);
    }, [input]);

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

    const getTotalSeats = useCallback(async (target) => {
        const resp = await axios.get(`/movieSchedule/seats/${target}`)
        setInsertData({
            ...insertData,
            remainingSeats: resp.data,
            theaterNo: target
        });
        setEditData({
            ...editData,
            remainingSeats: resp.data,
            theaterNo: target
        });
    }, [insertData]);

    const [calRunningTime, setCalRunningTime] = useState();
    const getRunningTime = useCallback(async (target) => {
        const resp = await axios.get(`/movieSchedule/runningTime/${target}`);
        setCalRunningTime(resp.data);
        setInsertData({
            ...insertData,
            startTime: "",
            endTime: ""
        });
    }, [calRunningTime]);

    const [cinemas, setCinemas] = useState([]);
    const cinemaList = useCallback(async () => {
        const resp = await axios.get("/movieSchedule/cinemaList");
        setCinemas(resp.data);
    }, [cinemas]);

    const [theaters, setTheaters] = useState([]);
    const theaterList = useCallback(async (target) => {
        const resp = await axios.get(`/movieSchedule/theaterList/${target}`);
        setTheaters(resp.data);
        setInsertData({
            ...insertData,
            remainingSeats: ''
        });
        setEditData({
            ...editData,
            remainingSeats: ''
        });
        const radioInputs = document.querySelectorAll('input[name="theaterNo"]');
        radioInputs.forEach(input => {
            input.checked = false;
        });
    }, [insertData]);

    const loadTheaterList = useCallback((target) => {
        theaterList(target);
    }, [theaters]);

    const saveData = useCallback((e) => {
        if (e.target.name === "theaterNo") {
            const no = e.target.value;
            getTotalSeats(no);
        }

        let endTimeValue = insertData.endTime;
        if (e.target.name === "startTime") {
            const startTime = e.target.value;
            const runningTime = calRunningTime;
            endTimeValue = calculateEndTime(startTime, runningTime);
        }
        setInsertData({
            ...insertData,
            [e.target.name]: e.target.value,
            endTime: endTimeValue,
            movieNo: movieNo
        });
        console.log(insertData);
    }, [insertData]);

    const [movieNo, setMovieNo] = useState();
    const saveMovieNo = useCallback(async (e) => {
        await getRunningTime(e.target.value);
        setMovieNo(e.target.value);
        setInsertData({
            ...insertData,
            movieNo: e.target.value,
            startTime: '',
            endTime:''
        });
    }, [insertData]);

    // 상영종료시간을 계산하는 함수
    const calculateEndTime = (startTime, runningTime) => {
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = startTotalMinutes + runningTime;
        let endHour = Math.floor(endTotalMinutes / 60);
        const endMinute = endTotalMinutes % 60;
        if (endHour >= 24) {
            endHour -= 24;
        }
        return `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;
    };

    const saveSchedule = useCallback(async () => {
        await axios.post("/movieSchedule/insert", insertData);
        closeModal();
        cancelScheduleInput();
        loadList();
    }, [insertData]);

    const cancelScheduleInput = useCallback(() => {
        setInsertData({
            movieNo: '',
            theaterNo: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            remainingSeats: '',
            movieScheduleDateDisc: '',
            movieScheduleTimeDisc: ''
        });
        closeModal();
    }, [insertData]);

    const bsModal = useRef();
    const openModal = useCallback(() => {
        const modal = new Modal(bsModal.current);
        modal.show();
        insert();
        setShowModal(true);
    }, [bsModal]);
    const closeModal = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
        setShowModal(false);
    }, [bsModal]);

    const [showModal, setShowModal] = useState(false);

    // 모달이 열릴 때 라디오 박스 초기화
    useEffect(() => {
        if (showModal) {
            // 모달이 열릴 때 모든 라디오 박스의 체크를 해제
            const radioInputs = document.querySelectorAll('input[type="radio"]');
            radioInputs.forEach(input => {
                input.checked = false;
            });
        }
    }, [showModal]);

    //삭제
    const deleteSchedule = useCallback(async (target) => {
        const choice = window.confirm("정말 삭제하시겠습니까?");
        if (choice === false) return;
        await axios.delete(`/movieSchedule/${target}`);
        loadList();
    }, []);



    const bsModalEdit = useRef();
    const openModalEdit = useCallback((target) => {
        const modal = new Modal(bsModalEdit.current);
        modal.show();
        copy(target);
        insert();
    }, [bsModalEdit]);

    const closeModalEdit = useCallback(() => {
        const modal = Modal.getInstance(bsModalEdit.current);
        modal.hide();
    }, [bsModalEdit]);

    //수정버튼 누르면 해당정보 복사해두기
    const [copyData, setCopyData] = useState({});
    const copy = useCallback(async (target) => {
        const resp = await axios.get(`/movieSchedule/${target}`);
        const copiedData = resp.data; // 최신의 데이터를 복사
        setCopyData(copiedData); // 복사한 데이터로 copyData 업데이트
        setEditData({
            movieScheduleNo: copiedData.movieScheduleNo,
            startDate: copiedData.startDate,
            endDate: copiedData.endDate,
            startTime: copiedData.startTime,
            endTime: copiedData.endTime,
            remainingSeats: copiedData.remainingSeats,
            movieScheduleDateDisc: copiedData.movieScheduleDateDisc,
            movieScheduleTimeDisc: copiedData.movieScheduleTimeDisc
        });
    }, [copyData]);

    const [editData, setEditData] = useState({});
    const saveEditData = useCallback((e) => {
        let endTimeValue = editData.endTime;
        if (e.target.name === "startTime") {
            const startTime = e.target.value;
            const runningTime = copyData.movieRunningTime;
            endTimeValue = calculateEndTime(startTime, runningTime);
        }
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
            endTime: endTimeValue === 'NaN:NaN' ? '' : endTimeValue
        });

    }, [editData]);

    //수정
    const saveEditSchedule = useCallback(async () => {
        await axios.patch("/movieSchedule/", editData);
        closeModalEdit();
        cancelScheduleInput();
        loadList();
    }, [editData]);

    const cancelEditInput = useCallback(() => {
        setInsertData({
            movieNo: '',
            theaterNo: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            remainingSeats: '',
            movieScheduleDateDisc: '',
            movieScheduleTimeDisc: ''
        });
        closeModalEdit();
    }, [editData]);

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        상영 일정 관리
                        <span style={{ marginLeft: '10px' }}><button className="btn btn-primary" onClick={e => openModal()}>일정등록</button></span>
                        <span style={{ marginLeft: '10px' }}><button className="btn btn-dark" onClick={e => moveToStart(e)}>처음으로</button></span>
                        <span style={{ fontSize: '15px', fontWeight: 'normal', marginLeft: '10px' }}> 검색어를 입력하여 원하는 조건의 상영일정을 찾으세요! </span>
                    </div>
                    <hr />
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
                                <th>요일</th>
                                <th>시간</th>
                                <th></th>
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
                                    <td>
                                        <button className="btn btn-secondary btn-sm" onClick={e => openModalEdit(schedule.movieScheduleNo)} style={{ marginRight: '10px' }} >수정</button>
                                        <button className="btn btn-dark btn-sm" onClick={e => deleteSchedule(schedule.movieScheduleNo)} >삭제</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination currentPage={currentPage} totalPages={Math.ceil(schedules.length / postsPerPage)} paginate={paginate} />
                </div>
            </div>



            {/* 등록Modal */}
            <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: 'rgb(56,52,54)', color: 'white' }}>
                            <h1 className="modal-title fs-5" id="staticBackdropLabel" style={{ fontWeight: 'bold' }}>신규 상영일정</h1>
                            <button type="button" className="btn-close" aria-label="Close"
                                onClick={e => cancelScheduleInput()}></button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="offset-2 col-md-8">

                                    <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">영화</label>
                                    <div className="row">
                                        {movies.map((movie, index) => (
                                            <div key={index} className="col-md-3"> {/* 각 라디오 버튼을 포함하는 열 */}
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="movieNo" value={movie.MOVIE_NO} onClick={e => saveMovieNo(e)} />
                                                    <label class="form-check-label" style={{ fontSize: '14px' }}>
                                                        {movie.MOVIE_TITLE}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">영화관</label>
                                    <div className="row">
                                        {cinemas.map((cinema, index) => (
                                            <div key={index} className="col-md-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="cinemaNo" value={cinema.CINEMA_NO} onClick={e => loadTheaterList(cinema.CINEMA_NO)} />
                                                    <label class="form-check-label" style={{ fontSize: '14px' }}>
                                                        {cinema.CINEMA_NAME}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">상영관</label>
                                    <div className="row">
                                        {theaters.map((theater, index) => (
                                            <div key={index} className="col-md-3">
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="theaterNo" value={theater.THEATER_NO} onChange={e => saveData(e)} />
                                                    <label class="form-check-label" style={{ fontSize: '14px' }}>
                                                        {theater.THEATER_NAME}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">상영일</label>
                                            <input type="text" name="startDate" value={insertData.startDate} className="form-control" onChange={e => saveData(e)} />    
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">종료일</label>
                                            <input type="text" name="endDate" value={insertData.endDate} className="form-control" onChange={e => saveData(e)} />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">상영시작</label>
                                            <input type="text" name="startTime" value={insertData.startTime} className="form-control" onChange={e => saveData(e)} placeholder="23:00" />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">상영종료</label>
                                            <input type="text" name="endTime" value={insertData.endTime} className="form-control" onChange={e => saveData(e)} 
                                            placeholder="상영시작 입력시 러닝타임으로 자동 계산" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">좌석수</label>
                                            <input type="number" name="remainingSeats" value={insertData.remainingSeats} className="form-control" onChange={e => saveData(e)} />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">요일유형</label>
                                            <select class="form-select" name="movieScheduleDateDisc" value={insertData.movieScheduleDateDisc} onChange={e => saveData(e)}>
                                                <option value="">선택하세요</option>
                                                <option value="평일">평일</option>
                                                <option value="주말">주말</option>
                                                <option value="공휴일">공휴일</option>
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">시간유형</label>
                                            <select class="form-select" name="movieScheduleTimeDisc" value={insertData.movieScheduleTimeDisc} onChange={e => saveData(e)}>
                                                <option value="">선택하세요</option>
                                                <option value="일반">일반</option>
                                                <option value="조조">조조</option>
                                                <option value="심야">심야</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={e => saveSchedule()}>등록</button>
                            <button className="btn btn-dark" onClick={e => cancelScheduleInput()}>취소</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 수정 Modal */}
            <div ref={bsModalEdit} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: 'rgb(56,52,54)', color: 'white' }}>
                            <h1 className="modal-title fs-5" id="staticBackdropLabel" style={{ fontWeight: 'bold' }}>수정 중</h1>
                            <button type="button" className="btn-close" aria-label="Close"
                                onClick={e => cancelEditInput()}></button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="offset-2 col-md-8">


                                    <div className="row">
                                        <div className="col"  style={{ fontWeight: 'bold', fontSize: '20px', color: 'rgb(240, 86, 86)' }}> 
                                             {copyData.movieTitle} ({copyData.cinemaName} / {copyData.theaterName})
                                        </div> 
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col"> {copyData.startDate}  </div>
                                        <div className="col"> {copyData.endDate}  </div>
                                        <div className="col"> {copyData.startTime} - {copyData.endTime} </div>
                                        <div className="col"> {copyData.remainingSeats}석  </div>
                                        <div className="col"> {copyData.movieScheduleDateDisc}  </div>
                                        <div className="col"> {copyData.movieScheduleTimeDisc}  </div>
                                    </div>
                                    
                                    <hr/>

                                    <div className="row">
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">상영일</label>
                                            <input type="text" name="startDate" value={editData.startDate} className="form-control" onChange={e => saveEditData(e)} />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">종료일</label>
                                            <input type="text" name="endDate" value={editData.endDate} className="form-control" onChange={e => saveEditData(e)} />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">상영시작</label>
                                            <input type="text" name="startTime" value={editData.startTime} className="form-control" onChange={e => saveEditData(e)} placeholder="23:00" />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">상영종료</label>
                                            <input type="text" name="endTime" value={editData.endTime} className="form-control" onChange={e => saveEditData(e)} placeholder="상영시작 입력시 러닝타임으로 자동 계산" />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">좌석수</label>
                                            <input type="number" name="remainingSeats" value={editData.remainingSeats} className="form-control" onChange={e => saveEditData(e)} />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">요일유형</label>
                                            <select class="form-select" name="movieScheduleDateDisc" value={editData.movieScheduleDateDisc} onChange={e => saveEditData(e)}>
                                                <option value="">선택하세요</option>
                                                <option value="평일">평일</option>
                                                <option value="주말">주말</option>
                                                <option value="공휴일">공휴일</option>
                                            </select>
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: 'bold', fontSize: '20px' }} className="mt-3">시간유형</label>
                                            <select class="form-select" name="movieScheduleTimeDisc" value={editData.movieScheduleTimeDisc} onChange={e => saveEditData(e)}>
                                                <option value="">선택하세요</option>
                                                <option value="일반">일반</option>
                                                <option value="조조">조조</option>
                                                <option value="심야">심야</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={e => saveEditSchedule()}>등록</button>
                            <button className="btn btn-dark" onClick={e => cancelEditInput()}>취소</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default MovieSchedule;