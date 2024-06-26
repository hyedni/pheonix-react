import { Navigate, Route, Routes } from 'react-router';
import AdminMovie from './components/admin/AdminMovie';
import Footer from './design/Footer';
import Htemplate from './design/Htemplate';
import Login from './components/user/Login';
import Join from './components/user/Join';
import MovieEdit from './components/admin/MovieEdit';
import Store from './components/store/Store';
import Cart from './components/store/Cart';
import NewMovie from './components/admin/NewMovie';
import Personal from './components/service/Personal';
import Lost from './components/service/Lost';
import WritePost from './components/service/WritePost';
import StoreDetailList from './components/store/list/StoreDetailList';
import AdminCinema from './components/admin/AdminCinema';
import AdminStore from './components/admin/Store/AdminStore';
import NewProduct from './components/admin/Store/NewProduct';
import ProductEdit from './components/admin/Store/productEdit';
import Chatbot from './chatbot/chatbot';
import SeatStatus from './components/admin/SeatsTypes/SeatStatus';
import SeatDetails from './components/admin/SeatsTypes/SeatDetails';
import BookingButton from './design/BookingButton';
import AdminTheater from './components/admin/AdminTheater';
import Mypage from './components/user/Mypage';
import { isLoginState, loginIdState, loginGradeState, isNonLoginState, nonLoginIdState } from "./components/utils/RecoilData";
import { useRecoilCallback, useRecoilState, useRecoilValue } from 'recoil';
import axios from "./components/utils/CustomAxios";
import { useCallback, useEffect, useState } from "react";
import Success from './components/store/purchase/success';
import Fail from './components/store/purchase/fail';
import Cancel from './components/store/purchase/cancel';
import SuccessComplete from './components/store/purchase/successComplete';
import PersonalDetail from './components/service/PersonalDetail';
import Pagination from './components/service/Pagination';
import Bunsil from './components/service/Bunsil';

import NonUser from './components/user/nonUser';

import AddTheater from './components/admin/AddTheater';
import BookingListPage from './components/booking/BookingListPage';
import BookingAdd from './components/booking/BookingAdd';
import MovieChart from './components/booking/MovieChart';
import ReplyForm from './components/service/ReplyForm';
import PersonalWrite from './components/service/PersonalWrite';
import MovieSchedule from './components/admin/MovieSchedule';
import CommentLists from './components/service/CommentLists';
import Comment from './components/service/Comment';
import ReviewList from './components/review/ReviewList';
import Purchase from './components/store/purchase/Purchase';
import ReserveStats from './components/admin/ReserveStats';
import MyPersonal from './components/user/MyPersonal';
import TheaterRegistrationComplete from './components/admin/TheaterRegistrationComplete';
import BookingComplete from './components/booking/BookingComplete';
import MyStore from './components/user/appliance/MyStore';
import PhoenixHome from './design/PhoenixHome';



