import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export function PrivateRoute({ element }) {
  const isLogin = Boolean(Cookies.get("Token"));
  //const isLogin = true;
  return isLogin ? element : <Navigate to="/login" />;
}
