import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from '../pages/HomePage/HomePage';
import ConfirmPage from '../pages/ConfirmPage/ConfirmPage';
import PrivateRoute from './PrivateRoute';
import WeatherPage from '../pages/WeatherPage/WeatherPage';

function RouteIndex(props) {
    return (
        <div>
            <Routes>
                <Route path='/' index element={<HomePage />} />
                <Route path='/code' element={<ConfirmPage />} />

                <Route path='/weather' element={<PrivateRoute>
                    <WeatherPage />
                </PrivateRoute>} />

            </Routes>
        </div>
    );
}

export default RouteIndex;