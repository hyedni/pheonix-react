import { useCallback, useState, useEffect } from "react";
import axios from '../utils/CustomAxios';
import { useLocation, useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { loginIdState, nonLoginIdState } from "../utils/RecoilData";


function BookingAdd() {

    const [checkedSeats, setCheckedSeats] = useState({});
    //로그인관련 데이터
    const [loginId, setLoginId] = useRecoilState(loginIdState);
    

    // useEffect(() => {
    //     console.log('loginId 상태 확인:', loginId);
    // }, [loginId]);

    

    useEffect(() => {
        if (loginId) {
            setBookingStatus(prevStatus => ({
                ...prevStatus,
                userId: loginId
            }));
        }
    }, [loginId]);


    //선택된좌석들의 가격상태
    const [price, setPrice] = useState(0);

    //체크리스트 변할때마다 상태업데이트
    useEffect(() => {
        const aaa = async () => {
            const bookingVo = {
                bookingStatusVO: bookingStatus,
                seatReservationDto: seatTypesReservation
            };

            const response = await axios.post('/booking/price', bookingVo);
            setPrice(response.data);
        };

        aaa();
    }, [checkedSeats]);




    //새로고침 함수
    const reloadPage = () => {
        window.location.reload();
    };
    //테이블렌더링을 위한 상태
    const [seatReservationStatus, setSeatReservationStatus] = useState([]);

    //좌석예약 데이터
    const [seatTypesReservation, setSeatTypesReservation] = useState([]);

    const location = useLocation();
    const scheduleNo = location.state.scheduleNo;
    //예매에 필요한데이터 상영일정번호 , 유저아이디 , 결제방법


    const [bookingStatus, setBookingStatus] = useState({
        movieScheduleNo: scheduleNo,
        userId: loginId,
        paymentMethod: '현장결제'
    });

    const navigate = useNavigate();
    //예매등록 전송버튼
    const addBooking = async () => {
        try {
            const bookingVo = {
                bookingStatusVO: bookingStatus,
                seatReservationDto: seatTypesReservation
            };

            const response = await axios.post('/booking/bookingAdd', bookingVo);
            navigate('/bookingComplete');


        } catch (error) {
            console.error('에러임임임 data:', error)
            const errorMessage = error.response?.data || 'An error occurred';

            alert(errorMessage); // 사용자에게 에러 메시지 표시
            reloadPage();
        }
    };




    //셀렉트값 변경함수
    const handlePaymentMethodChange = (event) => {
        const newPaymentMethod = event.target.value;
        setBookingStatus(prevStatus => ({
            ...prevStatus,
            paymentMethod: newPaymentMethod
        }));
    };


    //위 데이터가져오는 조회코드
    const loadData = useCallback(async () => {
        const rrsspp = await axios.get(`/booking/seatReservationStatus/${bookingStatus.movieScheduleNo}`);
        setSeatReservationStatus(rrsspp.data);
    }, []);

    useEffect(() => {
        loadData();
    }, []);


    //테이블렌더링을위한 상태
    const maxRow = Math.max(...seatReservationStatus.map(seat => seat.cellX));
    const maxCol = Math.max(...seatReservationStatus.map(seat => seat.cellY));


    //체크된 좌석을 나타내는상태 < 아마 좌석예약에 필요한상태 일거임 예) 좌석타입번호 : 3 , 회원타입 : 경로 >



    //체크된애들 확인위해 콘솔에 찍는코드
    // useEffect(() => {
    //     console.log('checkedSeats 상태가 변경되었습니다:', checkedSeats);
    // }, [checkedSeats]);


    //총 좌석고를수잇는 카운트 수
    const [availableSeatCount, setAvailableSeatCount] = useState(0);
    //버튼누를떄 추가되는 카운트 수 
    const [buttonCount, setButtonCount] = useState(0);

    //버튼카운트랑 , 체크된애들 바뀔때마다 총카운트 갱신
    useEffect(() => {
        const checkedSeatCount = Object.keys(checkedSeats).length;
        setAvailableSeatCount(Math.max(0, buttonCount - checkedSeatCount));
    }, [checkedSeats, buttonCount]);

    //총카운트 확인하기위한 콘솔창
    // useEffect(() => {
    //     console.log(' 체크가능수 :::::', availableSeatCount);
    // }, [availableSeatCount]);

    //  셀스타일
    const getCellStyleNone = () => ({
        width: "30px",
        height: "30px",
        border: "none",
        backgroundColor: "transparent"
    });

    const getCellStyleBasic = (seat, isChecked) => {
        let baseStyle = {
            width: "30px",
            height: "30px",
            border: isChecked ? "4px solid green" : "1px solid black",
            backgroundColor: "lightgray",
            textAlign: "center",
            fontSize: "10px",
        };

        if (seat.seatType === "장애인") {
            baseStyle = {
                ...baseStyle,
                backgroundColor: "pink",
            };
        } else if (seat.seatType === "스위트") {
            baseStyle = {
                ...baseStyle,
                backgroundColor: "yellow",
            };
        } else if (seat.seatType === "라이트") {
            baseStyle = {
                ...baseStyle,
                backgroundColor: "white",
            };
        }

        return baseStyle;

    };

    const getCellStyleUnavailable = () => ({
        width: "30px",
        height: "30px",
        border: "1px solid black",
        backgroundColor: "red",
        textAlign: "center"
    });

    const getCellStyleXzero = () => ({
        width: "30px",
        height: "30px",
        border: "none",
        backgroundColor: "transparent"
    });


    //체크 메서드 그냥 고르기만가능 -------이거수정필요 누르면 체크상태에 좌석타입번호랑 , 회원타입이들어가야함
    const toggleSeatCheck = (cellX, cellY) => {
        const seatKey = `${cellX}-${cellY}`;

        // 이미 체크된 좌석은 토글하지 않음
        if (checkedSeats[seatKey]) {
            return;
        }

        // 좌석 정보 검색
        const targetSeat = seatReservationStatus.find(seat => seat.cellX === cellX && seat.cellY === cellY);

        // 좌석이 활성화 상태인지 확인하고, 조건에 맞는 경우 상태 업데이트
        if (targetSeat && targetSeat.seatActive === '활성화') {
            const seatTypesNo = targetSeat.seatTypesNo; // 좌석 타입 번호
            const memberType = ticketType.ticketType; // 회원 타입

            // 체크 상태 업데이트
            setCheckedSeats(prev => ({
                ...prev,
                [seatKey]: {
                    checked: !prev[seatKey]?.checked, // 토글 동작

                }
            }));

            // 좌석 타입 및 회원 유형 정보를 seatTypesReservation에 추가
            setSeatTypesReservation(prev => [...prev, { seatTypesNo, memberType }]);
        }
    };


    //회원유형 화면에 보여주기위한 코드
    const [ticketType, setTicketType] = useState({
        ticketType: ""
    });


    //좌석테이블 렌더링하는 테이블코드
    const renderTable = () => {
        let table = [];

        for (let cellX = 1; cellX <= maxRow; cellX++) {
            let tableRow = [];

            for (let cellY = 1; cellY <= maxCol; cellY++) {
                const seat =
                    seatReservationStatus.find(seat => seat.cellX === cellX && seat.cellY === cellY);
                const isChecked = checkedSeats[`${cellX}-${cellY}`];
                let cellContent;
                let cellStyle;

                if (seat) {
                    if (seat.seatX === 0) {
                        cellStyle = getCellStyleXzero();
                        cellContent = seat.seatY;
                    } else if (seat.reservationStatus === "예약완료") {
                        cellStyle = getCellStyleUnavailable();
                        cellContent = seat.seatX;
                    } else if (seat.seatX !== 0 && (seat.cellActive === "비활성화" || seat.seatActive === "비활성화")) {
                        cellStyle = getCellStyleNone();
                        cellContent = "";
                    } else {
                        // `getCellStyleBasic` 함수에 `seat`를 매개변수로 추가하세요.
                        cellStyle = getCellStyleBasic(seat, isChecked);
                        cellContent = seat.seatX;
                    }
                } else {
                    // 좌석을 찾지 못한 경우 처리
                    cellStyle = getCellStyleNone();
                    cellContent = "";
                }

                tableRow.push(
                    <td key={`${cellX}-${cellY}`} style={cellStyle}>
                        {seat && seat.seatActive === "활성화" && seat.reservationStatus !== "예약완료" ?
                            (
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ padding: '0', margin: '0', width: '100%', height: '100%' }}
                                    onClick={(e) => {
                                        e.stopPropagation();  // 버튼 클릭 시 td의 onClick 이벤트가 발생하지 않도록 중단
                                        toggleSeatCheck(cellX, cellY);
                                    }}

                                >
                                    {cellContent}
                                </button>
                            ) : (cellContent)
                        }
                    </td>
                );
            }
            table.push(<tr key={`cellX-${cellX}`}>{tableRow}</tr>);
        }
        return <table className="mx-auto"><tbody>{table}</tbody></table>;

    };

    //총카운트 0이냐 아니냐에따라 어떤거 잠굴지 고르는코드
    useEffect(() => {

        const targetSeats = document.getElementById('targetSeats');
        const targetCount = document.getElementById('targetCount');

        if (availableSeatCount === 0) {
            targetSeats.style.pointerEvents = 'none'; // 마우스 블록
            targetSeats.style.opacity = '0.3'; // 투명하게 표시

            targetCount.style.pointerEvents = 'auto'; // 마우스 허용
            targetCount.style.opacity = '1'; // 불투명하게 표시
        } else {
            targetCount.style.pointerEvents = 'none'; // 마우스 블록
            targetCount.style.opacity = '0.3'; // 투명하게 표시

            targetSeats.style.pointerEvents = 'auto'; // 마우스 허용
            targetSeats.style.opacity = '1'; // 불투명하게 표시
        }
    }, [availableSeatCount]);

    //버튼이랑 기타 자질구리하게 쓰일코드
    const categories = ['일반', '청소년', '경로', '우대'];

    //아래두개 버튼생성코드1
    const addButtonValue = (value) => {
        setButtonCount(prevCount => prevCount + value);
    };

    //버튼생성코드2
    const renderButtons = (category) => {
        const buttonsPerCategory = [];
        for (let i = 1; i <= 8; i++) {
            buttonsPerCategory.push(
                <button key={i}
                    onClick={() => {
                        addButtonValue(i);
                        updateTicketType(category);
                    }
                    }
                >{i}</button>
            );
        }
        return buttonsPerCategory;
    };

    //화면에 보일 회원유형 업데이트하는 코드
    const updateTicketType = (category) => {
        setTicketType({ ticketType: category });
    };

    //버튼생성코드3
    const renderDivs = () => {
        return categories.map((category, index) => (
            <div key={index} className="row">
                <div className="col-3">
                    <label className="mx-3">{category}</label>
                </div>
                <div className="col-9">
                    {renderButtons(category)}
                </div>
            </div>
        ));
    };



    return (
        <>
            <br/>
            <br/>
            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div>
                        <h3 className="text-left mb-2">
                            선택가능좌석수: <span className="text-primary">{availableSeatCount}</span>
                        </h3>
                    </div>
                    <div>
                        <h3 className="text-left mb-2">
                            티켓타입: <span className="text-success">{ticketType.ticketType}</span>
                        </h3>
                    </div>


                    <div className="row" id="targetCount">
                        <div className="col-6 mt-4" style={{ borderRight: '1px solid #ccc' }}>
                            {renderDivs()}
                        </div>

                        <div className="col-6">

                            <ul>
                                <li><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: 'lightgray', border: '1px solid black' }}></span> 기본 좌석</li>
                                <li><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: 'pink', border: '1px solid black' }}></span> 장애인 좌석</li>
                                <li><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: 'yellow', border: '1px solid black' }}></span> 스위트 좌석</li>
                                <li><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: 'white', border: '1px solid black' }}></span> 라이트 좌석</li>
                                <li><span style={{ display: 'inline-block', width: '15px', height: '15px', backgroundColor: 'red', border: '1px solid black' }}></span> 예약 완료 좌석</li>
                            </ul>

                        </div>
                    </div>


                    <hr></hr>
                    <div id="targetSeats">
                        {renderTable()}
                    </div>
                    <hr></hr>
                </div>

                <div className="col-lg-8 text-end pe-5">
                    <label className="fs-4 fw-bold">가격 : </label> <label className="fs-4 fw-bold">{price} 원</label>
                </div>

                <div className="col-lg-8">
                    <hr></hr>
                </div>

                <div className="col-lg-8 ">
                    <div className="d-flex justify-content-between mb-3">
                        <button type="button" className="btn btn-primary "
                            onClick={
                                () => {
                                    reloadPage();
                                }
                            }>좌석 다시선택</button>
                    </div>
                    <div className="form-group text-end mb-5">
                        <label htmlFor="paymentMethod">결제 수단 선택</label>
                        <select value={bookingStatus.paymentMethod} className="form-select d-inline-block w-auto me-3"
                            onChange={handlePaymentMethodChange}>
                            <option value="현장결제">현장결제</option>
                            <option value="카카오페이">카카오페이결제</option>
                            <option value="카드결제">카드결제</option>
                        </select>

                        <button type="button" className="btn btn-dark"
                            onClick={
                                () => {
                                    addBooking();
                                }
                            }>예매하기</button>

                    </div>

                    <div className="col-lg-8">

                    </div>

                    <div >


                    </div>

                </div>



            </div>
        </>
    )
}

export default BookingAdd;