import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "../utils/CustomAxios";
import './AdminMovie.css';

function NewMovie() {
    //첨부파일관련
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    const [input, setInput] = useState({
        movieTitle: '',
        movieGenre: '',
        movieRunningTime: '',
        movieYear: '',
        movieOpenDate: '',
        movieCloseDate: '',
        movieAge: '',
        movieOrigin: '',
        movieOn: '',
        movieSummary: '',
        movieTranslation: '',
        movieScreenType: '',
        movieDirector: '',
        movieActor: ''
    });

    //DatePicker관련
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const cangeDate = (dates) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
    };

    //등록
    const changeInput = useCallback(async (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    const cancelInput = useCallback(() => {
        setInput({
            movieTitle: '',
            movieGenre: '',
            movieRunningTime: '',
            movieYear: '',
            movieOpenDate: '',
            movieCloseDate: '',
            movieAge: '',
            movieOrigin: '',
            movieOn: '',
            movieSummary: '',
            movieTranslation: '',
            movieScreenType: '',
            movieDirector: '',
            movieActor: '',
        });
    }, [input]);

    //등록처리 (FormData에 객체에 파일과 input값을 함께 담아 전송)
    const saveInput = useCallback(async () => {
        const formData = new FormData();
        // 'input' 객체의 각 키와 값을 FormData에 추가
        for (const key in input) {
            formData.append(key, input[key]);
        }
        // 파일도 FormData에 추가
        if (file) {
            formData.append("attach", file);
        }
        try {
            await axios.post("/movie/", formData);
            cancelInput();  // 입력 필드 초기화
            clearImagePreview();
            navigate('/adminMovie');  // /adminMovie 페이지로 리다이렉트
        } catch (error) {
            console.error("Failed to submit the form!", error);
        }
    }, [input, file]);

    //첨부파일관련
    const clearImagePreview = () => {
        setImagePreview(null);
    };

    // useEffect(() => {
    //     clearImagePreview();
    // }, []);

    const handleImageChange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        if (file) {
            setFile(file);
            reader.readAsDataURL(file);
        }
    };
    return (
        <>
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        신규 영화 등록
                        {/* <button className="btn btn-primary ms-5" onClick={e => openModal()}>신규 영화 등록</button> */}
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='offset-2 col-lg-8'>
                    <div className='row mt-4'>
                        <div className='col-md-3 me-4' style={{ borderRight: '0.5px solid rgb(197,198,199)' }}>
                            <div className="attach-file">
                                <span>포스터</span>
                                <hr />
                                <div className="mt-3">
                                    <input type="file" onChange={handleImageChange} />
                                    {imagePreview && (
                                        <div className="img-preview mt-3">
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                    <div id="imgArea" className="img-preview mt-3"></div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>

                            <div className="row">
                                <div className="col">
                                    <label>영화명</label>
                                    <input type="text" name="movieTitle"
                                        value={input.movieTitle}
                                        onChange={e => changeInput(e)} className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>장르</label>
                                    <input type="text" name="movieGenre"
                                        value={input.movieGenre}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>러닝타임</label>
                                    <input type="text" name="movieRunningTime"
                                        value={input.movieRunningTime}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>제작년도</label>
                                    <input type="text" name="movieYear"
                                        value={input.movieYear}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className='col'>
                                    <label>상영기간을 선택하세요.</label>
                                    <br />
                                    <DatePicker className='datePicker'
                                        dateFormat='yyyy.MM.dd'
                                        selected={startDate}
                                        onChange={cangeDate}
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={new Date()}
                                        selectsRange
                                        shouldCloseOnSelect
                                    />
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <label>개봉일</label>
                                    <input type="text" name="movieOpenDate"
                                        value={startDate ? format(new Date(startDate), "yyyy-MM-dd") : ''}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                                <div className="col-md-6">
                                    <label>상영종료일</label>
                                    <input type="text" name="movieCloseDate"
                                        value={endDate ? format(new Date(endDate), "yyyy-MM-dd") : ''}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>상영등급</label>
                                    <input type="text" name="movieAge"
                                        value={input.movieAge}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>제작국가</label>
                                    <input type="text" name="movieOrigin"
                                        value={input.movieOrigin}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>감독</label>
                                    <input type="text" name="movieDirector"
                                        value={input.movieDirector}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>배우</label>
                                    <input type="text" name="movieActor"
                                        value={input.movieActor}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>현재 상영 여부</label>
                                    <input type="text" name="movieOn"
                                        value={input.movieOn}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>줄거리</label>
                                    <textarea type="text" name="movieSummary"
                                        value={input.movieSummary}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>자막/더빙 여부</label>
                                    <input type="text" name="movieTranslation"
                                        value={input.movieTranslation}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>스크린 타입</label>
                                    <input type="text" name="movieScreenType"
                                        value={input.movieScreenType}
                                        onChange={e => changeInput(e)}
                                        className="form-control" />
                                </div>
                            </div>


                            <div className="row mt-3 mb-4">
                                <div className='col-md-6'>
                                    <button className='btn btn-light' onClick={e => saveInput()} style={{width:'100%'}}>
                                        등록
                                    </button>
                                </div>
                                <div className='col-md-6'>
                                    <button className='btn btn-primary' onClick={e => cancelInput()} style={{width:'100%'}}>
                                        취소
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>





        </>
    );
}

export default NewMovie;