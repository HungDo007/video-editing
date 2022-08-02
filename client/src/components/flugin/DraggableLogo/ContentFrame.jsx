import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState } from "react";
import { Rnd } from "react-rnd";
import bg from "./default-video-image.png";

function ContentFrame(props) {
  const { logo } = props;
  const [idxSelected, setIdxSelected] = useState(0);
  const handleRadioCheck = (e) => {
    setIdxSelected(e.target.value);
  };
  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={3}
        style={{
          borderRight: "1px solid black",
          display: "flex",
          flexFlow: "row wrap",
        }}
      >
        <FormControl>
          <RadioGroup row value={idxSelected}>
            {logo?.map((l, index) => (
              <div style={{ margin: "5px" }}>
                <div
                  style={{
                    backgroundImage: `url(${l.file_name})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    width: parseInt(100),
                    height: parseInt(70),
                  }}
                ></div>
                <div>
                  <FormControlLabel
                    value={index}
                    control={<Radio onChange={handleRadioCheck} />}
                    label={l.label}
                  />
                </div>
              </div>
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={9}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          width: "100%",
        }}
      >
        <div
          style={{
            height: logo[idxSelected].size[1],
            width: logo[idxSelected].size[0],
            overflow: "auto",
            border: "1px solid black",
            padding: 0,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            backgroundImage: `url(${logo[idxSelected].file_name})`,
          }}
        >
          <Rnd
          //size={{ width: 100, height: 100 }}
          //position={{ x: 0, y: 0 }}
          // onDragStop={(e, d) => {
          //   onTrack(l, { x: parseInt(d.x), y: parseInt(d.y) });
          // }}
          // onResizeStop={(e, direction, ref, delta, position) => {
          //   onResize(l, [
          //     parseInt(ref.style.width),
          //     parseInt(ref.style.height),
          //   ]);
          // }}
          >
            <div
              style={{
                backgroundImage: `url(${bg})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                width: parseInt(100),
                height: parseInt(100),
                border: `1px solid green`,
              }}
            ></div>
          </Rnd>
        </div>
      </Grid>
    </Grid>
  );
}

export default ContentFrame;
