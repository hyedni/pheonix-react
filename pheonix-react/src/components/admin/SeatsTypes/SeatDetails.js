import { useRecoilState } from "recoil";
import { seatsState } from '../../utils/RecoilData';
import React, { useEffect, useState } from 'react';
import axios from '../../utils/CustomAxios';

function SeatDetails() {

    const [seats, setSeats] = useRecoilState(seatsState);

    useEffect(() => {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
        let activeSeatsCounterForRow = {};
        let activeRowCount = {};
    
        // 1차 업데이트: 좌석 번호만 할당
        const intermediateSeats = seats.map((seat) => {
            if (seat.cellActive === '활성화') {
                // 행별로 좌석 수를 세고, 좌석 번호를 할당
                if (!activeSeatsCounterForRow[seat.cellX]) {
                    activeSeatsCounterForRow[seat.cellX] = 0;
                }
                activeSeatsCounterForRow[seat.cellX] += 1;
    
                // 열별로 알파벳을 할당
                if (!activeRowCount[seat.cellY]) {
                    activeRowCount[seat.cellY] = 1;
                } else {
                    activeRowCount[seat.cellY] += 1;
                }
    
                let xValue = activeSeatsCounterForRow[seat.cellX] - 1;
                let yValue = alphabet[activeRowCount[seat.cellY] - 1];
    
                // 첫 번째 단계에서 좌석 번호만 할당
                return { ...seat, seatX: xValue, seatY: yValue };
            }
            return seat;
        });
    
        // 2차 업데이트: seatY가 0이 아닌 경우 활성화
        const updatedSeats = intermediateSeats.map((seat) => {
            if (seat.seatX !== undefined && seat.seatX !== 0) {
                // 추가 데이터를 할당
                return { ...seat, seatActive: '활성화', seatType: '일반' };
            }
            return seat;
        });
    
        setSeats(updatedSeats);
    }, []);


    useEffect(() => {
        console.log('seats 상태 확인:', seats);
    }, [seats]);

    const maxRow = Math.max(...seats.map(seat => seat.cellX));
    const maxCol = Math.max(...seats.map(seat => seat.cellY));

    // 좌석 상태에 따라 테이블 셀을 스타일링합니다.
    const getCellStyle = (seat, isChecked) => {
        // 기본 스타일
        let baseStyle = {
            width: "30px",
            height: "30px",
            border: isChecked ? "4px solid green" : "1px solid black",
            backgroundColor: "lightgray",
            textAlign: "center",
            fontSize: "10px",
        };

        // 좌석 상태에 따른 스타일 적용
        if (seat.seatActive === "비활성화") {
            baseStyle = {
                ...baseStyle,
                backgroundColor: "black", // 배경을 옅게

            };
        } else if (seat.seatType === "장애인") {
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

    const [checkedSeats, setCheckedSeats] = useState({});

    const toggleSeatCheck = (cellX, cellY) => {
        const targetSeat = seats.find(seat => seat.cellX === cellX && seat.cellY === cellY);
        if (targetSeat && targetSeat.cellActive === '활성화') {
            // 활성화 상태인 경우에만 체크 상태를 토글
            setCheckedSeats(prev => ({
                ...prev,
                [`${cellX}-${cellY}`]: !prev[`${cellX}-${cellY}`]
            }));
        }
    };

    const activateSeat = () => {
        const updatedSeats = seats.map(seat => {
            const seatKey = `${seat.cellX}-${seat.cellY}`;
            if (checkedSeats[seatKey]) {
                return {
                    ...seat,
                    seatActive: '활성화'
                };
            }
            return seat;
        });
        setSeats(updatedSeats);
        resetCheckedSeats();
    };

    const deactivateSeat = () => {
        const updatedSeats = seats.map(seat => {
            const seatKey = `${seat.cellX}-${seat.cellY}`;
            if (checkedSeats[seatKey]) {
                return {
                    ...seat,
                    seatActive: '비활성화' // 활성화 상태 업데이트
                };
            }
            return seat;
        });
        setSeats(updatedSeats);
        resetCheckedSeats();
    };

    const setSeatTypeStandard = () => {
        const updatedSeats = seats.map(seat => {
            const seatKey = `${seat.cellX}-${seat.cellY}`;
            if (checkedSeats[seatKey]) {
                return {
                    ...seat,
                    seatType: '일반' // 활성화 상태 업데이트
                };
            }
            return seat;
        });
        setSeats(updatedSeats);
        resetCheckedSeats();
    };

    const setSeatTypeLight = () => {
        const updatedSeats = seats.map(seat => {
            const seatKey = `${seat.cellX}-${seat.cellY}`;
            if (checkedSeats[seatKey]) {
                return {
                    ...seat,
                    seatType: '라이트' // 활성화 상태 업데이트
                };
            }
            return seat;
        });
        setSeats(updatedSeats);
        resetCheckedSeats();
    };

    const setSeatTypeAccessible = () => {
        const updatedSeats = seats.map(seat => {
            const seatKey = `${seat.cellX}-${seat.cellY}`;
            if (checkedSeats[seatKey]) {
                return {
                    ...seat,
                    seatType: '장애인' // 활성화 상태 업데이트
                };
            }
            return seat;
        });
        setSeats(updatedSeats);
        resetCheckedSeats();
    };

    const setSeatTypeSuite = () => {
        const updatedSeats = seats.map(seat => {
            const seatKey = `${seat.cellX}-${seat.cellY}`;
            if (checkedSeats[seatKey]) {
                return {
                    ...seat,
                    seatType: '스위트' // 활성화 상태 업데이트
                };
            }
            return seat;
        });
        setSeats(updatedSeats);
        resetCheckedSeats();
    };

    const resetCheckedSeats = () => {
        setCheckedSeats({});
    };

    // 테이블을 생성하는 함수입니다.
    const renderTable = () => {
        let table = [];

        for (let cellX = 1; cellX <= maxRow; cellX++) {
            let tableRow = [];
            for (let cellY = 1; cellY <= maxCol; cellY++) {
                const seat = seats.find(seat => seat.cellX === cellX && seat.cellY === cellY);
                const isChecked = checkedSeats[`${cellX}-${cellY}`];  // 이 좌석의 체크 상태를 확인
                let cellContent = "";
                let cellStyle = getCellStyle(seat, isChecked);  // isChecked를 기반으로 스타일을 동적으로 가져옴

                if (seat && seat.cellActive === "활성화") {
                    // 활성화 상태인 좌석이라면 cellContent를 업데이트
                    cellContent = seat.seatX === 0 ? `${seat.seatY}` : `${seat.seatX}`;
                }
                else {
                    // 활성화 상태가 아닌 좌석에 대한 스타일
                    cellStyle = { ...getCellStyle(seat, false), border: 'none', backgroundColor: 'transparent' };
                }

                tableRow.push(
                    <td key={`${cellX}-${cellY}`} style={cellStyle} onClick={() => toggleSeatCheck(cellX, cellY)}>
                        {seat && seat.cellActive === "활성화" ? (
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
                        ) : (
                            cellContent
                        )}
                    </td>
                );
            }
            table.push(<tr key={`cellX-${cellX}`}>{tableRow}</tr>);
        }

        return <table className="mx-auto"><tbody>{table}</tbody></table>;
    };
    return (
        <>
            <div className="row justify-content-center">
                <div className="col-lg-12">



                    <h1 className="text-center">좌석 설정</h1>
                    {renderTable()} {/* 함수 호출 수정*/}

                    <hr></hr>
                    <div>
                        <button onClick={activateSeat} className="btn btn-primary">좌석상태 활성화버튼</button>
                        <button onClick={deactivateSeat} className="btn btn-dark">좌석상태 비활성화버튼</button>
                    </div>

                    <hr></hr>
                    <div>
                        <button onClick={setSeatTypeStandard} className="btn btn-success">좌석타입 일반</button>
                        <button onClick={setSeatTypeLight} className="btn btn-light">좌석타입 라이트</button>
                        <button onClick={setSeatTypeAccessible} className="btn btn-primary">좌석타입 장애인</button>
                        <button onClick={setSeatTypeSuite} className="btn btn-info">좌석타입 스위트</button>
                    </div>

                    <hr></hr>
                    <div>
                        
                        <button onClick={resetCheckedSeats} className="btn btn-danger">좌석 체크 초기화</button>
                    </div>

                </div>
            </div>
        </>
    )
}

export default SeatDetails;