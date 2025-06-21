import { Outlet, useNavigate } from "react-router"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Slide, toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useEffect } from "react"
import { useAppDispatch } from "./services/store"
import { useRefreshMutation } from "./services/user/userApi"
import { setCurrentUser } from "./services/user/userSlice"
import { getJwtTokenFromLocalStorage } from "./util/utilities"
import SignalRService from "./services/signalR/SignalRService"
import { HubConnectionState } from "@microsoft/signalr"
import { setNavigate } from "./navigate/navigate"

function App() {
	const dispatch = useAppDispatch();
	const [refresh, { error }] = useRefreshMutation();
	const navigate = useNavigate();

	useEffect(() => {
		setNavigate(navigate);
	}, [navigate]);

	useEffect(() => {

		const startConnection = async () => {
			try {
				if (SignalRService.getSignalRConnection()?.state !== HubConnectionState.Connected) {
					await SignalRService.startUserRoomConnection();
				}
			} catch (err) {
				console.error("Connection failed: ", err);
			}
		}

		const fetchUserData = async () => {
			let localStorageUserData = getJwtTokenFromLocalStorage();
			if (localStorageUserData) {
				let userData = await refresh().unwrap();
				dispatch(setCurrentUser(userData));
			}
		};

		fetchUserData();
		startConnection();

		if (error) {
			toast.info("Session expired, please log in again.");
			localStorage.removeItem("user");
		};

	}, []);

	return (
		<div>
			<ToastContainer position="bottom-right" hideProgressBar={true} transition={Slide} autoClose={3000} theme="colored" />
			<Header />
			<div>
				<Outlet />
			</div>
			<footer>
				<Footer />
			</footer>
		</div>
	)
}

export default App
