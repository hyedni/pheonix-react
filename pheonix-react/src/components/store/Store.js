import './Store.css';
import { Route, Routes } from 'react-router';

import StorePopcorn from './list/StorePopcorn';
import StoreDrink from './list/StoreDrink';
import StoreSnack from './list/StoreSnack';
import StorePoint from './list/StorePoint';
import StoreCombo from './list/StoreCombo';
import StorePackage from './list/StorePackage';
import StoreMenu from './StoreMenu';


const Store= ()=>{

    return (
        <>
            <StoreMenu />

            <Routes>
              <Route path='/package' element={<StorePackage/>}/>
              <Route path='/combo' element={<StoreCombo/>}/>
              <Route path='/point' element={<StorePoint />}/>
              <Route path="/popcorn" element={<StorePopcorn />}/>
              <Route path="/drink" element={<StoreDrink />}/>
              <Route path="/snack" element={<StoreSnack/>}/>
            </Routes>
        </>
    );
};

export default Store;