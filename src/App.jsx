import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import { Bounce, ToastContainer, toast } from "react-toastify";
import LoginPage from "./pages/LoginPage";

import Feed from "./components/Feed";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getCurrentUser } from "./app/Slices/authSlice";

function App() {
 
  const dispatch = useDispatch()

  useEffect(()=> {
    dispatch(getCurrentUser())
  }, [dispatch])

  return (
    <div className="">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition:Bounce
      />

      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Feed />}>
          {/* <Route index element={<HomePage />} /> "/" route */}
          {/* More child routes can be added */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
