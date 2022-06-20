import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import { FileUploader } from "react-drag-drop-files";

function DialogUploadEvent(props) {
  const {
    open,
    handleClose,
    handleUploadEventClick,
    eventName,
    setEventName,
    handleFileChange,
  } = props;
  const descriptionElementRef = useRef(null);
  return (
    <Dialog open={open} onClose={handleClose} scroll="paper">
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
        <Button variant="contained" onClick={handleUploadEventClick}>
          Upload
        </Button>
      </DialogTitle>
      <DialogContent dividers={true}>
        <DialogContentText
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          <Grid container spacing={2} width="450px">
            <Grid item xs={12}>
              <TextField
                value={eventName}
                label="Event Name"
                variant="standard"
                //size="small"
                onChange={(e) => setEventName(e.target.value)}
                fullWidth
                //required={!hidden}
                //placeholder="Enter league name"
              />
            </Grid>
            <Grid item xs={12}>
              <FileUploader
                handleChange={handleFileChange}
                name="file"
                types={["MP4"]}
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default DialogUploadEvent;
