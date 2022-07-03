import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import bg from "./default-video-image.png";
import Draggable from "react-draggable";
import { useEffect } from "react";

const DialogResize = (props) => {
  const { w, h, open, handleClose, onSubmit } = props;

  useEffect(() => {
    setWidth(w);
    setHeight(h);
  }, [w, h]);
  const [width, setWidth] = useState();
  const [height, setHeight] = useState();
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent dividers={true}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              value={width}
              label="Width"
              variant="standard"
              onChange={(e) => setWidth(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={height}
              label="Height"
              variant="standard"
              onChange={(e) => setHeight(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => onSubmit([width, height])}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

function DialogDraggableLogo(props) {
  const { open, handleClose, logo, onTrack, onResize } = props;
  const [openResize, setOpenResize] = useState(false);
  const [logoSelected, setLogoSelected] = useState();

  const trackPos = (data, l) => {
    const oldPos = { ...l.position };
    const newPos = {
      x: data.x < -290 || data.x > 800 ? oldPos.x : data.x,
      y: data.y < 0 || data.y > 350 ? oldPos.y : data.y,
    };
    onTrack(l, newPos);
  };

  const doubleClick = (l) => {
    setOpenResize(true);
    setLogoSelected(l);
  };

  const rehandleResize = (size) => {
    setOpenResize(false);
    onResize(logoSelected, size);
  };
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
        <DialogResize
          open={openResize}
          w={logoSelected?.size[0]}
          h={logoSelected?.size[1]}
          handleClose={() => setOpenResize(false)}
          onSubmit={rehandleResize}
        />
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
                <Draggable
                  onDrag={(e, data) => trackPos(data, l)}
                  position={l.position}
                >
                  <div
                    style={{
                      position: "absolute",
                      cursor: "move",
                      border: `1px solid ${l.position.x < 0 ? "red" : "green"}`,
                    }}
                    onDoubleClick={() => doubleClick(l)}
                  >
                    <img
                      src={l.file_name}
                      alt=""
                      width={l.size[0]}
                      height={l.size[1]}
                    />
                  </div>
                </Draggable>
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
