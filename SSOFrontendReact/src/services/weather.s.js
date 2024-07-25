import axios from './axios';

const getWeatherStatus = async () => {
    const response = await axios.get('http://localhost:8081/health');
    return response;
}


const getWeatherByLocation = async (locationID) => {
    const response = await axios.post(`${process.env.REACT_APP_SSO_POSTGRES_GET_WEATHER_STATE}`, {
        url: `api/location/${locationID}`
    })

    return response;
}



const WeatherService = {
    getWeatherStatus,
    getWeatherByLocation,
}

export default WeatherService;