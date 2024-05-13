import axios from "../utils/CustomAxios";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";

//이미지 임포트
import birdImg from "./image/bird.png";
import eggImg from "./image/egg.png";

//아이콘 임포트
import { AiFillLike } from "react-icons/ai";

const ReviewList = () => {

    const [ userId ] = useRecoilState(loginIdState);
    const { movieNo } = useParams();
    const [ reviewLists, setReviewLists ] = useState([]);

    useEffect(() => {
        loadReviews();
    }, []);

    //리뷰 글 불러오기
    const loadReviews = useCallback(() => {
        try {
            axios.get(`/review/${movieNo}`).then(resp => {
                setReviewLists(resp.data);
                console.log(resp.data);
            })
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [movieNo]);

    //좋아요
    const clickLike = useCallback((target)=>{
        try {
            const data = ({
                userId : userId,
                reviewNo : target
            });
            axios.get("/review_like/"+data).then(resp => {
                // 해당 글에 대한 사용자의 좋아요 여부 값 변경
            })
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, []);


    return (
        <>

            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <div className="row " style={{ borderBottom: 'solid black 1px' }}>
                        <div className="col-6">
                            최신순
                        </div>
                        <div className="col-6">
                            추천순
                        </div>
                    </div>
                </div>
            </div>

            {/* 리스트 뽑기 */}
            <div className='row justify-content-center'>
                <div className='col-lg-8 content-body'>
                    <div className="row">
                        {reviewLists.length === 0 ? ( //리뷰가 있/없 판단
                            <>
                                <h1>리뷰가 아직 없어요</h1>
                            </>
                        ) : (
                            <>
                                {reviewLists.map(review => (
                                    <div className="col-6" key={review.reviewNo}>
                                        <div className="row">
                                            <div className="col-3">
                                                {review.userImgLink}
                                            </div>
                                            <div className="col-9">
                                                <span>
                                                    {review.reviewReputation === 'Y' ? (
                                                        <img src={birdImg} alt="좋은평가" style={{ width: '30px' }} />
                                                    ) : (
                                                        <img src={eggImg} alt="나쁜평가" style={{ width: '30px' }} />
                                                    )}
                                                    {review.userNick === null ? review.userId : review.userNick}
                                                </span>
                                                <p>{review.reviewContent}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col center">
                                                {new Date(review.reviewDate).toLocaleDateString()}
                                                 | 
                                                {review.state === 'false' ? (
                                                    <AiFillLike onClick={()=>{clickLike(review.reviewNo)}} />
                                                ):(
                                                    <AiFillLike onClick={()=>{clickLike(review.reviewNo)}} style={{ color: 'red' }} />
                                                )} 

                                                 {review.count}
                                                 
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>

                        )} 
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReviewList;