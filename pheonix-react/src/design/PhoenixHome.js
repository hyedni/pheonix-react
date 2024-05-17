import { useCallback, useEffect, useState } from 'react';
import './main.css';
import Carousel from 'react-bootstrap/Carousel';
import axios from "../components/utils/CustomAxios";
import { useNavigate } from 'react-router';
import { TbNumber12Small } from "react-icons/tb";
import { TbNumber15Small } from "react-icons/tb";
import { TbNumber19Small } from "react-icons/tb";
import { Link } from 'react-router-dom';

function PhoenixHome() {

    const today = new Date();
    function toChar() {
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        return formattedDate;
    }

    //무비차트
    const [movies, setMovies] = useState([]);
    const loadMovies = useCallback(async () => {
        const resp = await axios.get(`/movie/rank/${toChar()}`);
        setMovies(resp.data);
    }, [movies]);

    //관람등급 아이콘
    const getAgeIcon = (movieAge) => {
        switch (movieAge) {
            case '12세 이상':
                return <TbNumber12Small style={{ fontSize: '30px', backgroundColor: 'yellow', borderRadius: '10px' }} />;
            case '15세 이상':
                return <TbNumber15Small style={{ fontSize: '30px', backgroundColor: 'orange', borderRadius: '10px' }} />;
            case '청소년관람불가':
                return <TbNumber19Small style={{ fontSize: '30px', backgroundColor: 'red', borderRadius: '10px' }} />;
            case '전체관람가':
                return <span style={{ fontSize: '15px', color: 'white', fontWeight: 'bold', backgroundColor: 'green', borderRadius: '10px', width: '10px', padding: '5px' }}>all</span>;
        }
    };


    //상품들
    const [packageProducts, setPackageProducts] = useState([]);
    const [packageCombos, setPackageCombos] = useState([]);
    const [pointProducts, setPointProducts] = useState([]);

    const loadPackage = useCallback(async () => {
        const resp = await axios.get("/home/" + "패키지");
        setPackageProducts(resp.data);
    }, []);

    const loadComboPackage = useCallback(async () => {
        const resp = await axios.get("/home/" + "콤보");
        setPackageCombos(resp.data);
    }, []);

    const loadPointProduct = useCallback(async () => {
        const resp = await axios.get("/home/" + "포인트");
        setPointProducts(resp.data);
    }, []);

    useEffect(() => {
        loadPackage();
        loadComboPackage();
        loadPointProduct();
        loadMovies();
    }, []);

    const navigate = useNavigate();
    const moveToDetail = useCallback((target) => {
        navigate(`/productDetail/${target}`);
    }, []);

    const moveToAll = useCallback(() => {
        navigate(`/store/package`);
    }, []);

    const moveToAllCombo = useCallback(() => {
        navigate(`/store/combo`);
    }, []);

    const moveToAllPoint = useCallback(() => {
        navigate(`/store/point`);
    }, []);

    const moveToMovieDetail = useCallback((target)=>{
        navigate(`/movieEdit/${target}`)
    },[]);

    return (
        <>
            <Carousel fade>
                <Carousel.Item>
                    <img className="d-block w-100" src={"/image/main1.png"} alt="First slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={"/image/main2.png"} alt="Second slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={"/image/main3.png"} alt="Third slide" />
                </Carousel.Item>
                <Carousel.Item>
                    <img className="d-block w-100" src={"/image/main4.png"} alt="f slide" />
                </Carousel.Item>
            </Carousel>

            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-9  title-head">
                    <div className="title-head">
                        무비차트
                    </div>
                    <hr />
                </div>
            </div>

            <div className='row justify-content-center mt-3 ms-3'>
                {/* <div className='col-lg-8'> */}
                {movies.map((movie, index) => (
                    <>
                        <div className="col-2 movie-wrapper mb-5 me-5">
                            <div className='admin-flex-box mt-2'>
                                <input type="hidden" value={movie.movieNo} />
                                <span  style={{ fontWeight: 'bolder', fontSize: '20px', marginLeft:'5px', fontStyle:'italic', color:'gray'}}>
                                    {index + 1}위
                                </span>
                                <span style={{ fontSize: '20px', fontWeight: 'bold' }} className='ms-2'>{movie.movieTitle}</span>
                                <span> {getAgeIcon(movie.movieAge)}</span>
                            </div>
                            <hr />
                            <div className='image-wrapper'>
                                <img src={movie.movieImgLink} className='img-thumbnail' />
                                <Link to="/booking" className='edit-button btn btn-primary'>
                                    예매하기
                                </Link>
                                <button onClick={e => moveToMovieDetail(movie.movieNo)} className='delete-button btn btn-secondary' style={{ margin: '0px' }}>
                                    상세정보
                                </button>
                            </div>
                            <hr />
                            <div className='d-flex justify-content-between mb-2'>
                                <div>
                                    <span style={{ fontWeight: 'bold', color: 'gray' }}>{movie.movieOpenDate} 개봉</span>
                                </div>
                                <div>
                                    <span style={{ fontWeight: 'bold', color: 'red' }}>{movie.movieOn === 'Y' ? '절찬상영중' : ''} </span>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between mb-2'>
                                <span style={{ fontWeight: 'bold', color: 'gray' }}>예매율 {movie.reserveStatsRate}%</span>
                            </div>
                        </div>
                    </>
                ))}


            </div>

            {/* 페이지 제목 */}
            <div className="row justify-content-center mt-5">
                <div className="col-lg-9  title-head">
                    <div className="title-head">
                        스토어
                    </div>
                    <hr />
                </div>
            </div>

            <div className="row justify-content-center mt-4 ms-3">
                <div className="col-lg-9">
                    <div className="row">
                        <div className='col-lg-3 box-wrapper ms-5 mb-5'>
                            <div className='d-flex p-2 mb-3 justify-content-between'>
                                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>패키지</span>
                                <span onClick={e => moveToAll(e)} style={{ cursor: 'pointer', fontSize: '13px', borderRadius: '1em' }} className='btn btn-secondary btn-sm'>
                                    더보기
                                </span>
                            </div>
                            <div>
                                <table>
                                    <tbody>
                                        {packageProducts.map((product, index) => (
                                            <tr key={index} onClick={e => moveToDetail(product.productNo)} style={{ cursor: 'pointer' }}>
                                                <td className='inner-td'>
                                                    <img src={product.productImgLink} className='list-img' />
                                                </td>
                                                <td className='text-left inner-font pe-4' style={{ fontWeight: 'bold' }}>
                                                    {product.productName}
                                                </td>
                                                <td className='text-end inner-font'>
                                                    {product.productPrice.toLocaleString()}원
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className='col-md-3 box-wrapper mb-5'>
                            <div>
                                <div className='d-flex p-2 mb-3 justify-content-between'>
                                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>콤보</span>
                                    <span onClick={e => moveToAllCombo(e)} style={{ cursor: 'pointer', fontSize: '13px', borderRadius: '1em' }}
                                        className='btn btn-secondary btn-sm'>
                                        더보기
                                    </span>
                                </div>
                                <div>
                                    <table>
                                        <tbody>
                                            {packageCombos.map((combo, index) => (
                                                <tr key={index} onClick={e => moveToDetail(combo.productNo)} style={{ cursor: 'pointer' }}>
                                                    <td className='inner-td'>
                                                        <img src={combo.productImgLink} className='list-img' />
                                                    </td>
                                                    <td className='text-left inner-font pe-4' style={{ fontWeight: 'bold' }}>
                                                        {combo.productName}
                                                    </td>
                                                    <td className='text-end inner-font'>
                                                        {combo.productPrice.toLocaleString()}원
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>

                        <div className='col-md-3 box-wrapper mb-5'>
                            <div>
                                <div className='d-flex p-2 mb-3 justify-content-between'>
                                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>포인트</span>
                                    <span onClick={e => moveToAllPoint(e)} style={{ cursor: 'pointer', fontSize: '13px', borderRadius: '1em' }}
                                        className='btn btn-secondary btn-sm'>
                                        더보기
                                    </span>
                                </div>
                                <div>
                                    <table>
                                        <tbody>
                                            {pointProducts.map((point, index) => (
                                                <tr key={index} onClick={e => moveToDetail(point.productNo)} style={{ cursor: 'pointer' }}>
                                                    <td className='inner-td'>
                                                        <img src={point.productImgLink} className='list-img' />
                                                    </td>
                                                    <td className='text-left inner-font pe-4' style={{ fontWeight: 'bold' }}>
                                                        {point.productName}
                                                    </td>
                                                    <td className='text-end inner-font'>
                                                        {point.productPrice.toLocaleString()}원
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


        </>


    );
}

export default PhoenixHome;