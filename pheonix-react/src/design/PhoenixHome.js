import { useCallback, useEffect, useState } from 'react';
import './main.css';
import Carousel from 'react-bootstrap/Carousel';
import axios from "../components/utils/CustomAxios";
import { TbPackage } from 'react-icons/tb';
import { FaFontAwesome } from 'react-icons/fa6';
import { useNavigate } from 'react-router';


function PhoenixHome() {

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

    const moveToAllPoint = useCallback(()=>{
        navigate(`/store/point`);
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
                <div className="col-lg-8  title-head">
                    <div className="title-head">
                        무비차트
                    </div>
                    <hr />
                </div>
            </div>

            <br />
            <br />
            <div className="row mb-5">
                <div className="offset-2 col-lg-9">
                    <div className="row">
                        <div className='col-md-3 box-wrapper'>
                            <div className='d-flex p-2 mb-3 justify-content-between'>
                                <span style={{ fontWeight: 'bold', fontSize: '20px' }}>패키지</span>
                                <span onClick={e => moveToAll(e)} style={{ cursor: 'pointer', fontSize:'13px', borderRadius:'1em'}} className='btn btn-secondary btn-sm'>
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
                                                <td className='text-left inner-font pe-4' style={{fontWeight:'bold'}}>
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

                        <div className='col-md-3 box-wrapper'>
                            <div>
                                <div className='d-flex p-2 mb-3 justify-content-between'>
                                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>콤보</span>
                                    <span onClick={e => moveToAllCombo(e)} style={{ cursor: 'pointer', fontSize:'13px', borderRadius:'1em'}}
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
                                                    <td className='text-left inner-font pe-4' style={{fontWeight:'bold'}}>
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

                        <div className='col-md-3 box-wrapper'>
                            <div>
                                <div className='d-flex p-2 mb-3 justify-content-between'>
                                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>포인트</span>
                                    <span onClick={e => moveToAllPoint(e)} style={{ cursor: 'pointer', fontSize:'13px', borderRadius:'1em' }}
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
                                                    <td className='text-left inner-font pe-4' style={{fontWeight:'bold'}}>
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