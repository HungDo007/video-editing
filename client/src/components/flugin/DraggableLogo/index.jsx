import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
} from "@mui/material";
import React from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import bg from "./default-video-image.png";
import { Rnd } from "react-rnd";

function DialogDraggableLogo(props) {
  const { open, handleClose, logo, onTrack, onResize } = props;

  return (
    <Dialog open={open} fullWidth={true} maxWidth="lg">
      <DialogTitle
        sx={{
          backgroundColor: "#CEEBF9",
          fontSize: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        id="scroll-dialog-title"
      >
        <b>Double click on the image to resize</b>
        <IconButton color="primary" onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <Grid container spacing={2}>
          <Grid item xs={3}></Grid>
          <Grid
            item
            xs={9}
            style={{
              height: 405,
              width: 720,
              border: "1px solid black",
              padding: 0,
              backgroundImage: `url(${bg})`,
            }}
          >
            {logo?.map((l) => {
              return (
                <Rnd
                  size={{ width: l.size[0], height: l.size[1] }}
                  position={{ x: l.position.x, y: l.position.y }}
                  onDragStop={(e, d) => {
                    onTrack(l, { x: d.x, y: d.y });
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    onResize(l, [ref.style.width, ref.style.height]);
                  }}
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
              );
            })}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogDraggableLogo;
