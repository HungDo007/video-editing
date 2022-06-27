import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
} from "@mui/material";
import React, { useRef } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
function DialogMoreEvent(props) {
  const { open, handleClose, onCheck, eventGallery } = props;

  const descriptionElementRef = useRef(null);
  const handleCheck = (e, row) => {
    const temp = { ...row };
    row.selected = e.target.checked === true ? 1 : -1;
    onCheck(row);
  };
  return (
    <Dialog open={open} scroll="paper">
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
        <h4>Upload more event</h4>
        <IconButton color="primary" onClick={handleClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Grid container spacing={2} width="300px">
            <Grid item xs={12}>
              {eventGallery?.map((row) => (
                <div>
                  <FormControlLabel
                    control={<Checkbox />}
                    label={row.event}
                    checked={row.selected === 1 ? true : false}
                    onChange={(e) => handleCheck(e, row)}
                  />
                </div>
              ))}
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default DialogMoreEvent;