function App() {

  //recoil state
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [loginGrade, setLoginGrade] = useRecoilState(loginGradeState);

  const [nonLoginId, setNonLoginId] = useRecoilState(nonLoginIdState);

  const isLogin = useRecoilValue(isLoginState);
  const isNonLogin = useRecoilValue(isNonLoginState);

  //effect
  useEffect(() => {
    refreshLogin();
    nonLogin();
  }, []);//최초 1회


  //call back
  const refreshLogin = useCallback(async () => {
    //로그인 정보 가져오기
    const refreshToken = window.localStorage.getItem("refreshToken");

    if (refreshToken !== null) {//refreshToken 항목이 존재한다면
      //리프레시 토큰으로 Authorization을 변경하고
      axios.defaults.headers.common["Authorization"] = refreshToken;
      //재로그인 요청을 보낸다
      const resp = await axios.post(`/user/refresh`);

      //8번 - MemberLoginVO 발급 작업
      //결과를 적절한 위치에 설정한다
      setLoginId(resp.data.userId);
      setLoginGrade(resp.data.userGrade);
      axios.defaults.headers.common["Authorization"] = resp.data.accessToken;
      window.localStorage.setItem("refreshToken", resp.data.refreshToken);
    }
  }, [loginId]);


    //비회원 토큰 확인
    const nonLogin = useCallback(async () => {
      try{
         // 비회원 정보 가져오기
        const token = window.localStorage.getItem("token");
        
        axios.defaults.headers.common["NonUserAuth"] = token;
        // 세션 스토리지에 비회원 정보 저장
        const resp = await axios.get(`/user/token`); //정보 확인

        setNonLoginId(resp.data.nonUserId);
        axios.defaults.headers.common["NonUserAuth"] = resp.data.token;
        window.localStorage.setItem("token", resp.data.token);
      }
      catch{
        setNonLoginId('');
        delete axios.defaults.headers.common['NonUserAuth'];
        window.localStorage.removeItem("token");
      }

  }, []);


  return (

    <>
      <Htemplate />
      <BookingButton />

      <Routes>
        {/* 공용공간 에티켓을 만듭시다** 분리하여 route 작성해주세요 */}
        <Route path='/' element={<PhoenixHome />} />
        {/* 관리자 */}
        {loginGrade === '관리자' &&
          <>
            <Route path='/adminMovie' element={<AdminMovie />} />
            <Route path='/adminStore' element={<AdminStore />} />
            <Route path='/adminTheater' element={<AdminTheater />} />
            <Route path='/movieSchedule' element={<MovieSchedule />} />
            <Route path='/reserveStats' element={<ReserveStats />} />
            <Route path='/productEdit/:productNo' element={<ProductEdit />} />
            <Route path='/newMovie' element={<NewMovie />} />
            <Route path='/newProduct' element={<NewProduct />} />
            <Route path='/addTheater' element={<AddTheater />} />
            <Route path='/seatStatus' element={<SeatStatus />} />
            <Route path='/seatDetails' element={<SeatDetails />} />
            <Route path='/bunsil' element={<Bunsil />} />
          </>
        }
        <Route path='/movieEdit/:movieNo' element={<MovieEdit />} />
        <Route path='/adminCinema' element={<AdminCinema />} />

        <Route path='/addTheater' element={<AddTheater />} />
        <Route path='/seatStatus' element={<SeatStatus />} />
        <Route path='/seatDetails' element={<SeatDetails />} />
        <Route path='/theaterRegistrationComplete' element={<TheaterRegistrationComplete />} />
        <Route path='/bookingComplete' element={<BookingComplete />} />


        {/* 회원 */}

        <Route path='/login' element={<Login />} />
        <Route path='/join' element={<Join />} />



        <Route path='/nonUser' element={<NonUser />} />
        {/* <Route path='mypersonal' element={<MyPersonal/>}/> */}



        {isLogin &&

          // <Route path='/mypage' element={<Mypage />} />
          <Route path='/mypage/*' element={<Mypage />} />
        }

        {/* 스토어 */}
        <Route path='/store/*' element={<Store />} />
        <Route path='/productDetail/:productNo' element={<StoreDetailList />} />
        {isLogin &&
          <>
            <Route path='/cart' element={<Cart />} />
            <Route path='/purchase/:productNo' element={<Purchase />} />
          </>
        }

        {/* 결제 */}
        <Route path='/purchase/success' element={<Success />} />
        <Route path='/purchase/fail' element={<Fail />} />
        <Route path='/purchase/cancel' element={<Cancel />} />
        <Route path='/purchase/success-complete' element={<SuccessComplete />} />

        {/* 리뷰 게시판 */}
        <Route path='/review/list' element={<ReviewList />} />

        {/* 게시판 */}
        <Route path='/lost' element={<Lost />} />
        <Route path='/writepost' element={<WritePost />} />
        <Route path='/personal' element={<Personal />} />
        <Route path='/chatbot' element={<Chatbot />} />
        <Route path='/writepost' element={<WritePost />} />
        <Route path='/personalDetail/:personalNo' element={<PersonalDetail />} />
        <Route path='/pagination' element={<Pagination />} />
        <Route path='/replyform' element={<ReplyForm />} />
        <Route path='/personalwrite' element={<PersonalWrite />} />
        <Route path='/commentlists' element={<CommentLists />} />
        <Route path='wrapcomments' element={<Comment />} />

        {/* 예매 */}
        {/* 로그인한 사용자만 접근할 수 있는 경로 */}
        {/* <Route path='/booking' element={(isLogin || isBookingAuthorized) ? <BookingListPage /> : <Navigate to="/login" />} /> */}
        {isLogin &&
          <>  
            <Route path='/bookingAdd' element={<BookingAdd />} />
          </>
        }
        {/* 모두 조회 가능하게 빼놈 */}
        <Route path='/booking' element={<BookingListPage />}/>
        
        {isNonLogin &&
          <>
            <Route path='/bookingAdd' element={<BookingAdd />} />
          </>
        }


        {/* <Route path='/booking' element={<BookingListPage />} /> */}
        <Route path='/moviechart' element={<MovieChart />} />






      </Routes >

      <Footer />
    </>

  );
}

export default App;
