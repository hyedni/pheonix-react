import { useNavigate } from "react-router";
import axios from "../utils/CustomAxios";
import './BookingListPage.css';
import { useCallback, useEffect, useState } from 'react';
import { TbNumber12Small } from "react-icons/tb";
import { TbNumber15Small } from "react-icons/tb";
import { TbNumber19Small } from "react-icons/tb";
import React, { Fragment } from 'react';

function BookingListPage() {

    const [isTheaterShow, setIsTheaterShow] = useState(false);
    const [isScheduleShow, setIsScheduleShow] = useState(false);
    const navigate = useNavigate();
    const [scheduleNo, setScheduleNo] = useState('');

    //일정 PK번호 넘기기
    const moveToSeat = (scheduleNo) => {
        navigate(`/주소/${scheduleNo}`)
    };

    //전체데이터(Vo)담긴 state
    const [bookData, setBookData] = useState({
        movieNo: '',
        cinemaName: '',
        cinemaRegion: '',
        theaterName: '',
        theaterTotalSeats: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        remainingSeats: '',
        movieScheduleDateDisc: '',
        movieScheduleTimeDisc: '',
        movieScheduleNo: '',
        theaterCount: ''
    });
    const [results, setResults] = useState([]);

    //영화, 영화관
    const [movieData, setMovieData] = useState([]);
    const [cinemaData, setCinemaData] = useState([]);

    //영화목록
    const loadMovie = useCallback(async () => {
        const resp = await axios.get("/booking/movie");
        setMovieData(resp.data);
    }, [movieData]);

    useEffect(() => {
        loadMovie();
    }, []);

    //관람등급 아이콘
    const getAgeIcon = (movieAge) => {
        switch (movieAge) {
            case '12세 이상':
                return <TbNumber12Small style={{ fontSize: '20px', backgroundColor: 'yellow', borderRadius: '10px', verticalAlign:'middle' }} />;
            case '15세 이상':
                return <TbNumber15Small style={{ fontSize: '20px', backgroundColor: 'orange', borderRadius: '10px', verticalAlign:'middle' }} />;
            case '청소년관람불가':
                return <TbNumber19Small style={{ fontSize: '20px', backgroundColor: 'red', borderRadius: '10px', verticalAlign:'middle' }} />;
            case '전체관람가':
                return <span style={{ fontSize: '9px', color: 'white', fontWeight: 'bold', backgroundColor: 'green', borderRadius: '10px', width: '10px', padding: '5px',  verticalAlign:'middle'}}>all</span>;
        }
    };

    const [isSelectedMovie, setIsSelectedMovie] = useState('');
    const loadTheaterList = useCallback(async (movieNo) => {
        const resp = await axios.get(`/booking/theater/${movieNo}`);
        setCinemaData(resp.data);
        setIsTheaterShow(true);
        setIsScheduleShow(false);
        setBookData({
            ...bookData,
            movieNo: movieNo
        });
        setCntData({
            ...cntData,
            movieNo: movieNo
        });
        setIsSelectedMovie(movieNo);
    }, [bookData]);

    const [isSelectedCinema, setIsSelectedCinema] = useState('');
    const saveCinema = useCallback((data) => {
        setBookData({
            ...bookData,
            cinemaName: data
        });
        setCntData({
            ...cntData,
            cinemaName: data
        });
        setIsSelectedCinema(data);
        setIsScheduleShow(false);
    }, [cinemaData]);

    const [theaterData, setTheaterData] = useState([]);
    const [cntData, setCntData] = useState({
        movieNo: 0,
        cinemaName: ''
    });

    const theaterDistinct = useCallback(async (cntData) => {
        const resp = await axios.get(`booking/theaterdistinct/${cntData.cinemaName}`)
        setTheaterData(resp.data);
    }, []);

    const loadSchedule = useCallback(async (data) => {
        setIsScheduleShow(true);
        theaterDistinct(cntData);
        setSelectedDate(data);
        const updatedBookData = {
            ...bookData,
            startDate: data
        };
        setBookData(updatedBookData);
        const resp = await axios.post("/booking/date", updatedBookData);
        setResults(resp.data);
        const newTimes = resp.data.map(item => item.startTime); // startTime 값을 추출
        setTimes(newTimes); // 추출된 startTime 값들로 times 상태 업데이트
    }, [bookData]);

    const selectedSchedule = (seleted) => {
        setScheduleNo(seleted);
    };

    // 달력 
    const date = new Date();
    const calendarMonth = date.getMonth() + 1;

    const [weekDays, setWeekDays] = useState([]);

    function formatDate(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더해줍니다.
        const day = date.getDate();
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        const today = new Date(); // 오늘 날짜를 기준으로
        const days = [];
        var calendarDays = ["일", "월", "화", "수", "목", "금", "토"];

        // 오늘부터 시작해서 일주일간 날짜 계산
        for (let i = 0; i < 14; i++) {
            const nextDay = new Date(today);
            nextDay.setDate(today.getDate() + i); // 오늘 날짜에 i일을 더함
            const day = nextDay.getDate(); // 일자
            const weekDay = calendarDays[nextDay.getDay()]; // 요일을 calendarDays 배열에서 가져옴
            const formattedDate = formatDate(nextDay);
            const dayInfo = {
                date: `${weekDay}     ${day}`, // 날짜와 요일을 문자열로 함께 저장
                weekDayIndex: nextDay.getDay(), // 요일의 인덱스 (일요일: 0, 토요일: 6)
                fullDate: formattedDate
            };
            days.push(dayInfo); // 날짜와 요일을 문자열로 함께 저장
        }
        setWeekDays(days);
    }, []);

    //시간계산
    const [selectedDate, setSelectedDate] = useState('');
    const [times, setTimes] = useState([]);
    const [timeOptions, setTimeOptions] = useState([]);

    const filterUniqueResults = useCallback(() => {
        // 각 상영관별 고유한 `startTime` 값을 가진 항목만 남기도록 `Map`을 사용하여 필터링
        const filteredResults = new Map();
        results.forEach((result) => {
            const key = `${result.movieScheduleNo}-${result.startTime}`;
            if (!filteredResults.has(key)) {
                filteredResults.set(key, result);
            }
        });
        return Array.from(filteredResults.values());
    }, [results]);

    const uniqueResults = filterUniqueResults();

    // 시간 데이터 배열에 대한 검사 수행
    const checkTimes = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

        const newTimeOptions = uniqueResults.reduce((acc, result) => {
            const eventHourMinute = result.startTime.split(':');
            const eventTimeMinutes = parseInt(eventHourMinute[0], 10) * 60 + parseInt(eventHourMinute[1], 10);
            const available = selectedDate !== currentDate || eventTimeMinutes > currentTimeMinutes;

            const key = `${result.movieScheduleNo}-${result.startTime}`;
            acc[key] = available; //객체에 저장된 모든 키와 예매 가능 여부가 담긴 객체가 반환
            return acc;
        }, {});
        setTimeOptions(newTimeOptions);
    };

    useEffect(() => {
        checkTimes();
    }, [times, selectedDate]);

    return (
        <>
            <br />
            <br />

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">

                        <div className="row">
                            <div className="col book-wrapper">
                                <table className="book-table">
                                    <tr><th className="title-wrapper">영화</th></tr>
                                    {movieData.map((data) => (
                                        <>
                                            <tr style={{height:'50px'}}>
                                                <td onClick={e => loadTheaterList(data.movieNo)} 
                                                    style={{ padding: '0.5em', fontSize:'15px', verticalAlign:'middle', fontWeight:isSelectedMovie === data.movieNo ? 'bolder' : '', cursor:'pointer'}}>
                                                    {getAgeIcon(data.movieAge)}  &nbsp; {data.movieTitle}
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </table>
                            </div>

                            <div className="col book-wrapper">
                                <table className="book-table">
                                    <tr><th className="title-wrapper">영화관</th></tr>
                                    <span style={{ display: isTheaterShow ? 'block' : 'none'}}>
                                        {cinemaData.map((data) => (
                                            <tr>
                                                <td onClick={e => saveCinema(data)} 
                                                    style={{ padding: '0.8em', fontSize:'15px', fontWeight:isSelectedCinema === data ? 'bolder' : '', cursor:'pointer'}}>
                                                    {data}
                                                </td>
                                            </tr>
                                        ))}
                                    </span>
                                </table>
                            </div>

                            <div className="col book-wrapper" style={{ paddingBottom: '1em' }}>
                                <table className="book-table text-center">
                                    <tr><th className="title-wrapper">날짜</th></tr>
                                    <tr><td style={{ fontWeight: 'bold', fontSize: '40px', color: 'rgb(121,120,114)' }}>{calendarMonth}</td></tr>
                                    {weekDays.map((day, index) => (
                                        <tr>
                                            <td key={index}
                                                style={{
                                                    color: day.weekDayIndex === 0 ? 'rgb(173,39,39)' : day.weekDayIndex === 6 ? 'rgb(60,108,153)' : 'black',
                                                    whiteSpace: 'pre-wrap', padding: '0.3em', fontSize: '15px', cursor:'pointer'
                                                }}
                                                onClick={e => loadSchedule(day.fullDate)}>
                                                {day.date}
                                            </td>
                                        </tr> //배열의 각 요소를 리스트 아이템으로 렌더링
                                    ))}
                                </table>
                            </div>

                            <div className="col book-wrapper2">
                                <table className="book-table">
                                    <thead>
                                        <tr><th className="title-wrapper">시간</th></tr>
                                    </thead>
                                    <span style={{ display: isScheduleShow ? 'block' : 'none'}}>
                                    {theaterData.map((data) => (
                                        <tbody key={data.theaterNo}>
                                            <tr style={{borderBottom:'0.5px solid rgb(212,211,201)' }}>
                                                <td style={{ fontSize: '13px', fontWeight: 'bold', height: '30px'}}>{data.theaterName}</td>
                                            </tr>
                                            {uniqueResults.filter(result => result.theaterName === data.theaterName).map((filteredResult) => {
                                                const key = `${filteredResult.movieScheduleNo}-${filteredResult.startTime}`;
                                                const isAvailable = timeOptions[key] ?? false; // 기본값을 false로 설정하여 예매불가 처리

                                                return (
                                                    <tr key={key} style={{height:'40px'}}>
                                                        <td>
                                                            <>
                                                                <button
                                                                    onClick={e => selectedSchedule(filteredResult.movieScheduleNo)}
                                                                    className="btn btn-secondary btn-sm"
                                                                    disabled={!isAvailable}
                                                                >
                                                                    {filteredResult.startTime}
                                                                </button>
                                                                <span
                                                                    style={{ color: isAvailable ? '' : 'rgb(121,120,114)', fontSize: '13px' }}>
                                                                    {isAvailable ? '' : '예매종료'}
                                                                </span>
                                                            </>
                                                        </td>
                                                    </tr>
                                                );

                                            })}

                                        </tbody>
                                    ))}
                                    </span>
                                </table>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                {/* <button className="btn btn-secondary btn-lg"
                         onClick={e => moveToSeat(scheduleNo)}   >
                        좌석선택
                    </button> */}

                            </div>
                        </div>



                    </div>
                </div>
            </div>

            <br />
            <br />

        </>
    );
}

export default BookingListPage;