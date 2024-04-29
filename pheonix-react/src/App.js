import { Route, Routes } from 'react-router';
import AdminMovie from './components/admin/AdminMovie';
import Footer from './design/Footer';
import Htemplate from './design/Htemplate';
import Login from './components/Login';
import MovieEdit from './components/admin/MovieEdit';
import Store from './components/store/Store';
import StorePackage from './components/store/StorePackage';
import StoreCombo from './components/store/StoreCombo';

function App() {
  return (

    <>
    <Htemplate/>

    <Routes>
              <Route path='/adminMovie' element={<AdminMovie/>}/>
              <Route path='/movieEdit/:movieNo' element={<MovieEdit/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/store/*' element={<Store />}/>
    </Routes>

    <Footer />
    </>

  );
}

export default App;
