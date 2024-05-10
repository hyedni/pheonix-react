import { useCallback, useState, useEffect } from "react";
import axios from '../utils/CustomAxios';


function BookingAdd() {
    const [seatReservationStatus, setSeatReservationStatus] = useState([]);

    const loadData = useCallback(async () => {
        const rrsspp = await axios.get("/booking/seatReservationStatus/99");
        setSeatReservationStatus(rrsspp.data);
    }, []);

    useEffect(() => {
        loadData();
    }, []);

    const maxRow = Math.max(...seatReservationStatus.map(seat => seat.cellX));
    const maxCol = Math.max(...seatReservationStatus.map(seat => seat.cellY));
    const [checkedSeats, setCheckedSeats] = useState({});

    useEffect(() => {
        console.log('checkedSeats 상태가 변경되었습니다:', checkedSeats);
    }, [checkedSeats]);

    //여기서부터  좌석최종선택수 코드
    const [availableSeatCount, setAvailableSeatCount] = useState(0);
    const [buttonCount, setButtonCount] = useState(0);
    
    useEffect(() => {
        const checkedSeatCount = Object.keys(checkedSeats).length;
        setAvailableSeatCount(Math.max(0, buttonCount - checkedSeatCount));
    }, [checkedSeats,buttonCount]);

    useEffect(() => {
        console.log(' 체크가능수 :::::', availableSeatCount);
    }, [availableSeatCount ]);

    




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

    const toggleSeatCheck = (cellX, cellY) => {
        const seatKey = `${cellX}-${cellY}`;

        // 만약 이미 체크된 좌석이라면 아무 동작도 하지 않음
        if (checkedSeats[seatKey]) {
            return;
        }
    
        // 활성화된 좌석만 토글 가능하도록 함
        const targetSeat = seatReservationStatus.find(seat => seat.cellX === cellX && seat.cellY === cellY);
        if (targetSeat && targetSeat.seatActive === '활성화') {
            setCheckedSeats(prev => ({
                ...prev,
                [seatKey]: !prev[seatKey] // 상태를 토글
            }));
        }
    };


    const [ticketType, setTicketType] = useState({
        ticketType: ""
    });

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
                    } else if (seat.reservation === "예약완료") {
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
                        {seat && seat.seatActive === "활성화" && seat.reservation !== "예약완료" ?
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

    const categories = ['일반', '청소년', '경로', '우대'];

    const addButtonValue = (value) => {
        setButtonCount(prevCount => prevCount + value);
    };

    const renderButtons = (category) => {
        const buttonsPerCategory = [];
        for (let i = 1; i <= 8; i++) {
          buttonsPerCategory.push(
            <button key={i}
            onClick={() => {addButtonValue(i);
                updateTicketType(category);}
            }
            >{i}</button>
          );
        }
        return buttonsPerCategory;
      };

      const updateTicketType = (category) => {
        console.log(`Updating ticket type to: ${category}`);
    setTicketType({ ticketType: category });
    console.log('Current state:', { ticketType: category });
    };

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

            <div className="row justify-content-center">
                <div className="col-lg-8">

                    <div><h3 className="text-center">선택가능좌석수 : {availableSeatCount}</h3></div>
                    <div><h3 className="text-center">티켓타입 : {ticketType.ticketType}</h3></div>


                    <div className="row" id="targetCount">
                        <div className="col-6">
                            {renderDivs()}
                        </div>
                        <div className="col-6">

                        </div>
                    </div>


                    <hr></hr>
                    <div id="targetSeats">
                        {renderTable()}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BookingAdd;