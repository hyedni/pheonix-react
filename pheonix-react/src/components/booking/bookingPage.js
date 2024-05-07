import { useState } from "react";
import axios from "../utils/CustomAxios";

const BookingPage = () =>{

    const [seatStatus, setSeatStatus] = useState([]);

    useEffect(()=>{
        loadData();
    },[]); //시작하자마자 한번 좌석데이터 가져옴

    const loadData = useCallback(()=>{
        axios({
            url: "",
            method:"get"
        })
        .then(response=>{
            setSeatStatus(response.data);
        });
    },[]); //좌석데이터한번가져오는코드

    return (
        <>
        
        </>
    );
}

export default BookingPage;