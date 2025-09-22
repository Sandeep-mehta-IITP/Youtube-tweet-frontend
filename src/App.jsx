import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import { Bounce, ToastContainer, toast } from "react-toastify";
import LoginPage from "./pages/LoginPage";

import Feed from "./components/Feed";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./app/Slices/authSlice";
import { healthCheck } from "./app/Slices/healthCheckSlice";
import { Loader } from "lucide-react";
import SupportPage from "./pages/SupportPage";

function App() {
  const dispatch = useDispatch();

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    dispatch(healthCheck()).then(() => {
      dispatch(getCurrentUser()).then(() => {
        setInitialLoading(false);
      });
    });

    const Interval = setInterval(
      () => {
        dispatch(healthCheck());
      },
      5 * 60 * 1000
    );

    return () => clearInterval(Interval);
  }, [dispatch]);



  if (initialLoading) {
    return (
      <div className="h-screen w-full bg-[#121212] text-[#f6f5f6] overflow-y-auto flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 animate-spin font-semibold text-sky-400" />
          <h1 className="text-3xl font-bold mt-8 text-pink-500">Please wait....</h1>
          <h1 className="text-xl mt-4">Refresh the page if it takes too long...</h1>
        </div>
      </div>
    );
  }

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
          <Route path="support" element={<SupportPage />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
