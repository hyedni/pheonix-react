import { Route, Routes } from 'react-router';
import AdminMovie from './components/admin/AdminMovie';
import Footer from './design/Footer';
import Htemplate from './design/Htemplate';
import Login from './components/user/Login';
import Join from './components/user/Join';
import MovieEdit from './components/admin/MovieEdit';
import Store from './components/store/Store';
import Cart from './components/store/Cart';
import Gift from './components/store/Gift';
import Purchase from './components/store/Purchase';
import PurchaseComplete from './components/store/PurchaseComplete';
import NewMovie from './components/admin/NewMovie';
import Personal from './components/service/Personal';
import Lost from './components/service/Lost';
import WritePost from './components/service/WritePost';
import StoreDetailList from './components/store/list/StoreDetailList';
import AdminCinema from './components/admin/AdminCinema';
import AdminStore from './components/admin/Store/AdminStore';
import NewProduct from './components/admin/Store/NewProduct';
import ProductEdit from './components/admin/Store/productEdit';
import SeatStatus from './components/admin/SeatsTypes/SeatStatus';
import BookingButton from './design/BookingButton';
import AdminTheater from './components/admin/AdminTheater';
import Mypage from './components/user/Mypage';
import NonUser from './components/user/nonUser';

import { isLoginState, loginIdState, loginGradeState } from "./components/utils/RecoilData";
import { useRecoilState, useRecoilValue } from 'recoil';
import axios from "./components/utils/CustomAxios";
import { useCallback, useEffect } from "react";


function App() {

  //recoil state
  const [loginId, setLoginId] = useRecoilState(loginIdState);
  const [loginGrade, setLoginGrade] = useRecoilState(loginGradeState);

  const isLogin = useRecoilValue(isLoginState);

  //effect
  useEffect(() => {
    refreshLogin();
  }, []);//최초 1회

  //call back
  const refreshLogin = useCallback(async () => {
    //로그인 정보 가져오기
    const refreshToken = window.localStorage.getItem("refreshToken");
    console.log(refreshToken);

    if (refreshToken !== null) {//refreshToken 항목이 존재한다면
      //리프레시 토큰으로 Authorization을 변경하고
      axios.defaults.headers.common["Authorization"] = refreshToken;
      //재로그인 요청을 보낸다
      const resp = await axios.post(`http://localhost:8080/user/refresh`);

      //8번 - MemberLoginVO 발급 작업
      //결과를 적절한 위치에 설정한다
      setLoginId(resp.data.userId);
      setLoginGrade(resp.data.userGrade);
      axios.defaults.headers.common["Authorization"] = resp.data.accessToken;
      window.localStorage.setItem("refreshToken", resp.data.refreshToken);
    }
  }, []);

  return (

    <>
      <Htemplate />
      <BookingButton />

      <Routes>
        {/* 공용공간 에티켓을 만듭시다** 분리하여 route 작성해주세요 */}
        {/* 관리자 */}

        <Route path='/adminMovie' element={<AdminMovie />} />
        <Route path='/adminCinema' element={<AdminCinema />} />
        <Route path='/adminStore' element={<AdminStore />} />
        <Route path='/adminTheater' element={<AdminTheater />} />

        <Route path='/movieEdit/:movieNo' element={<MovieEdit />} />
        <Route path='/productEdit/:productNo' element={<ProductEdit />} />

        <Route path='/newMovie' element={<NewMovie />} />
        <Route path='/newProduct' element={<NewProduct />} />

        {/* 좌석 */}
        {isLogin &&
          <Route path='/seatStatus' element={<SeatStatus />} />
        }

        {/* 회원 */}
        
            <Route path='/login' element={<Login />} />
            <Route path='/join' element={<Join />} />
            <Route path='/nonUser' element={<NonUser />} />
        {isLogin &&  
            <Route path='/mypage' element={<Mypage />} />   
        }

        {/* 스토어 */}
        <Route path='/store/*' element={<Store />} />
        <Route path='/productDetail/:productNo' element={<StoreDetailList />} />
        {isLogin &&
          <>
            <Route path='/cart' element={<Cart />} />
            <Route path='/gift' element={<Gift />} />
            <Route path='/purchase' element={<Purchase />} />
            <Route path='/purchase-complete' element={<PurchaseComplete />} />
          </>
        }

        {/* 게시판 */}
        <Route path='/lost' element={<Lost />} />
        <Route path='/writepost' element={<WritePost />} />
        <Route path='/personal' element={<Personal />} />
      </Routes>

      <Footer />
    </>

  );
}

export default App;
