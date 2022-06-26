import * as React from "react";
import "./index.css";
import "react-pro-sidebar/dist/css/styles.css";
import ReorderIcon from "@mui/icons-material/Reorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import imgBG from "./bg-signbar.jpg";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MovieIcon from "@mui/icons-material/Movie";

import { Grid, Tooltip } from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";

function ResponsiveDrawer(props) {
  const [collapsed, setCollapsed] = React.useState(true);
  const [listItem, setListItem] = React.useState(() => {
    const listItem = [
      { name: "Soccer", url: "/", icon: <SportsSoccerIcon /> },
      {
        name: "Highlight",
        url: "/highlight",
        icon: <MovieIcon />,
      },
      {
        name: "Gallery",
        url: "/gallery",
        icon: <CollectionsOutlinedIcon />,
      },
    ];
    return listItem;
  });
  let navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("Token");
    localStorage.removeItem("fullName");
    navigate("/login");
  };
  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const iconCollapsed = {
    fontSize: "xx-large",
    margin: "20px 25px",
    cursor: "pointer",
  };

  const NavMenuu = (item) => {
    if (collapsed) {
      return (
        <SubMenu key={item.name} title={item.name} icon={item.icon}>
          <MenuItem key={item.name}>
            <NavLink key={item.url} to={item.url}>
              {item.name}
            </NavLink>
          </MenuItem>
        </SubMenu>
      );
    } else {
      return (
        <MenuItem key={item.name} icon={item.icon}>
          <NavLink key={item.url} to={item.url}>
            {item.name}
          </NavLink>
        </MenuItem>
      );
    }
  };

  return (
    <>
      <div className="app">
        <ProSidebar image={imgBG} collapsed={collapsed} breakPoint="md">
          <SidebarHeader>
            <span className={collapsed ? "" : "hidden"}>
              <ReorderIcon sx={iconCollapsed} onClick={handleCollapsed} />
            </span>
            <span className={collapsed ? "hidden" : ""}>
              <ArrowBackIosNewIcon
                sx={iconCollapsed}
                onClick={handleCollapsed}
              />
            </span>
          </SidebarHeader>
          <SidebarContent>
            <Menu iconShape="round">
              {listItem?.map((item) => {
                return NavMenuu(item);
              })}
            </Menu>
          </SidebarContent>
          <SidebarFooter style={{ textAlign: "center" }}>
            <div style={{ fontSize: 16, padding: 1 }}>
              WELCOME {localStorage.getItem("fullName")}
            </div>
            <div>
              <Tooltip key={1} title="Logout" placement="right">
                <LogoutIcon sx={iconCollapsed} onClick={handleLogout} />
              </Tooltip>
            </div>
          </SidebarFooter>
        </ProSidebar>
        <main>
          <Grid container direction="row">
            <Grid item xs={12} style={{ width: "100%", padding: "2% 4%" }}>
              {props.children}
            </Grid>
          </Grid>
        </main>
      </div>
    </>
  );
}

export default ResponsiveDrawer;
