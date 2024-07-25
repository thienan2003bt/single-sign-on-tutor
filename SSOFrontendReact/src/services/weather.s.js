import axios from './axios';

const getWeatherStatus = async () => {
    const response = await axios.get('http://localhost:8081/health');
    return response;
}


const WeatherService = {
    getWeatherStatus,
}

export default WeatherService;