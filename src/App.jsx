import { Routes, Route } from "react-router-dom"
import SignupPage from "./pages/SignupPage"

function App() {
  

  return (
    <div>
     <Routes>
      <Route path="/signup" element={<SignupPage />} />
     </Routes>
    </div>
  )
}

export default App
