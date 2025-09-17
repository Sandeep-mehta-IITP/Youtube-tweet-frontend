import { Routes, Route } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import { ToastContainer, toast } from "react-toastify"
import LoginPage from "./pages/LoginPage"
import Navbar from "./components/layout/Navbar"

function App() {
  

  return (
    <div className="">
      <ToastContainer />
      <Navbar />
     <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
     </Routes>
    </div>
  )
}

export default App
