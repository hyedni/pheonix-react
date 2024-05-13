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

    const [userId] = useRecoilState(loginIdState);
    const { movieNo } = useParams();
    const [ reviewLists, setReviewLists ] = useState([]);
    const [ likeVO, setLikeVO ] = useState([]);
    const [ finalLists, setFinalListS] = useState([]);

    useEffect(() => {
        loadReviews();
    }, []);

    //리뷰 글 불러오기
    const loadReviews = useCallback(() => {
        try {
            axios.get(`/review/${movieNo}`).then(resp => {
                setReviewLists(resp.data);
            })
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [movieNo]);

    //좋아요 개수 불러오기
    const loadLikes = useCallback(()=>{
        try {
            const dataList = reviewLists.map(review => ({
                userId : userId,
                reviewNo : review.reviewNo
            }));
            axios.get("/review_like/checkAll"+ dataList).then(resp => {
                setLikeVO(resp.data); //리뷰 번호 + 사용자 좋아요 여부 + 글에 대한 좋아요 개수
                console.log(resp.data);
            })

        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [reviewLists]);

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
                                                 | <AiFillLike/>
                                                 
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