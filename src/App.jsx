import { Routes, Route } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import { ToastContainer, toast } from "react-toastify"
import LoginPage from "./pages/LoginPage"

function App() {
  

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
     <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
     </Routes>
    </div>
  )
}

export default App
