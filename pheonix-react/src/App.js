import { Route, Routes } from 'react-router';
import AdminMovie from './components/admin/AdminMovie';
import Footer from './design/Footer';
import Htemplate from './design/Htemplate';
import Login from './components/Login';
import MovieEdit from './components/admin/MovieEdit';
import Store from './components/store/Store';
import Cart from './components/store/Cart';

function App() {
  return (

    <>
    <Htemplate/>

    <Routes>
              <Route path='/adminMovie' element={<AdminMovie/>}/>
              <Route path='/movieEdit/:movieNo' element={<MovieEdit/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/store' element={<Store />}/>
              <Route path='/cart' element={<Cart />}/>
    </Routes>

    <Footer />
    </>

  );
}

export default App;
