import * as React from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          ".MuiTabs-indicator": { left: 0 },
        }}
      >
        {/* <Tab label="NEW ACTION LABELING" onClick={() => navigate("/")} />
        <Tab label="MODEL MANAGEMENT" onClick={() => navigate("/model")} />
        <Tab label="VIDEO ANALYTICS" onClick={() => navigate("/video")} /> */}
        <Tab label="TOURNAMENT" onClick={() => navigate("/tournament")} />
        <Tab
          label="HIGHLIGHT REVIEW"
          onClick={() => navigate("/highlight-review")}
        />
      </Tabs>
    </Box>
  );
}
