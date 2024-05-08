import axios from "../utils/CustomAxios";
import './BookingListPage.css';
import { useCallback, useEffect, useState } from 'react';

function BookingListPage() {

    const [isTheaterShow, setIsTheaterShow] = useState(false);

    //전체데이터(Vo)담긴 state
    const [bookData, setBookData] = useState([]);
    //영화명 
    const [movieData, setMovieData] = useState([]); 


     //영화목록
     const loadMovie = useCallback(async()=>{
        const resp = await axios.get("/booking/movie");
        setMovieData(resp.data);
    }, [movieData]);

    useEffect(() => {
        loadMovie();
    }, []);

    const loadListAll = useCallback(async () => {
        const resp = await axios.get("/booking/");
        setBookData(resp.data);
    }, [bookData]);  

    const loadTheaterList = useCallback(async (movieNo) => {
        const resp = await axios.get(`/booking/theater/${movieNo}`);
        setBookData(resp.data);
        setIsTheaterShow(true);
    }, [bookData]);


    return (
        <>
            <div className="row">

                <div className="offset-3 col-2 movie-wrapper">
                    <table>
                        <tr><th>영화</th></tr>
                        {movieData.map((data) => (
                            <tr><td onClick={e => loadTheaterList(data.movieNo)}>{data.movieTitle}</td></tr>
                        ))}
                    </table>
                </div>

                <div className="col-2">
                    <table>
                        <tr><th>영화관</th></tr>
                        <span style={{ display: isTheaterShow ? 'block' : 'none' }}>
                            {bookData.map((data) => (
                                <tr><td onClick={e => loadTheaterList(data.movieNo)}>{data.cinemaName}</td></tr>
                            ))}
                        </span>
                    </table>
                </div>

                <div className="col-1">
                    <h1>날짜</h1>
                </div>
                <div className="col-3">
                    <h1>3</h1>
                </div>

            </div>



        </>
    );
}

export default BookingListPage;