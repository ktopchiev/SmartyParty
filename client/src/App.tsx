import { Outlet } from "react-router"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {

  return (
    <>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <Header />
      <div className="container">
        <Outlet />
      </div>
      <footer>
        <Footer />
      </footer>
    </>
  )
}

export default App
