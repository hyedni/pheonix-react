import { useCallback, useEffect, useState } from "react";
import axios from "../utils/CustomAxios";
import './AdminCinema.css';
import { FaCirclePlus } from "react-icons/fa6";
import { useActionData, useNavigate } from 'react-router';

function AdminTheater() {
    const [cinemas, setCinemas] = useState([]);
    const [theaters, setTheaters] = useState([]);
    const navigate = useNavigate();

    //번호만 따로 관리 
    const [cinemaNo, setCinemaNo] = useState('');

    const [isListVisible, setIsListVisible] = useState(false);

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

    const addTheater = useCallback((cinemaNo) => {
        // navigate를 사용해 이동하면서 state로 cinemaNo를 전달
        navigate('/addTheater', { state: { cinemaNo } });
    }, [navigate]);
    
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
                <hr />
                </div>
            </div>

            <div className="row">
                <div className="offset-2 col-lg-8">
                    <div className="mt-3 mb-3" style={{fontWeight:'bold', fontSize:'25px'}}>
                        <span style={{color:'rgb(240, 86, 86)'}}>1단계</span> 영화관 선택
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

            <div className="row mb-5" style={{ display: isListVisible ? 'block' : 'none' }}>
                <div className="offset-2 col-lg-8">
                    <div className="mb-3" style={{fontWeight:'bold', fontSize:'25px'}}>
                        <span style={{color:'rgb(240, 86, 86)'}}>2단계</span> 상영관 조회
                        <button className="btn btn-secondary ms-4" style={{fontWeight:'bold'}} onClick={e => addTheater(cinemaNo)}>신규등록</button>

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
                                        <td>{theater.theaterTotalSeats} 석</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    );
}

export default AdminTheater;