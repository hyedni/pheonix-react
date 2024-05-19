import axios from "../utils/CustomAxios";
import { useRecoilState } from "recoil";
import { loginIdState } from "../utils/RecoilData";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    const [imagePreview] = useState(null);

    //페이징
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewPerPage] = useState(6);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    //정렬
    const [sortBy, setSortBy] = useState('latest');

    const sortedReviews = useMemo(() => {
        return reviewLists.slice().sort((a, b) => {
            if (sortBy === 'latest') {
                return new Date(b.reviewDate) - new Date(a.reviewDate);
            } else if (sortBy === 'popular') {
                return b.count - a.count;
            }
            return 0;
        });
    }, [reviewLists, sortBy]);

    const paginatedreviewList = useMemo(() => {
        const lastIndex = currentPage * reviewPerPage;
        const firstIndex = lastIndex - reviewPerPage;
        return sortedReviews.slice(firstIndex, lastIndex);
    }, [sortedReviews, currentPage, reviewPerPage]);

    useEffect(() => {
        loadReviews();
    }, [userId]);

    //리뷰 글 불러오기
    const loadReviews = useCallback(async () => {
        try {
            const resp = await axios.get(`/review/${movieNo}`);
            setReviewLists(resp.data);
        } catch (error) {
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
            await axios.get("/review_like/", { params: data });
            loadReviews();
        } catch (error) {
            console.error("API 호출 중 오류 발생:", error);
        }
    }, [userId, loadReviews]);

    const handleSortChange = (sortByValue) => {
        setSortBy(sortByValue);
    };

    return (
        <>
            <div className='row justify-content-center'>
                <div className='col-lg-8'>
                    <div className="row" style={{ borderBottom: 'solid black 1px' }}>
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

            <div className='row justify-content-center'>
                <div className='col-lg-8 content-body'>
                    <div className="row offset-1">
                        {paginatedreviewList.length === 0 ? (
                            <h1>리뷰가 아직 없어요</h1>
                        ) : (
                            paginatedreviewList.map(review => (
                                <div className="col-5 review-container" key={review.reviewNo}>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            {!imagePreview && (
                                                <img src={review.userImgLink} alt="상품이미지" style={{ height: "80px" }} />
                                            )}
                                            {imagePreview && (
                                                <img src={imagePreview} alt="Preview" />
                                            )}
                                        </div>
                                        <div className="col-sm-9">
                                            <span>{review.userId}</span>
                                            <p className="reviewContent">{review.reviewContent}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3"></div>
                                        <div className="col-sm-9">
                                            {new Date(review.reviewDate).toLocaleDateString()} |&nbsp;&nbsp;&nbsp;
                                            {review.state === false ? (
                                                <AiFillLike onClick={() => clickLike(review.reviewNo)} />
                                            ) : (
                                                <AiFillLike onClick={() => clickLike(review.reviewNo)} style={{ color: 'red' }} />
                                            )}
                                            {review.count}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Pagination currentPage={currentPage} totalPages={Math.ceil(reviewLists.length / reviewPerPage)} paginate={paginate} />
                </div>
            </div>
        </>
    );
}

export default ReviewList;
