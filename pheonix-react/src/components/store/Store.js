import StoreJumbotron from "./StoreJumbotron";
import { useState, useEffect, useCallback } from "react";
import axios from "../utils/CustomAxios";
import './Store.css';
import { NavLink } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // Import the cart icon
import { Route, Routes } from 'react-router';

import StorePopcorn from './list/StorePopcorn';
import StoreDrink from './list/StoreDrink';
import StoreSnack from './list/StoreSnack';
import StorePoint from './list/StorePoint';
import StoreCombo from './list/StoreCombo';
import StorePackage from './list/StorePackage';



const Store= ()=>{

    return (
        <>
            <br />
            <br />
            {/* 페이지 제목 */}
            <div className="row justify-content-center">
                <div className="col-lg-8  title-head">
                    <div className="title-head-text">
                        스토어
                    </div>
                </div>
            </div>
            {/* 페이지 내부 메뉴 바 */}
            <div className='row justify-content-center'>
            <div className='col-lg-8'>
                <nav className="navbar navbar-expand-lg bg-light border-0"> {/* Remove the border */}
                    <div className="collapse navbar-collapse" id="navbarColor03">
                        <ul className="fw-bold navbar-nav d-flex justify-content-around w-100 align-items-center"> {/* Adjust navigation item width */}
                            <li className="nav-item" >
                                <NavLink className="nav-link active" to="/store/package">패키지</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link active" to="/store/point">포인트</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link active" to="/store/combo">콤보</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link active" to="/store/popcorn">팝콘</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link active" to="/store/drink">음료</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link active" to="/store/snack">스낵</NavLink>
                            </li>
                            <li className="nav-item"> {/* Add a margin-left auto to push it to the right */}
                                <NavLink className="nav-link active" to="/cart">
                                    <FaShoppingCart /> {/* Cart icon */}
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>

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