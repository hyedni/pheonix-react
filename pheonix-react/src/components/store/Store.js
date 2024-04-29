import { useCallback, useEffect, useState } from "react";
import StoreJumbotron from "./StoreJumbotron";
import axios from "../utils/CustomAxios";
import StorePackage from "./StorePackage";
import StoreCombo from "./StoreCombo";
import StorePoint from "./StorePoint";
import { Route, Routes } from 'react-router';
import StorePopcorn from './StorePopcorn';
import StoreDrink from './StoreDrink';
import StoreSnack from './StoreSnack';


const Store = () => {

    return (
        <>
            <StoreJumbotron title="" />
            <Routes>
              <Route path='/package' element={<StorePackage/>}/>
              <Route path='/combo' element={<StoreCombo/>}/>
              <Route path='/point' element={<StorePoint />}/>
              <Route path="/popcron" element={<StorePopcorn />}/>
              <Route path="/drink" element={<StoreDrink />}/>
              <Route path="/snack" element={<StoreSnack/>}/>
            </Routes>
            
        </>
    );
};

export default Store;