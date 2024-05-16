import { useCallback, useState } from 'react';
import './main.css';
import Carousel from 'react-bootstrap/Carousel';
import axios from "../components/utils/CustomAxios";

function PhoenixHome() {

    const [packageProducts, setPackageProducts] = useState([]);
    const loadPackage = useCallback(async ()=>{
        const resp = await axios.get("/product/" + "패키지");
        setPackageProducts(resp.data);
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
                            <div className='d-flex'>
                                <span>패키지</span> <span>더보기</span>
                            </div>
                        </div>
                        
                        <div className='col-md-3 box-wrapper'>
                            <div>
                                <span>콤보</span> <span>더보기</span>
                          
                            </div>
                        </div>

                        <div className='col-md-3 box-wrapper'>
                            <div>
                                <span>포인트</span> <span>더보기</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            
            
        </>


    );
}

export default PhoenixHome;