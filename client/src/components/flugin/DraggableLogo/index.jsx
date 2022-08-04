import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import React from "react";
import ContentFrame from "./ContentFrame";
import ContentLogo from "./ContentLogo";

function DialogDraggableLogo(props) {
  const {
    type,
    open,
    handleClose,
    logo,
    onTrack,
    onResize,
    handelCheckLogo,
    fileName,
  } = props;

  return (
    <Dialog open={open} fullScreen={true}>
      <DialogContent dividers={true}>
        {type === "logo" ? (
          <ContentLogo
            fileName={fileName}
            logo={logo}
            onTrack={onTrack}
            onResize={onResize}
            handelCheckLogo={handelCheckLogo}
          />
        ) : (
          <ContentFrame
            fileName={fileName}
            logo={logo}
            onTrack={onTrack}
            onResize={onResize}
            handelCheckLogo={handelCheckLogo}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Save
        </Button>
        <Button
          sx={{
            backgroundColor: "red",
            marginLeft: "10px",
          }}
          variant="contained"
          onClick={handleClose}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogDraggableLogo;
