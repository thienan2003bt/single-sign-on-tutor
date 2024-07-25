import Header from "./components/Header/Header";
import RouteIndex from "./routes/RouteIndex";
import { handleGetAccount } from './redux/action/accountAction';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { HashLoader } from 'react-spinners';

function App() {
	const dispatch = useDispatch();

	const user = useSelector(state => state.account.userInfo);
	const isLoading = useSelector(state => state.account.isLoading);
	useEffect(() => {
		if (!user || !user?.access_token) {
			dispatch(handleGetAccount());
		}
	}, [user]);

	return (
		<div className="App">
			<Header />

			{isLoading === false
				? <RouteIndex />
				: <div className="my-3 d-flex justify-content-center ">
					<HashLoader color={`#36d7b7`} loading={true} size={100} />
				</div>
			}
		</div>
	);
}

export default App;
