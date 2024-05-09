import { useNavigate } from "react-router";
import axios from "../utils/CustomAxios";
import './BookingListPage.css';
import { useCallback, useEffect, useState } from 'react';

function BookingListPage() {

    const [isTheaterShow, setIsTheaterShow] = useState(false);
    const navigate = useNavigate();
    const [scheduleNo, setScheduleNo] = useState('');
    //일정 PK번호 넘기기
    const moveToSeat = (scheduleNo) => {
        console.log(scheduleNo);
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
        movieScheduleNo: ''
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

    const loadTheaterList = useCallback(async (movieNo) => {
        const resp = await axios.get(`/booking/theater/${movieNo}`);
        setCinemaData(resp.data);
        setIsTheaterShow(true);
        setBookData({
            ...bookData,
            movieNo: movieNo
        });
    }, [bookData]);

    const saveCinema = useCallback((data) => {
        setBookData({
            ...bookData,
            cinemaName: data
        });
    }, [cinemaData]);

    const loadSchedule = useCallback(async (data) => {
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

    useEffect(() => {
        checkTimes();
    }, [times, selectedDate]);

     // 시간 데이터 배열에 대한 검사 수행
     const checkTimes = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const now = new Date();
        const currentTime = `${now.getHours()}:${now.getMinutes()}`;
        const currentHourMinute = currentTime.split(':');
        const currentTimeMinutes = parseInt(currentHourMinute[0], 10) * 60 + parseInt(currentHourMinute[1], 10);

        if (selectedDate === currentDate) { // 오늘 날짜와 같은 경우
            const timeResults = times.map(time => {
                const eventHourMinute = time.split(':');
                const eventTimeMinutes = parseInt(eventHourMinute[0], 10) * 60 + parseInt(eventHourMinute[1], 10);
                return {
                    time,
                    available: eventTimeMinutes > currentTimeMinutes
                };
            });
            setTimeOptions(timeResults);
        } else {
            const timeResults = times.map(time => ({ time, available: true }));
            setTimeOptions(timeResults);
        }
    };


    return (
        <>
            <br />
            <br />
            <div className="row">
                <div className="offset-3 col-2 book-wrapper">
                    <table className="book-table">
                        <tr><th className="title-wrapper">영화</th></tr>
                        {movieData.map((data) => (
                            <tr><td onClick={e => loadTheaterList(data.movieNo)} style={{padding:'0.5em'}}>{data.movieTitle}</td></tr>
                        ))}
                    </table>
                </div>

                <div className="col-2 book-wrapper">
                    <table className="book-table">
                        <tr><th className="title-wrapper">영화관</th></tr>
                        <span style={{ display: isTheaterShow ? 'block' : 'none' }}>
                            {cinemaData.map((data) => (
                                <tr><td onClick={e => saveCinema(data)} style={{padding:'0.5em'}}>{data}</td></tr>
                            ))}
                        </span>
                    </table>
                </div>

                <div className="col-1 book-wrapper">
                    <table className="book-table text-center">
                        <tr><th className="title-wrapper">날짜</th></tr>
                        <tr><td style={{ fontWeight: 'bold', fontSize: '40px', color:'rgb(121,120,114)'}}>{calendarMonth}</td></tr>
                        {weekDays.map((day, index) => (
                            <tr>
                                <td key={index}
                                    style={{ color: day.weekDayIndex === 0 ? 'rgb(173,39,39)' : day.weekDayIndex === 6 ? 'rgb(60,108,153)' : 'black', 
                                    whiteSpace: 'pre-wrap', padding:'0.3em', fontSize:'15px' }}
                                    onClick={e => loadSchedule(day.fullDate)}>
                                    {day.date}
                                </td>
                            </tr> //배열의 각 요소를 리스트 아이템으로 렌더링
                        ))}
                    </table>
                </div>

                <div className="col-1 book-wrapper2">
                    <table className="book-table">
                        <tr><th className="title-wrapper">시간</th></tr>
                        {results.map((result) => (
                            <tr key={result.movieNo}>
                            <td>
                                {timeOptions.filter(option => option.time === result.startTime).map((option) => (
                                    <>
                                    <button onClick={e=>selectedSchedule(result.movieScheduleNo)} className="btn btn-secondary btn-sm"
                                        disabled={!option.available}>
                                        {result.startTime}
                                    </button>
                                    <span
                                        key={option.time}
                                        style={{ color: option.available ? '' : 'rgb(121,120,114)', fontSize:'13px' }}>
                                    {option.available ? '' : '  예매불가'}
                                    </span>
                                    </>
                              ))}
                            </td>
                        </tr>
                        ))}
                    </table>
                </div>
            </div>

            <div className="row mt-5 mb-5">
                <div className="offset-3 col-lg-6">
                    {/* <button className="btn btn-secondary btn-lg"
                         onClick={e => moveToSeat(scheduleNo)}   >
                        좌석선택
                    </button> */}
                    
                </div>
            </div>



        </>
    );
}

export default BookingListPage;