import React from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, ButtonGroup, Grid } from "@mui/material";
import Pre from "../flugin/pre";
import imgBG from "./bg-signbar.jpg";

const style = {
  backgroundImage: `url(${imgBG})`,
  //backgroundColor: "#1D1D1D",
  //backgroundPosition: "bottom",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 100%",
  maxHeight: "72px",
  boxShadow:
    "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
};
// const style_btn = {
//     padding: '0.88em',
//     borderRadius: '1.5em 0 0 1.5em',
//     paddingLeft: '25px',

// }
const style_text = {
  textShadow: "1px 1px 1px #7ea9c2",
  color: "#fff",
};
const style_group = {
  border: "1px solid #FFF",
  borderRadius: "0.4em",
};

function Header() {
  const userName = localStorage.getItem("fullName");
  let navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("Token");
    localStorage.removeItem("fullName");
    navigate("/login");
  };
  return (
    <>
      <header style={style}>
        <Grid item xs={12} container padding="20px">
          <Grid item xs={6}>
            {/* <NavLink to="/">HOME</NavLink> */}
          </Grid>
          <Grid item xs={6} className="row" container direction="row-reverse">
            <Grid item xs="auto" sx={{ alignSelf: "center" }}>
              <ButtonGroup
                sx={style_group}
                variant="text"
                aria-label="text button group"
              >
                <span style={{ display: "flex", alignItems: "center" }}>
                  <Pre
                    sx={{
                      ...style_text,
                    }}
                  >
                    {userName || "ER_UserNameNotFound"}
                  </Pre>
                </span>
                <Button
                  startIcon={
                    <LogoutIcon
                      sx={{ ...style_text, fontSize: "25px !important" }}
                    />
                  }
                  onClick={handleLogout}
                />
              </ButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </header>
    </>
  );
}

export default Header;
