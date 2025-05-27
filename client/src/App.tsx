import { Outlet } from "react-router"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Slide, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "./services/store"
import { useRefreshMutation } from "./services/user/userApi"
import { setCurrentUser } from "./services/user/userSlice"
import { getJwtTokenFromLocalStorage } from "./util/utility"

function App() {
  const { loggedIn } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    const fetchUserData = async () => {
      let localStorageUserData = getJwtTokenFromLocalStorage();
      if (localStorageUserData && loggedIn) {
        let userData = await refresh().unwrap();
        console.log("User data fetched from server:", userData);
        dispatch(setCurrentUser(userData));
      }
    };
    fetchUserData();
  }, [])

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar={true} transition={Slide} autoClose={3000} theme="colored" />
      <Header />
      <div style={{ minHeight: "100vh" }}>
        <Outlet />
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default App
