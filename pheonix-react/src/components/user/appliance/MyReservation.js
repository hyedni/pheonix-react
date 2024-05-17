import { useRecoilState } from 'recoil';
import { loginIdState } from '../../utils/RecoilData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '../../utils/CustomAxios';
import Pagination from '../../service/Pagination';
import { Link } from 'react-router-dom';

//아이콘
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaArrowAltCircleLeft } from "react-icons/fa";


const MyReservation = () => {
    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [myReservationPerPage] = useState(10);

    const [userId] = useRecoilState(loginIdState);
    const [myReservationList, setMyReservationList] = useState([]);
    const [myDetailList, setMyDetailList] = useState([]);

    const [btnreserve, setBtnreserve] = useState(false);

    useEffect(() => {
        loadMyReservationList();
    }, []);

    const loadMyReservationList = useCallback(async () => {
        try {
            const resp = await axios.get("/reservation/" + userId);
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
                    btnreserve === false ? ( //상세보기가 아닌경우
                        <>
                            <div className="phoenix-side-title" >
                                나의 예매 내역
                            </div>


                            <table className="table table-hover">
                                <thead>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th>#</th>
                                        <th>내용</th>
                                        <th>예매일</th>
                                        <th>결제금액</th>
                                        <th>결제방법</th>
                                        <th>상태</th>
                                        <td><FaMagnifyingGlass /></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentReservations.map((reserve, index) => (
                                        <tr key={index} style={{ textAlign: 'center' }}>
                                            <td>{index + 1}</td>
                                            <td></td>
                                            <td>{(reserve.totalPrice).toLocaleString()}원</td>
                                            <td>{reserve.reservationDate}</td>
                                            <td>{reserve.paymentMethod}</td>
                                            <td>{reserve.paymentStatus}</td>
                                            <td>
                                                <button className="btn btn-dark btn-sm" ><FaMagnifyingGlass /></button>
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

        </>
    );
};

export default MyReservation;