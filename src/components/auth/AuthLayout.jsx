import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({
  authentication = true,
  guestComponent = false,
  children,
}) => {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (authentication && isAuthenticated !== authentication) {
      if (guestComponent) return;
      else navigate("/login");
    } else if (!authentication && isAuthenticated !== authentication) {
      navigate("/");
    }

    setLoading(false);
  }, [authentication, isAuthenticated, navigate]);

  if (!isAuthenticated && guestComponent) return guestComponent;
  return loading ? <h1> Loading...</h1> : <>{children}</>;
};

export default AuthLayout;
