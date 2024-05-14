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

//디자인 임포트
import './review.css';
import Pagination from "../service/Pagination";

const ReviewList = () => {

    const [userId] = useRecoilState(loginIdState);
    const { movieNo } = useParams();
    const [reviewLists, setReviewLists] = useState([]);

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewPerPage] = useState(6);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        loadReviews();
    }, [userId]);//axios 순서 때문에..

    //리뷰 글 불러오기
    const loadReviews = useCallback(async () => {
        try {
            await axios.get(`/review/${movieNo}`).then(resp => {
                setReviewLists(resp.data);
            })
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [movieNo]);

    //좋아요
    const clickLike = useCallback(async (target) => {
        const data = {
            userId,
            reviewNo: target
        };
        try {
            await axios.get("/review_like/", { params: data }).then(resp => {
               loadReviews();
            })
        }
        catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [userId]);

    //정렬
    const [sortBy, setSortBy] = useState('latest');

    const handleSortChange = (sortByValue) => {
        setSortBy(sortByValue);
    };

    return (
        <>

            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <div className="row " style={{ borderBottom: 'solid black 1px' }}>
                        <div className="col-3">
                            <button className={sortBy === 'latest' ? 'btn selected' : 'btn'} onClick={() => handleSortChange('latest')}>
                                최신순
                            </button>
                            <button className={sortBy === 'popular' ? 'btn selected' : 'btn'} onClick={() => handleSortChange('popular')}>
                                추천순
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* 리스트 뽑기 */}
            <div className='row justify-content-center'>
                <div className='col-lg-8 content-body'>
                    <div className="row">
                        <div className="col-md-1"></div>
                        {reviewLists.length === 0 ? ( //리뷰가 있/없 판단
                            <>
                                <h1>리뷰가 아직 없어요</h1>
                            </>
                        ) : (
                            <>
                                {sortBy === 'latest' ? (
                                    reviewLists
                                        .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)) // 최신순 정렬
                                        //.sort((a, b) => new Date(a.reviewDate) - new Date(b.reviewDate)) // 오래된 순 정렬
                                        .map(review => (
                                            // 최신순으로 보여줄 내용
                                            <>
                                                <div className="col-md-5 review-container" key={review.reviewNo}>
                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            {review.userImgLink}
                                                        </div>
                                                        <div className="col-sm-9">
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
                                                        <div className="col-sm-3">

                                                        </div>
                                                        <div className="col-sm-9">
                                                            {new Date(review.reviewDate).toLocaleDateString()}
                                                            |
                                                            {review.state === false ? (
                                                                <AiFillLike onClick={() => { clickLike(review.reviewNo) }} />
                                                            ) : (
                                                                <AiFillLike onClick={() => { clickLike(review.reviewNo) }} style={{ color: 'red' }} />
                                                            )}  

                                                            {review.count}

                                                        </div>

                                                    </div>
                                                </div>
                                            </>
                                        ))
                                ) : (
                                    reviewLists
                                        .sort((a, b) => b.count - a.count) // 추천순 정렬
                                        .map(review => (
                                            // 추천순으로 보여줄 내용
                                            <>
                                                <div className="col-md-5 review-container" key={review.reviewNo}>
                                                    <div className="row">
                                                        <div className="col-sm-3">
                                                            {review.userImgLink}
                                                        </div>
                                                        <div className="col-sm-9">
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
                                                        <div className="col-sm-3">

                                                        </div>
                                                        <div className="col-sm-9">
                                                            {new Date(review.reviewDate).toLocaleDateString()}
                                                            |
                                                            {review.state === 'false' ? (
                                                                <AiFillLike onClick={() => { clickLike(review.reviewNo) }} />
                                                            ) : (
                                                                <AiFillLike onClick={() => { clickLike(review.reviewNo) }} style={{ color: 'red' }} />
                                                            )}

                                                            {review.count}

                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))
                                )}
                            </>



                        )}
                    </div>

                    <Pagination currentPage={currentPage} totalPages={Math.ceil(reviewLists.length / reviewPerPage)} paginate={paginate} />
                </div>
            </div>
        </>
    );
}

export default ReviewList;