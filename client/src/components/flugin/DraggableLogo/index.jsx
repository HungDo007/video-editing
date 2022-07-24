import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React from "react";
import ContentResizeLogo from "./ContentResizeLogo";

function DialogDraggableLogo(props) {
  const { open, handleClose, logo, onTrack, onResize, handelCheckLogo } = props;

  return (
    <Dialog open={open} fullScreen={true}>
      <DialogContent dividers={true}>
        <ContentResizeLogo
          logo={logo}
          onTrack={onTrack}
          onResize={onResize}
          handelCheckLogo={handelCheckLogo}
        />
      </DialogContent>
      <DialogActions
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <FormControl>
          <RadioGroup row>
            <FormControlLabel value="female" control={<Radio />} label="Logo" />
            <FormControlLabel value="male" control={<Radio />} label="Frame" />
          </RadioGroup>
        </FormControl>
        <Button variant="contained" onClick={handleClose}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DialogDraggableLogo;
