import { useRecoilState } from 'recoil';
import { loginIdState } from '../../utils/RecoilData';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from '../../utils/CustomAxios';
import Pagination from '../../service/Pagination';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'bootstrap';

//아이콘
import { TfiWrite } from "react-icons/tfi";


const MyReservation = () => {
    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [myReservationPerPage] = useState(10);

    const [userId] = useRecoilState(loginIdState);
    const [myReservationList, setMyReservationList] = useState([]);
    const [myDetailList, setMyDetailList] = useState([]);

    const [btnReservation, setBtnReservation] = useState(false);

    useEffect(() => {
        loadMyReservationList();
    }, []);

    const loadMyReservationList = useCallback(async () => {
        try {
            const resp = await axios.get("/reservation/listBy/" + userId);
            setMyReservationList(resp.data);
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [userId]);

    const indexOfLastReservation = currentPage * myReservationPerPage;
    const indexOfFirstReservation = indexOfLastReservation - myReservationPerPage;
    const currentReservations = myReservationList.slice(indexOfFirstReservation, indexOfLastReservation);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    //리뷰등록관련
    const bsModal = useRef();
    const openModal = useCallback(() => {
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);
    const closeModal = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    //등록날짜
    const today = new Date();
    function toChar() {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    const [input, setInput] = useState({});
 
    const reviewWrite = useCallback(async (reserve)=>{
        const reviewDate = toChar();
        setInput({
            reviewWriter:userId,
            reviewDate:reviewDate,
            reservationNo:reserve.reservationNo,
            movieNo:reserve.movieNo
        });
        const data = {
            reviewWriter: userId,
            movieNo: reserve.movieNo
        };
        const resp = await axios.post("/review/valid", data);
        if(resp.data === false) {
            window.alert ("후기가 이미 작성되었습니다.");
            return;
        }
            
        const currentDate = new Date();
        const currentDateString = currentDate.toISOString().split('T')[0]; 
        const isPassed = currentDateString >= reserve.startDate;
        //영화 상영일이 오늘보다 미래이면..
        if(!isPassed) {
            window.alert(
            `후기는 상영종료 후 작성 가능합니다. ${reserve.startDate} ${reserve.endTime} 종료`);
            return;
        }
        //영화 상영일이 오늘인 경우에만 시간이 지났는지 검사 
        if (reserve.startDate === currentDateString) {
            const [endHour, endMinute] = reserve.endTime.split(':').map(Number);
            
            const currentHour = currentDate.getHours();
            const currentMinute = currentDate.getMinutes();
    
            if (endHour > currentHour || (endHour === currentHour && endMinute > currentMinute)) {
                window.alert(`후기는 상영종료 후 작성 가능합니다. 종료시간은 ${reserve.endTime}입니다.`);
            } else {
                openModal();
            }
        } else {
            openModal();
        }
    },[input]);
    
    
    //입력값취소
    const cancelInput = useCallback(() => {
        setInput({
            ...input,
            reviewContent:''
        });
        closeModal();
    }, [input]);

    const changeResult = (e) => {
        const name = e.target.name;
        if (name === 'reviewContent') {
            const isValid = e.target.value.length > 0 && byteCount >= 15;
            setResult ({
                reviewContent:isValid
            })
        }
    };
    const navigate = useNavigate();
    //후기등록
    const saveInput = useCallback(async ()=>{
        const resp = await axios.post("/review/", input);
        window.alert("후기작성완료! 500포인트가 지급되었습니다.")
        cancelInput();
        loadMyReservationList();
    },[input]);

    const [result, setResult] = useState({
        reviewContent: null
    });
    const isOk = useMemo(()=>{
        return result.reviewContent;
    },[result]);

    //textarea등록
    function countBytes(str) {
        return encodeURI(str).split(/%..|./).length - 1;
    }
    const [byteCount, setByteCount] = useState(0);
    const maxBytes = 450;
    const handleChange = (event) => {
        const inputText = event.target.value;
        const bytes = countBytes(inputText);
        if (bytes < maxBytes) {
            setInput({
                ...input,
                reviewContent: inputText
            })
            setByteCount(bytes);
        } else {
            alert('허용된 최대 바이트 수를 초과했습니다.');
        }
    };

    return (
        <>
            <div className="row" >

                {myReservationList.length === 0 ? ( //구매내역이 없는 경우
                    <>
                        <div className="phoenix-side-title center" >
                            나의 예매 내역
                            <br />...
                        </div>

                        <div className='center mt-4'>
                            <h1>예매 내역이 없어요</h1>
                            <h4>예매하러 가시겠습니까?</h4>
                            <Link to={`/booking`} className='btn btn-dark w-50 btn-lg mt-4'>예매하러 가기</Link>
                        </div>

                    </>
                ) : ( //구매내역이 있는데
                    btnReservation === false ? ( //상세보기가 아닌경우
                        <>
                            <div className="phoenix-side-title" >
                                나의 예매 내역
                            </div>

                            {/* <div className='mb-4 mt-4' style={{ textAlign: 'right' }}>
                                <select value={selectedPeriod} onChange={handlePeriodChange}>
                                    <option value={1}>1 개월</option>
                                    <option value={3}>3 개월</option>
                                    <option value={6}>6 개월</option>
                                </select>
                            </div> */}


                            <table className="table table-hover mt-4">
                                <thead>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th>#</th>
                                        <th style={{ width: "30%" }}>영화제목</th>
                                        <th>상영일</th>
                                        <th>종류</th>
                                        <th>결제금액</th>
                                        <th>결제상태</th>
                                        <th>리뷰쓰기</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReservations.map((reserve, index) => (
                                        <tr key={index} style={{ textAlign: 'center' }}>
                                            <td>{index + 1}</td>
                                            <td>{reserve.movieTitle}</td>
                                            <td>{reserve.startDate}</td>
                                            <td>{reserve.movieScreenType}</td>
                                            <td>{(reserve.totalPrice).toLocaleString()}원</td>
                                            <td>{reserve.paymentStatus}</td>
                                            <td>
                                                <button className="btn btn-dark btn-sm" onClick={e=>reviewWrite(reserve)}><TfiWrite /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Pagination currentPage={currentPage} totalPages={Math.ceil(myReservationList.length / myReservationPerPage)} paginate={paginate} />
                        </>
                    ) : ( //상세보기인 경우
                        <>

                        </>
                    )

                )}

            </div>

            {/* 리뷰쓰기 모달창 */}
            <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" style={{ backgroundColor: 'rgb(56,52,54)', color: 'white' }}>
                            <h1 className="modal-title fs-5" id="staticBackdropLabel" style={{ fontWeight: 'bold' }}>
                                리뷰 작성
                            </h1>
                            <button type="button" className="btn-close" aria-label="Close"
                                onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 화면 */}

                            <div className="row">
                                <div className="col">
                                    <label>나의 리뷰</label> <span style={{ color: 'gray' }}>({byteCount}/{maxBytes} bytes)</span>
                                    <textarea name="reviewContent"
                                        value={input.reviewContent}
                                        onChange={e => handleChange(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.reviewContent === true ? 'is-valid' : ''}
                                        ${result.reviewContent === false ? 'is-invalid' : ''}
                                        `} 
                                        style={{ whiteSpace: 'pre-wrap', minHeight: '100px', resize: 'none', overflow: 'auto' }} placeholder='5자 이상 입력하세요'/>
                                </div>
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-dark me-2' onClick={e => saveInput()} disabled={isOk !== true}>
                                등록
                            </button>
                            <button className='btn btn-primary' onClick={e => cancelInput()}>
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default MyReservation;