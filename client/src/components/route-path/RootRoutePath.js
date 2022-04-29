import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PrivateRoute } from "./PrivateRoute";
import RoutePath from "./route-path";
import NavTabs from "../nav-tabs/nav-tabs";
import Login from "../Login";
import SignUp from "../Login/sign-up";
//IndexImportHygen

function rootRouters() {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={<LoginPrivate element={<Login />} />}
          exact
        />
        <Route
          path="/signUp"
          element={<LoginPrivate element={<SignUp />} />}
          exact
        />
        <Route
          path="/*"
          element={
            <PrivateRoute
              element={
                <NavTabs>
                  <RoutePath />
                </NavTabs>
              }
            />
          }
        />
      </Routes>
    </>
  );
}
export default rootRouters;

const LoginPrivate = ({ element }) => {
  if (Cookies.get("Token")) return <Navigate to="/" />;
  return element;
};
