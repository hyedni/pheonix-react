import { useCallback, useEffect, useState } from "react";
import axios from "../utils/CustomAxios";
import './AdminCinema.css';
import { FaCirclePlus } from "react-icons/fa6";

function AdminTheater() {
    const [cinemas, setCinemas] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const [cinemaFind, setCinemaFind] = useState({
        cinemaNo: '',
        cinemaName: '',
        cinemaTotalTheater: '',
        cinemaRegion: '',
        cinemaPost: '',
        cinemaAddress1: '',
        cinemaAddress2: '',
        cinemaManager: '',
        cinemaManagerCall: '',
        cinemaCall: ''
    });
    //번호만 따로 관리 
    const [cinemaNo, setCinemaNo] = useState('');

    const [isAddVisible, setIsAddVisible] = useState(false);
    const [isListVisible, setIsListVisible] = useState(false);

    const showAddDiv= () => {
        setIsAddVisible(true);
    };
    const showListDiv = () => {
        setIsListVisible(true);
    }

    const loadCinemaList = useCallback(async () => {
        const resp = await axios.get("/cinema/");
        setCinemas(resp.data);
    }, []);
  
    const selectCinema = useCallback(async (target) => {
        setCinemaNo(target.cinemaNo);  
        const resp = await axios.get(`/theater/${target.cinemaNo}`);
        console.log(resp);
        setTheaters(resp.data);
        showListDiv();       
    }, [cinemas]);

    // const selectedRegion = useCallback(async (target) => {
    //     setRegion({
    //         cinemaNo: target.cinemaNo
    //     });
    //     const resp = await axios.get("/cinema/" + target.cinemaNo);
    //     setDetailCinema(resp.data);
    //     setIsEdit({ edit: false });
    // }, [region]);
    
    useEffect(() => {
        loadCinemaList();
    }, []);


    return (


        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        상영관 관리
                    </div>
                </div>
            </div>
            <hr />

            <div className="row">
                <div className="offset-2 col-lg-8">
                    <div className="mb-3">
                        1단계 영화관 선택
                    </div>

                    <div className='cinema-wrapper2 table-responsive'>
                        <ul className="region-ul">
                            <li className="region-li">
                                <div className='region-wrapper'>
                                    <li className='region-li'>서울</li>
                                </div>
                                <div>
                                    <ul className="inner-ul">
                                        {cinemas.map((cinema) => (
                                            <li key={cinema.cinemaNo} onClick={e => selectCinema(cinema)}
                                                style={{ borderRight: '1px solid gray', paddingRight: '0.5em', cursor: 'pointer' }}>
                                                {cinema.cinemaName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="row" style={{ display: isListVisible ? 'block' : 'none' }}>
                <div className="offset-2 col-lg-8">
                    <div className="mb-3">
                        2단계 상영관 조회/수정
                        <FaCirclePlus style={{ marginBottom: '10px', color:'rgb(240, 86, 86)'}} onClick={showAddDiv}/>
                    </div>

                    <div>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>관리번호</th>
                                    <th>상영관명</th>
                                    <th>총 좌석수</th>
                                </tr>
                            </thead>
                            <tbody>
                                {theaters.map((theater) => (
                                    <tr key={theater.theaterNo}>
                                        <td>{theater.theaterNo}</td>
                                        <td>{theater.theaterName}</td>
                                        <td>{theater.theaterTotalSeats}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="row" style={{ display: isAddVisible ? 'block' : 'none' }}>
                <div className="offset-2 col-lg-8">
                    <h3>3단계 상영관 등록</h3>
                </div>
            </div>


            <div className="row">
                <div className="offset-2 col-lg-8">
                    <button className="btn btn-secondary">좌석설정</button>
                </div>
            </div>

        </>
    );
}

export default AdminTheater;