import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({
  authentication = true,
  guestComponent = null,
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && !isAuthenticated && !guestComponent) {
      navigate("/login");
    } else if (!authentication && isAuthenticated) {
      navigate("/");
    }
    setLoading(false);
  }, [authentication, isAuthenticated, navigate, guestComponent]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-900 dark:text-white text-lg font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (authentication && !isAuthenticated && guestComponent) {
    return <>{guestComponent}</>;
  }

  return <div className="animate-fade-in">{children}</div>;
};

export default AuthLayout;
