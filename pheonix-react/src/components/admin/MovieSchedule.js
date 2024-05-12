import axios from "../utils/CustomAxios";
import { useCallback, useEffect, useState, useRef } from 'react';


function MovieSchedule() {

    const [schedules, setSchedules] = useState([]);
    const [input, setInput] = useState({});

    const loadList = useCallback(async (input)=>{
        const resp = await axios.post("/movieSchedule/", input);
        setSchedules(resp.data);
    },[schedules]);

    useEffect(()=>{
        loadList();
    },[schedules]);

    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    const search = useCallback(()=>{
        loadList({...input});
    },[input]);

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                         상영 일정 관리
                        {/* <span className='ms-3' onClick={e => openModal()}><FaCirclePlus style={{ marginBottom: '10px', color: 'rgb(240, 86, 86)' }} /></span> */}
                        <span style={{fontSize:'15px', fontWeight:'normal', marginLeft:'10px'}}> 검색어를 입력하여 원하는 조건의 상영일정을 찾으세요! </span>
                    </div>
                    <hr />
                </div>
            </div>

            <div className="row">
                <div className="offset-2 col-md-8">
                   
                    <div className="row mt-3 mb-5">
                        <div className="col">
                            <label>영화관</label>
                            <input className="form-control" name='cinemaName' onChange={e => changeInput(e)}/>
                        </div>
                        <div className="col">
                            <label>영화</label>
                            <input className="form-control" name='movieTitle' onChange={e => changeInput(e)}/>
                        </div>
                        <div className="col">
                            <label>상영일</label>
                            <input className="form-control" name='startDate' onChange={e => changeInput(e)}/>
                        </div>
                        <div className="col">
                            <button className="mt-4 btn btn-dark w-100" onClick={e => search(e)}>검색하기</button>
                        </div> 
                    </div>

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>영화관<span style={{color:'gray', fontSize:'15px'}}> (상영관)</span></th>
                                <th>영화<span style={{color:'gray', fontSize:'15px'}}> (타입)</span></th>
                                <th>좌석수</th>
                                <th>상영일자</th>
                                <th>상영시간</th>
                                <th>요일유형</th>
                                <th>시간유형</th>
                            </tr>
                        </thead>
                        <tbody>
                            {schedules.map((schedule, index)=>(
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{schedule.cinemaName} <span style={{color:'gray', fontSize:'14px'}}>({schedule.theaterName})</span></td>
                                    <td>{schedule.movieTitle} <span style={{color:'gray', fontSize:'14px'}}>({schedule.movieScreenType})</span></td>
                                    <td>{schedule.theaterTotalSeats}석</td>
                                    <td>{schedule.startDate}</td>
                                    <td>{schedule.startTime}</td>
                                    <td>{schedule.movieScheduleDateDisc}</td>
                                    <td>{schedule.movieScheduleTimeDisc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>


        </>
    );
}

export default MovieSchedule;