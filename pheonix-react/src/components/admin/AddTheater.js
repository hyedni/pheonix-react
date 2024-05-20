import { useState, useCallback } from "react";
import { useLocation } from "react-router";
import SeatStatus from './SeatsTypes/SeatStatus';
import SeatDetails from "./SeatsTypes/SeatDetails";
import { useRecoilState } from "recoil";
import { seatsState } from '../utils/RecoilData';
import axios from '../utils/CustomAxios';
import { useNavigate } from 'react-router-dom';

function AddTheater() {

    const navigate = useNavigate();

    const [seats, setSeats] = useRecoilState(seatsState);
    const [showDetails, setShowDetails] = useState(false);

    const location = useLocation();
    const cinemaNo = location.state.cinemaNo;

    const [theater, setTheater] = useState({
        cinemaNo: cinemaNo,
        theaterName: ''
    });

    const [input, setInput] = useState('');

    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    const updateTheaterName = (e) => {
        const { value } = e.target;
        setTheater((prevTheater) => ({
            ...prevTheater,
            theaterName: value
        }));
    }

    const showSeatDetails = () => {
        setShowDetails(true);
    };

    const addTheater = async () => {
        try {
            const payload = {
                seats: seats,
                theater: theater
            };
            const response = await axios.post('/theater/', payload);
            console.log("전송완료 제발제발");
            navigate('/theaterRegistrationComplete');
        } catch (error) {
            console.error('에러임  data:', error);
        }
    };

    return (
        <>

            <br />
            <br />

            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="mt-3 mb-5" style={{ fontWeight: 'bold', fontSize: '25px' }}>
                        <span style={{ color: 'rgb(240, 86, 86)' }}>3단계</span> 상영관 등록 / 좌석 배치 설정
                    </div>
                    <div className="row">
                        <div className="col">
                            <label>상영관 이름</label>
                            <input className="form-control" type="text" name="theaterName"
                                value={input.name}
                                onChange={e => changeInput(e)}
                                onBlur={(e) => updateTheaterName(e)} />
                        </div>
                    </div>

                    <hr />
                    {/* <div className="h4">
                        좌석 배치 설정
                    </div> */}

                    {showDetails ? <SeatDetails /> : <SeatStatus />}

                    <br></br>
                    <br></br>
                    {showDetails ?
                        <div className="text-end">
                            <button onClick={addTheater} className="btn btn-success">
                                상영관등록
                            </button>
                        </div> :
                        <div className="mb-5">
                            <button onClick={showSeatDetails} className="btn btn-warning">
                                좌석세부설정
                            </button>
                        </div>
                    }


                </div>
            </div>


        </>
    );
}

export default AddTheater;