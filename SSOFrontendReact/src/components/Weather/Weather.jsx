import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import WeatherService from '../../services/weather.s';
import './Weather.scss';

function Weather(props) {
    const [weatherData, setWeatherData] = useState([]);
    const HCM_woeid = 1236594;
    const allWeatherState = {
        "Snow": "sn",
        "Sleet": "sl",
        "Hail": "h",
        "Thunderstorm": "t",
        "Heavy Rain": "hr",
        "Light Rain": "lr",
        "Showers": "s",
        "Heavy Cloud": "hc",
        "Light Cloud": "lc",
        "Clear": "c"
    }

    const getImageUrl = (weatherState) => {
        const fetchState = allWeatherState[weatherState];
        return `${process.env.REACT_APP_POSTGRES_IMAGE_URL}/${fetchState}.svg`;
    }

    const getWeatherByLocation = async (locationID) => {
        try {
            const response = await WeatherService.getWeatherByLocation(locationID);
            if (response && +response?.statusCode === 200) {
                setWeatherData(response?.data?.consolidated_weather);
            } else {
                console.log("Error getting weather state by location, error: " + response?.errMsg);
            }
        } catch (error) {
            console.log("Error getting weather state by location, error: " + error.message);
        }
    }




    useEffect(() => {
        getWeatherByLocation(HCM_woeid);
    }, []);


    return (
        <div className='weather-container'>
            {weatherData && weatherData.length > 0 &&
                <Carousel variant="dark" >
                    {weatherData.map((item, index) => {
                        return (
                            <Carousel.Item key={`item-${index}`}>
                                <img
                                    className="d-block w-100"
                                    src={getImageUrl(item.weather_state_name)}
                                    alt="First slide"
                                />
                                <Carousel.Caption>
                                    <h3>{item.weather_state_name}</h3>
                                    <p>{item.max_temp}&#8451; - <span style={{ color: '#70757a' }}>{item.min_temp}&#8451;</span></p>
                                </Carousel.Caption>
                            </Carousel.Item>
                        )
                    })}
                </Carousel>
            }
        </div>
    );
}

export default Weather;