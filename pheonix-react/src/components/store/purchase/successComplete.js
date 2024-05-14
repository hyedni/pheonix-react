import { Link } from 'react-router-dom';

const successComplete = () => {

    // window.close();
    //navigator("/purchase/success");

    return (
        <>
            <div className="row justify-content-center" style={{marginTop: '100px'}}>
                <div className="col-lg-8  content-head text-center">
                    <h2 style={{ fontWeight: 'bold', fontSize: '102px'}}>결제완료!</h2>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-lg-8 content-body text-center">
                    <div className='row' style={{marginBottom: '100px'}}>
                        <h4>결제해주셔서 감삼다!!!</h4>
                        <div className='col-6 mt-4'>
                            <button className='btn btn-dark w-100 btn-lg'>구매내역 보기</button>
                        </div>
                        <div className='col-6 mt-4'>
                            <Link to={`/store/package`} className='btn btn-dark w-100 btn-lg'>스토어 가기</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default successComplete;