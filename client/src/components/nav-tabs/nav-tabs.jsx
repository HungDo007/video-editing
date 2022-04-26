import * as React from "react";
import "./index.css";
import "react-pro-sidebar/dist/css/styles.css";
import ReorderIcon from "@mui/icons-material/Reorder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AirplayIcon from "@mui/icons-material/Airplay";
import PreviewIcon from "@mui/icons-material/Preview";

import { Grid } from "@mui/material";

import { NavLink } from "react-router-dom";
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
      { name: "Match", url: "/", icon: <AirplayIcon /> },
      // {
      //   name: "Highlight",
      //   url: "/highlight-review",
      //   icon: <PreviewIcon />,
      // },
    ];
    return listItem;
  });

  const handleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const iconCollapsed = {
    fontSize: "xx-large",
    margin: "20px 25px",
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
        <ProSidebar
          collapsed={collapsed}
          breakPoint="md"
          style={{ height: "initial", minHeight: "100vh" }}
        >
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
          <SidebarFooter>
            <span className={collapsed ? "" : "hidden"}>
              <ReorderIcon sx={iconCollapsed} onClick={handleCollapsed} />
            </span>
            <span className={collapsed ? "hidden" : ""}>
              <ArrowBackIosNewIcon
                sx={iconCollapsed}
                onClick={handleCollapsed}
              />
            </span>
          </SidebarFooter>
        </ProSidebar>
        <main>
          <Grid container direction="row">
            <Grid item style={{ width: "100%", padding: "3%" }}>
              {props.children}
            </Grid>
          </Grid>
        </main>
      </div>
    </>
  );
}

export default ResponsiveDrawer;
