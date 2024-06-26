import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import axios from "../utils/CustomAxios";
import './AdminMovie.css';
import moment from 'moment';


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

    const openDate = moment(input.movieOpenDate).format("YYYY-MM-DD");
    const closeDate = moment(input.movieCloseDate).format("YYYY-MM-DD");
    const [defaultDate, setDefaultDate] = useState(new Date());
    const [todayDate, setTodayDate] = useState(moment(defaultDate).format("YYYY-MM-DD"));

    //DatePicker관련
    const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
    const changeDate = (dates) => {
        const [start, end] = dates;
        const openDate = moment(start).format("YYYY-MM-DD");
        const closeDate = moment(end).format("YYYY-MM-DD");
        setStartDate(start);
        setEndDate(end);
        setInput({
            ...input,
            movieOpenDate: openDate,
            movieCloseDate: closeDate
        })
    };

    //등록
    const changeInput = useCallback((e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    }, [input]);

    const [result, setResult] = useState({
        movieYear: null,
        movieRunningTime: null,
        movieTitle: null,
        movieGenre: null,
        movieAge: null,
        movieOrigin: null,
        movieDirector: null,
        movieActor: null,
        movieOn: null,
        movieTranslation: null,
        movieScreenType: null,
        movieSummary: null
    });

    //유효성검사
    const changeResult = (e) => {
        const name = e.target.name;
        if (name === 'movieYear') {
            const regex = /^[1-2][0-9]{3}$/;
            setResult({
                ...result,
                movieYear: regex.test(input.movieYear)
            });
        }else if (name === 'movieRunningTime') {
            const regex = /^[0-9]+$/;
            setResult({
                ...result,
                movieRunningTime: regex.test(input.movieRunningTime)
            });
        }else if (name === 'movieTitle') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieTitle: isValid
            });
        }else if (name === 'movieGenre') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieGenre: isValid
            });
        }else if (name === 'movieOpenDate') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieOpenDate: isValid
            });
        }else if (name === 'movieCloseDate') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieCloseDate: isValid
            });
        }else if (name === 'movieAge') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieAge: isValid
            });
        }else if (name === 'movieOrigin') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieOrigin: isValid
            });
        }else if (name === 'movieDirector') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieDirector: isValid
            });
        }else if (name === 'movieActor') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieActor: isValid
            });
        }else if (name === 'movieOn') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieOn: isValid
            });
        }else if (name === 'movieTranslation') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieTranslation: isValid
            });
        }else if (name === 'movieScreenType') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieScreenType: isValid
            });
        }else if (name === 'movieSummary') {
            const isValid = e.target.value.length > 0;
            setResult({
                ...result,
                movieSummary: isValid
            });
        }
    };

    const ok = useMemo(() => {
        return result.movieYear && result.movieRunningTime && result.movieTitle && result.movieGenre 
        && result.movieAge && result.movieOrigin && result.movieDirector 
        && result.movieActor && result.movieOn && result.movieTranslation && result.movieScreenType && result.movieSummary;
    }, [result]);

    //textarea등록
    function countBytes(str) {
        return encodeURI(str).split(/%..|./).length - 1;
    }
    const [byteCount, setByteCount] = useState(0);
    const maxBytes = 1300;
    const handleChange = (event) => {
        const inputText = event.target.value;
        const bytes = countBytes(inputText);
        if (bytes <= maxBytes) {
            setInput({
                ...input,
                movieSummary: inputText
            })
            setByteCount(bytes);
        } else {
            alert('허용된 최대 바이트 수를 초과했습니다.');
        }
    };

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
            window.alert("포스터 첨부 하셨나요?");
        }
    }, [input, file]);

    //첨부파일관련
    const clearImagePreview = () => {
        setImagePreview(null);
    };

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
            <br />
            <br />
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        신규 영화 등록
                    </div>
                <hr />
                </div>
            </div>

            <div className='row'>
                <div className='offset-2 col-lg-8'>
                    <div className='row mt-4'>
                        <div className='col-md-3 me-4' style={{ borderRight: '0.5px solid rgb(197,198,199)' }}>
                            <div className="attach-file">
                                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>포스터</span>
                                <hr />
                                <div className="mt-3">
                                    <div class="input-group">
                                        <input type="file" onChange={handleImageChange} class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload" />
                                    </div>
                                    {imagePreview && (
                                        <div className="img-preview-admin img-thumbnail mt-3">
                                            <img src={imagePreview} alt="Preview" style={{ width: "100%" }} />
                                        </div>
                                    )}
                                    <div id="imgArea" className="img-preview mt-3" ></div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-6'>

                            <div className="row">
                                <div className="col">
                                    <label>영화명</label>
                                    <input type="text" name="movieTitle"
                                        value={input.movieTitle}
                                        onChange={e => changeInput(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.movieTitle === true ? 'is-valid' : ''}
                                        ${result.movieTitle === false ? 'is-invalid' : ''}
                                        `} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>장르</label>
                                    <input type="text" name="movieGenre"
                                        value={input.movieGenre}
                                        onChange={e => changeInput(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.movieGenre === true ? 'is-valid' : ''}
                                        ${result.movieGenre === false ? 'is-invalid' : ''}
                                        `} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>러닝타임 <span style={{color:'gray'}}>(분)</span></label>
                                    <input type="text" name="movieRunningTime"
                                        value={input.movieRunningTime}
                                        onChange={e => changeInput(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.movieRunningTime === true ? 'is-valid' : ''}
                                        ${result.movieRunningTime === false ? 'is-invalid' : ''}
                                        `} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>제작년도 <span style={{color:'gray'}}>ex)2024</span></label>
                                    <input type="text" name="movieYear"
                                        value={input.movieYear}
                                        onChange={e => changeInput(e)} onBlur={changeResult} 
                                        className={`form-control 
                                        ${result.movieYear === true ? 'is-valid' : ''}
                                        ${result.movieYear === false ? 'is-invalid' : ''}
                                        `} />
                                </div>
                            </div>

                            <div className='row mt-3'>
                                <div className='col'>
                                    <label>상영기간을 선택하세요.</label>
                                    <br />
                                    <DatePicker className='datePicker'
                                        dateFormat='yyyy.MM.dd'
                                        selected={startDate}
                                        onChange={changeDate}
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
                                    <input type="text" name="movieOpenDate"value={openDate === "Invalid date" ? '선택하세요' : openDate} readOnly onChange={e => changeInput(e)} 
                                    className={`form-control 
                                    ${result.movieOpenDate === true ? 'is-valid' : ''}
                                    ${result.movieOpenDate === false ? 'is-invalid' : ''}
                                    `} />
                                </div>
                                <div className="col-md-6">
                                    <label>상영종료일</label>
                                    <input type="text" name="movieCloseDate" value={closeDate === "Invalid date" ? '선택하세요' : closeDate} readOnly onChange={e => changeInput(e)} 
                                    className={`form-control 
                                    ${result.movieCloseDate === true ? 'is-valid' : ''}
                                    ${result.movieCloseDate === false ? 'is-invalid' : ''}
                                    `} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>상영등급</label>
                                    <select className={`form-select 
                                    ${result.movieAge === true ? 'is-valid' : ''}
                                    ${result.movieAge === false ? 'is-invalid' : ''}
                                    `} name="movieAge" value={input.movieAge} onChange={e => changeInput(e)} onBlur={changeResult}> 
                                        <option value="">선택하세요</option>
                                        <option value="전체관람가">전체관람가</option>
                                        <option value="12세 이상">12세 이상 관람가</option>
                                        <option value="15세 이상">15세 이상 관람가</option>
                                        <option value="청소년관람불가">청소년 관람불가</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>제작국가</label>
                                    <input type="text" name="movieOrigin"
                                        value={input.movieOrigin}
                                        onChange={e => changeInput(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.movieOrigin === true ? 'is-valid' : ''}
                                        ${result.movieOrigin === false ? 'is-invalid' : ''}
                                        `} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>감독</label>
                                    <input type="text" name="movieDirector"
                                        value={input.movieDirector}
                                        onChange={e => changeInput(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.movieDirector === true ? 'is-valid' : ''}
                                        ${result.movieDirector === false ? 'is-invalid' : ''}
                                        `} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>배우</label>
                                    <input type="text" name="movieActor"
                                        value={input.movieActor}
                                        onChange={e => changeInput(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.movieActor === true ? 'is-valid' : ''}
                                        ${result.movieActor === false ? 'is-invalid' : ''}
                                        `} />
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>현재 상영 여부</label>
                                    <select className={`form-select 
                                        ${result.movieOn === true ? 'is-valid' : ''}
                                        ${result.movieOn === false ? 'is-invalid' : ''}
                                        `}
                                        name="movieOn" value={input.movieOn} onChange={e => changeInput(e)} onBlur={changeResult}> 
                                        <option value="">선택하세요</option>
                                        <option value="N">미개봉</option>
                                        <option value="Y">상영중</option>
                                        <option value="X">상영종료</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>자막/더빙</label>
                                    <select className={`form-select 
                                        ${result.movieTranslation === true ? 'is-valid' : ''}
                                        ${result.movieTranslation === false ? 'is-invalid' : ''}
                                        `}
                                        name="movieTranslation" value={input.movieTranslation} 
                                        onChange={e => changeInput(e)} onBlur={changeResult}>
                                        <option value="">선택하세요</option>
                                        <option value="Y">자막</option>
                                        <option value="N">더빙</option>
                                        <option value="K">일반(한국영화)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>스크린 타입</label>
                                    <select className={`form-select 
                                        ${result.movieScreenType === true ? 'is-valid' : ''}
                                        ${result.movieScreenType === false ? 'is-invalid' : ''}
                                        `} 
                                        name="movieScreenType" value={input.movieScreenType} 
                                        onChange={e => changeInput(e)} onBlur={changeResult}>
                                        <option value="">선택하세요</option>
                                        <option value="2D">2D</option>
                                        <option value="3D">3D</option>
                                        <option value="4D">4D</option>
                                        <option value="IMAX">IMAX</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col">
                                    <label>줄거리</label> <span style={{ color: 'gray' }}>({byteCount}/{maxBytes} bytes)</span>
                                    <textarea type="text" name="movieSummary"
                                        value={input.movieSummary}
                                        onChange={e => handleChange(e)} onBlur={changeResult}
                                        className={`form-control 
                                        ${result.movieSummary === true ? 'is-valid' : ''}
                                        ${result.movieSummary === false ? 'is-invalid' : ''}
                                        `} 
                                        style={{ whiteSpace: 'pre-wrap', minHeight: '150px', resize: 'none', overflow: 'auto' }} placeholder='내용을 입력하세요' />
                                </div>
                            </div>

                            <div className="row mt-5 mb-5">
                                <div className='col-md-6'>
                                    <button className='btn btn-primary' onClick={e => cancelInput()} style={{ width: '100%', padding:'10px' }}>
                                        취소
                                    </button>
                                </div>
                                <div className='col-md-6'>
                                    <button className='btn btn-light' onClick={e => saveInput()} style={{ width: '100%', padding:'10px'}} disabled={ok !== true}>
                                        등록
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