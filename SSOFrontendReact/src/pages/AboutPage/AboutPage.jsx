import React from 'react';
import Weather from '../../components/Weather/Weather';

function AboutPage(props) {
    return (
        <div>
            <h1>Hello there !</h1>
            <button className='btn btn-primary'>Click me</button>
            <Weather />
        </div>
    );
}

export default AboutPage;