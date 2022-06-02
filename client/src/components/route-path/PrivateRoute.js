import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export function PrivateRoute({ element }) {
  const isLogin = Boolean(Cookies.get("Token"));
  // function parseJwt(token) {
  //   var base64Url = token.split(".")[1];
  //   var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  //   var jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split("")
  //       .map(function (c) {
  //         return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
  //       })
  //       .join("")
  //   );

  //   return JSON.parse(jsonPayload);
  // }
  // console.log(parseJwt(Cookies.get("Token")));
  //const isLogin = true;
  return isLogin ? element : <Navigate to="/login" />;
}
