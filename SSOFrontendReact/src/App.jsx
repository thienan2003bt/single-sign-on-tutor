import Header from "./components/Header/Header";
import RouteIndex from "./routes/RouteIndex";
import { handleGetAccount } from './redux/action/accountAction';
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { HashLoader } from 'react-spinners';
import WeatherService from "./services/weather.s";

function App() {
	const dispatch = useDispatch();

	const user = useSelector(state => state.account.userInfo);
	const isLoading = useSelector(state => state.account.isLoading);
	const [isFirstUseEffectCalled, setIsFirstUseEffectCalled] = useState(false);

	const handleGettingWeather = async () => {
		try {
			const response = await WeatherService.getWeatherStatus();
			if (response && +response?.statusCode === 200) {
				console.log(("message: " + response?.message));
			} else {
				console.log(("Error getting weather status, error: " + response?.message));
			}
		} catch (error) {
			console.log("Error getting weather status, error: " + error);
		}
	}

	const handleFirstUseEffectCall = async () => {
		if (!user || !user?.access_token) {
			dispatch(handleGetAccount());
		}

		// Check if the dispatching is done
		if (user?.access_token !== '') {
			setIsFirstUseEffectCalled(true);
		}

	}

	useEffect(() => {
		handleFirstUseEffectCall();
	}, [user]);

	useEffect(() => {
		if (isFirstUseEffectCalled === true) {
			if (!user || !user?.refresh_token) {
				window.location.replace(`${process.env.REACT_APP_SSO_BACKEND_LOGIN}?serviceURL=${process.env.REACT_APP_SERVICE_URL}`);
			}

			handleGettingWeather();
		}
	}, [isFirstUseEffectCalled]);


	return (
		<div className="App">
			<Header />

			{(isLoading === false && isFirstUseEffectCalled === true)
				? <RouteIndex />
				: <div className="my-3 d-flex justify-content-center ">
					<HashLoader color={`#36d7b7`} loading={true} size={100} />
				</div>
			}
		</div>
	);
}

export default App;
