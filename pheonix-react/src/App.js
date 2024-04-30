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

function App() {
  return (

    <>
    <Htemplate/>

    <Routes>
              <Route path='/adminMovie' element={<AdminMovie/>}/>
              <Route path='/movieEdit/:movieNo' element={<MovieEdit/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/store/*' element={<Store />}/>
              <Route path='/join' element={<Join/>}/>
              <Route path='/cart' element={<Cart />}/>
              <Route path='/gift' element={<Gift/>}/>
              <Route path='/purchase' element={<Purchase/>}/>
              <Route path='/purchase-complete' element={<PurchaseComplete/>}/>
    </Routes>

    <Footer />
    </>

  );
}

export default App;
