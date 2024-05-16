import { useRecoilState } from 'recoil';
import { loginIdState } from '../../utils/RecoilData';
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from '../../utils/CustomAxios';
import Pagination from '../../service/Pagination';
import { Link } from 'react-router-dom';
//아이콘
import { FaMagnifyingGlass } from "react-icons/fa6";
import { FaArrowAltCircleLeft } from "react-icons/fa";


const MyStore = () => {
    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [mystorePerPage] = useState(10);

    const [userId] = useRecoilState(loginIdState);
    const [myPurchaseList, setMyPurchaseList] = useState([]);
    const [myDetailList, setMyDetailList] = useState([]);
    const [myOnePurchase, setMyOnePurchase] = useState([]);

    const [btnPurchase, setBtnPurchase] = useState(false);

    const [selectedPeriod, setSelectedPeriod] = useState(1); // 기본값은 1달


    useEffect(() => {
        loadMyPurchaseList();
    }, [selectedPeriod]);


    const loadMyPurchaseList = useCallback(async () => {
        try {
            const resp = await axios.get("/purchase/myPurchaseList");
            setMyPurchaseList(resp.data);
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [selectedPeriod]);

    const handlePeriodChange = (e) => {
        setSelectedPeriod(parseInt(e.target.value));
    };
    const filterByPeriod = useCallback(() => {
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - selectedPeriod);
        return myPurchaseList.filter(purchase => new Date(purchase.paymentTime) >= startDate);
    }, [myPurchaseList, selectedPeriod]);


    const loadMyDetailList = useCallback(async (paymentNo) => {
        try {
            const resp = await axios.get("/purchase/myPurchaseDetailList/" + paymentNo);
            setMyDetailList(resp.data);
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, []);

    const paginatedMyPurchaseList = useMemo(() => {
        return filterByPeriod().slice((currentPage - 1) * mystorePerPage, currentPage * mystorePerPage);
    }, [filterByPeriod, currentPage, mystorePerPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const moveToDetailPage = useCallback((paymentNo) => {
        setBtnPurchase(true);
        loadMyDetailList(paymentNo);
    }, []);


    return (
        <>
            <div className="row" >

                {paginatedMyPurchaseList.length === 0 ? ( //구매내역이 없는 경우
                    <>
                        <div className="phoenix-side-title" >
                            상품 결제 내역
                        </div>

                        <h1>구매한 상품이 없어요</h1>
                        <h4>구매하러 가시겠습니까?</h4>
                        <div className='col-6 mt-4'>
                            <Link to={`/store/package`} className='btn btn-dark w-100 btn-lg'>스토어 가기</Link>
                        </div>
                    </>
                ) : ( //구매내역이 있는데
                    btnPurchase === false ? ( //상세보기가 아닌경우
                        <>
                            <div className="phoenix-side-title" >
                                상품 결제 내역
                            </div>

                            <div className='mb-4 mt-4' style={{ textAlign: 'right' }}>
                                <select value={selectedPeriod} onChange={handlePeriodChange}>
                                    <option value={1}>1 개월</option>
                                    <option value={3}>3 개월</option>
                                    <option value={6}>6 개월</option>
                                </select>
                            </div>

                            

                            <table className="table table-hover">
                                <thead>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th>#</th>
                                        <th>상품명</th>
                                        <th>결제금액</th>
                                        <th>구매일</th>
                                        <th>구매상태</th>
                                        <td><FaMagnifyingGlass /></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedMyPurchaseList.map((purchase, index) => (
                                        <tr key={index} style={{ textAlign: 'center' }}>
                                            <td>{index + 1}</td>
                                            <td>{purchase.paymentName}</td>
                                            <td>{(purchase.paymentTotal).toLocaleString()}원</td>
                                            <td>{purchase.paymentTime}</td>
                                            <td>
                                                {purchase.paymentRemain === 0 ? "결제완료" : "환불"}
                                            </td>
                                            <td>
                                                <button className="btn btn-dark btn-sm" onClick={() => moveToDetailPage(purchase.paymentNo)}><FaMagnifyingGlass /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <Pagination currentPage={currentPage} totalPages={Math.ceil(myPurchaseList.length / mystorePerPage)} paginate={paginate} />
                        </>
                    ) : ( //상세보기인 경우
                        <>
                            <div className="phoenix-side-title" >
                                상품 상세 내역 <button className='btn' onClick={() => setBtnPurchase(false)}><FaArrowAltCircleLeft /> 이전</button>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr style={{ textAlign: 'center' }}>
                                        <th>#</th>
                                        <th>상품명</th>
                                        <th>가격</th>
                                        <th>상품수량</th>
                                        <th>총 금액</th>
                                        <th>상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myDetailList.map((purchase, index) => (
                                        <tr key={index} style={{ textAlign: 'center' }}>
                                            <td>{index + 1}</td>
                                            <td>{purchase.paymenDetailName}</td>
                                            <td>{(purchase.paymentDetailPrice).toLocaleString()}원</td>
                                            <td>{purchase.paymenDetailQty}</td>
                                            <td>{(purchase.paymentDetailPrice * purchase.paymentDetailQty).toLocaleString()}원</td>
                                            <td>{purchase.paymentDetailStatus}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )

                )}

            </div>
        </>
    );
}

export default MyStore;
