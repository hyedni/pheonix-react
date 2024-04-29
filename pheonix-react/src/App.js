import { Route, Routes } from 'react-router';
import AdminMovie from './components/admin/AdminMovie';
import Footer from './design/Footer';
import Htemplate from './design/Htemplate';
import Login from './components/Login';

function App() {
  return (

    <>
    <Htemplate/>

    <Routes>
              <Route path='/adminMovie' element={<AdminMovie/>}/>
              <Route path='/login' element={<Login/>}/>
    </Routes>

    <Footer />
    </>

  );
}

export default App;
