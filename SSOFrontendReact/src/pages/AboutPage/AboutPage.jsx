import React, { useState } from 'react';
import Weather from '../../components/Weather/Weather';

function AboutPage(props) {

    const [city, setCity] = useState('1236594');
    const handleSelectChange = (e) => {
        setCity(e.target.value);
    }
    return (
        <div className='about-page container'>
            <div className='row'>
                <select className='form-select col-3' name='location' id='location'
                    onChange={(e) => handleSelectChange(e)}>
                    <option value='1236594'>Ha Noi</option>
                    <option value='1252431'>Ho Chi Minh</option>
                </select>
                <Weather className='col-6' city={city} />
            </div>
        </div>
    );
}

export default AboutPage;