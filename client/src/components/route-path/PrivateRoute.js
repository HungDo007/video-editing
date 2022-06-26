import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export function PrivateRoute({ element }) {
  const isLogin = Boolean(Cookies.get("Token"));

  return isLogin ? element : <Navigate to="/login" />;
}
