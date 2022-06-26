import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useRef } from "react";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { FileUploader } from "react-drag-drop-files";

const TypeFileUploadMatrix = [["PNG"], ["MP4"]];

function DialogUpload(props) {
  const {
    type,
    setType,
    open,
    handleClose,
    handleUploadClick,
    eventName,
    setEventName,
    handleFileChange,
  } = props;
  const descriptionElementRef = useRef(null);

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
        <h4>Upload Gallery</h4>
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
          <Grid container spacing={2} width="450px">
            <Grid item xs={12}>
              <InputLabel>Type</InputLabel>
              <Select
                value={type}
                label="Type"
                fullWidth
                variant="standard"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value={0}>Image</MenuItem>
                <MenuItem value={1}>Video</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                value={eventName}
                label="Name"
                variant="standard"
                onChange={(e) => setEventName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FileUploader
                handleChange={handleFileChange}
                name="file"
                types={TypeFileUploadMatrix[type]}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button variant="contained" onClick={handleUploadClick}>
                Upload
              </Button>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default DialogUpload;
