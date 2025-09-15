import { Routes, Route } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import { ToastContainer, toast } from "react-toastify"

function App() {
  

  return (
    <div className="mx-4 sm:mx-[10%]">
      <ToastContainer />
     <Routes>
      <Route path="/signup" element={<SignupPage />} />
     </Routes>
    </div>
  )
}

export default App
