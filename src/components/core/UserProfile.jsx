import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const UserProfile = ({ userId }) => {
  const loginPopupRef = useRef();
  const dispatch = useDispatch();

  const { userData, loading } = useSelector((state) => state.user);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [localData, setLocalData] = useState("");

  useEffect(() => {
    if (!userId) return;

    dispatch()
  }, [])

  return <div>UserProfile</div>;
};

export default UserProfile;
