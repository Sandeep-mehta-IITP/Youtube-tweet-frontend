import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import { ToastContainer, toast } from "react-toastify";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/layout/Navbar";
import Aside from "./components/layout/Aside";
import { useState } from "react";

function App() {
  const [asideOpen, setAsideOpen] = useState(true);

  return (
    <div className="">
      <ToastContainer />
      <Navbar />
      <Aside isOpen={asideOpen} />
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
