import * as React from "react";
import PropTypes from "prop-types";
import Slider, { SliderThumb } from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import { formatTimeSlice } from "./video-input";

const AirbnbSlider = styled(Slider)(({ theme }) => ({
  color: "#3a8589",
  height: 3,
  padding: "13px 0",
  width: "100%",
  "& .MuiSlider-thumb": {
    height: 27,
    width: 27,
    backgroundColor: "#fff",
    border: "1px solid currentColor",
    "&:hover": {
      boxShadow: "0 0 0 8px rgba(58, 133, 137, 0.16)",
    },
    "& .airbnb-bar": {
      height: 9,
      width: 1,
      backgroundColor: "currentColor",
      marginLeft: 1,
      marginRight: 1,
    },
  },
  "& .MuiSlider-track": {
    height: 25,
  },
  "& .MuiSlider-rail": {
    color: "#d8d8d8",
    height: 5,
    opacity: 0.7,
  },
}));

function AirbnbThumbComponent(props) {
  const { children, ...other } = props;
  return (
    <SliderThumb {...other}>
      {children}
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
      <span className="airbnb-bar" />
    </SliderThumb>
  );
}

AirbnbThumbComponent.propTypes = {
  children: PropTypes.node,
};

export default function CustomizedSlider(props) {
  const { duration, videoPieceTime, handleSlideChange } = props;
  return (
    <AirbnbSlider
      components={{ Thumb: AirbnbThumbComponent }}
      min={0}
      max={duration}
      value={videoPieceTime}
      valueLabelDisplay="auto"
      valueLabelFormat={(s) => {
        return formatTimeSlice(s);
      }}
      onChange={handleSlideChange}
    />
  );
}
