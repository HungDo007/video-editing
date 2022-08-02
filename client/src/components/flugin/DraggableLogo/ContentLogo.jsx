import { Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import React from "react";
import { Rnd } from "react-rnd";

function ContentLogo(props) {
  const { logo, onTrack, onResize, handelCheckLogo } = props;
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
        {logo?.map((l) => (
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
                control={
                  <Checkbox
                    checked={l.selected}
                    onChange={(e) => handelCheckLogo(e.target.checked, l)}
                  />
                }
                label={l.label}
              />
            </div>
          </div>
        ))}
      </Grid>
      <Grid
        item
        xs={9}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            height: 540,
            width: 960,
            overflow: "inherit",
          }}
        >
          <video width="100%" height="100%">
            <source
              src="https://store.cads.live/projects/62e0bf83923dc2204c59076b/raw/video#t=0.1"
              type="video/mp4"
            />
          </video>
          {logo?.map(
            (l) =>
              l.selected && (
                <Rnd
                  size={{ width: l.size[0], height: l.size[1] }}
                  position={{ x: l.position.x, y: l.position.y }}
                  enableResizing={{
                    top: false,
                    right: false,
                    bottom: false,
                    left: false,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  onDragStop={(e, d) => {
                    onTrack(l, { x: parseInt(d.x), y: parseInt(d.y) });
                  }}
                  onResize={(e, direction, ref, delta, position) => {
                    onResize(l, [
                      parseInt(ref.offsetWidth),
                      parseInt(ref.offsetHeight),
                    ]);
                    onTrack(l, {
                      x: parseInt(position.x),
                      y: parseInt(position.y),
                    });
                  }}
                  // onResizeStop={(e, direction, ref, delta, position) => {
                  //   onResize(l, [
                  //     parseInt(ref.style.width),
                  //     parseInt(ref.style.height),
                  //   ]);
                  //   onTrack(l, { x: parseInt(position.x), y: parseInt(position.y) });
                  // }}
                >
                  <div
                    style={{
                      backgroundImage: `url(${l.file_name})`,
                      backgroundSize: "100% 100%",
                      backgroundRepeat: "no-repeat",
                      width: parseInt(l.size[0]),
                      height: parseInt(l.size[1]),
                      border: `1px solid ${l.position.x < 0 ? "red" : "green"}`,
                    }}
                  ></div>
                </Rnd>
              )
          )}
        </div>
      </Grid>
    </Grid>
  );
}

export default ContentLogo;
