import { useCallback, useEffect, useState, useRef } from 'react';
import './AdminCinema.css';
import axios from "../utils/CustomAxios";
import { FaPhoneFlip } from "react-icons/fa6";
import { Modal } from 'bootstrap';
import React from 'react';
import DaumPostcodeEmbed from 'react-daum-postcode';
import PostApi from './PostApi';

function AdminCinema() {

    const [cinemas, setCinemas] = useState([]);
    const [region, setRegion] = useState({
        cinemaNo: ''
    });
    // 1건 조회결과 (상세정보)
    const [detailCinema, setDetailCinema] = useState({
        cinemaNo: 1,
        cinemaName: 'pnix강남점',
        cinemaTotalTheater: 5,
        cinemaRegion: '서울',
        cinemaPost: '123456',
        cinemaAddress1: '서울시 강남구 언주로 123',
        cinemaAddress2: '1층',
        cinemaManager: '김대리',
        cinemaManagerCall: '01012345678',
        cinemaCall: '02-1234-5678'
    });

    const selectedRegion = useCallback(async (target) => {
        setRegion({
            cinemaNo: target.cinemaNo
        });
        const resp = await axios.get("/cinema/" + target.cinemaNo);
        setDetailCinema(resp.data);
    }, [region]);

    const loadList = useCallback(async () => {
        const resp = await axios.get("/cinema/");
        setCinemas(resp.data);
    }, []);

    useEffect(() => {
        loadList();
    }, []);

    const [isClicked, setIsClicked] = useState(false);
    const showNum = () => {
        setIsClicked(!isClicked); // isClicked 상태를 반전시키는 함수
    };

    //모달
    const bsModal = useRef();
    const openModal = useCallback(() => {
        const modal = new Modal(bsModal.current);
        modal.show();
    }, [bsModal]);
    const closeModal = useCallback(() => {
        const modal = Modal.getInstance(bsModal.current);
        modal.hide();
    }, [bsModal]);

    const [input, setInput] = useState({
        cinemaName: "",
        cinemaTotalTheater: "",
        cinemaRegion: "",
        cinemaPost: "",
        cinemaAddress1: "",
        cinemaAddress2: "",
        cinemaManager: "",
        cinemaManagerCall: "",
        cinemaCall: ""
    });

    //입력값취소
    const cancelInput = useCallback(() => {
        setInput({
            cinemaName: "",
            cinemaTotalTheater: "",
            cinemaRegion: "",
            cinemaPost: "",
            cinemaAddress1: "",
            cinemaAddress2: "",
            cinemaManager: "",
            cinemaManagerCall: "",
            cinemaCall: ""
        });
        closeModal();
    }, [input]);

    //등록처리
    const saveInput = useCallback(async () => {
        await axios.post("/cinema/", input);
        loadList();
        cancelInput();
        closeModal();
    }, [input]);

    //등록하기(입력값 input state에 저장)
    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    return (
        <>

            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        영화관 관리
                    </div>
                </div>
            </div>
            <hr />

            <div className="row" style={{ marginTop: '30px' }}>
                <div className="offset-2 col-md-8">
                    {/* 지역리스트 */}
                    <div className='cinema-wrapper table-responsive'>
                        <ul className="region-ul">
                            <li className="region-li">
                                <div className='region-wrapper'>
                                    <li className='region-li'>서울</li>
                                    <li className='region-li' style={{ color: 'gray' }}>경기(준비중)</li>
                                </div>
                                <div>
                                    <ul className="inner-ul">
                                        {cinemas.map((cinema) => (
                                            <li key={cinema.no} onClick={e => selectedRegion(cinema)}
                                                style={{ borderRight: '1px solid gray', paddingRight: '0.5em' }}>
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

            <div className='row'>
                <div className='offset-2 col-lg-8'>
                    <img src={"/image/theater.png"} style={{ width: '100%', height: 'auto', marginBottom: '30px', borderRadius: '10px' }} />
                </div>
                {/* 지점이름 */}
                <div className='offset-2 col-lg-8' style={{ marginBottom: '20px' }}>
                    <span style={{ color: 'black', fontWeight: 'bold', fontSize: '30px' }}>{detailCinema.cinemaName}</span>
                </div>
                <div className='offset-2 col-lg-8'>
                    <img src={"/image/pheonix.png"} style={{ width: '100%', height: '500px', marginBottom: '30px', borderRadius: '10px' }} />
                </div>
                <div className='offset-2 col-lg-8'>
                    <img src={"/image/ad1.png"} style={{ width: '100%', height: '100px', marginBottom: '30px', borderRadius: '10px' }} />
                </div>
            </div>

            <div className='row'>
                <div className='offset-2 col-lg-8'>
                    <table className='table table-hover'>
                        <tbody>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>관리번호</td>
                                <td>{detailCinema.cinemaNo}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>영화관명</td>
                                <td>{detailCinema.cinemaName}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>총 상영관 수</td>
                                <td>{detailCinema.cinemaTotalTheater}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>주소</td>
                                <td>({detailCinema.cinemaPost}) &nbsp;
                                    {detailCinema.cinemaAddress1} &nbsp;
                                    {detailCinema.cinemaAddress2}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>책임자</td>
                                {/* 관리자일 경우만 책임자연락처 조회버튼 보이도록 수정 필요 */}
                                {isClicked === false ? (
                                    <>
                                        <td>{detailCinema.cinemaManager} &nbsp; &nbsp; <FaPhoneFlip onClick={showNum} /> click!</td>
                                    </>
                                ) : (
                                    <>
                                        <td>{detailCinema.cinemaManager} &nbsp; &nbsp; <FaPhoneFlip onClick={showNum} /> click!
                                            &nbsp; &nbsp; {detailCinema.cinemaManagerCall}
                                        </td>
                                    </>
                                )}
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold' }}>영화관 연락처</td>
                                <td>{detailCinema.cinemaCall}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className='row'>
                <div className='offset-2 col-lg-8 d-flex justify-content-end' style={{ marginBottom: '30px' }}>
                    <button className='btn btn-dark' style={{ marginRight: '10px' }}>수정하기</button>
                    <button className='btn btn-dark' style={{ marginRight: '10px' }} onClick={e => openModal()}>new 영화관 등록</button>
                    <button className='btn btn-primary' style={{ marginRight: '10px' }}>삭제하기</button>
                </div>
            </div>

            {/* Modal */}
            <div ref={bsModal} className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">new 영화관 등록</h1>
                            <button type="button" className="btn-close" aria-label="Close"
                                onClick={e => cancelInput()}></button>
                        </div>
                        <div className="modal-body">
                            {/* 등록 화면 */}

                            <div className="row">
                                <div className="col">
                                    <label>영화관 이름</label>
                                    <input type="text" name="cinemaName"
                                        value={input.cinemaName}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label>총 상영관 수</label>
                                    <input type="number" name="cinemaTotalTheater"
                                        value={input.cinemaTotalTheater}
                                        onChange={e => changeInput(e)} placeholder='숫자로 입력하세요'
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>지역</label>
                                    <input type="text" name="cinemaRegion"
                                        value={input.cinemaRegion}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>주소</label>
                                    <PostApi setInput={setInput} />
                                    <input type="text" name="cinemaPost"
                                        value={input.cinemaPost}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                    <input type="text" name="cinemaAddress1"
                                        value={input.cinemaAddress1}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                    <input type="text" name="cinemaAddress2"
                                        value={input.cinemaAddress2}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>관리자</label>
                                    <input type="text" name="cinemaManager"
                                        value={input.cinemaManager}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col">
                                    <label>관리자 연락처</label>
                                    <input type="text" name="cinemaManagerCall"
                                        value={input.cinemaManagerCall}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <label>상영관 연락처</label>
                                    <input type="text" name="cinemaCall"
                                        value={input.cinemaCall}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button className='btn btn-dark me-2' onClick={e => saveInput()}>
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
}

export default AdminCinema;