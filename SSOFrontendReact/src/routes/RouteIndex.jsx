import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import AboutPage from '../pages/AboutPage/AboutPage';
import ConfirmPage from '../pages/ConfirmPage/ConfirmPage';


function RouteIndex(props) {
    return (
        <div>
            <Routes>
                <Route path='/' index element={<HomePage />} />
                <Route path='/news' element={<AboutPage />} />
                <Route path='/contact' element={<AboutPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/code' element={<ConfirmPage />} />

            </Routes>
        </div>
    );
}

export default RouteIndex;