import { Route, Routes } from 'react-router';
import AdminMovie from './components/admin/AdminMovie';
import Footer from './design/Footer';
import Htemplate from './design/Htemplate';
import Login from './components/user/Login';
import Join from './components/user/Join';

function App() {
  return (

    <>
    <Htemplate/>

    <Routes>
              <Route path='/adminMovie' element={<AdminMovie/>}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/join' element={<Join/>}/>
    </Routes>

    <Footer />
    </>

  );
}

export default App;
