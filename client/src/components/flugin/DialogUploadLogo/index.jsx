import {
  Autocomplete,
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
const options = [
  { label: "Top-Right", value: 1 },
  { label: "Bottom-Right", value: 2 },
  { label: "Bottom-Left", value: 3 },
  { label: "Top-Left", value: 4 },
];
function DialogUploadLogo(props) {
  const {
    open,
    handleClose,
    handleUploadLogoClick,
    position,
    setPosition,
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
        <h4>Upload file Logo</h4>
        <Button variant="contained" onClick={handleUploadLogoClick}>
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
              <Autocomplete
                options={options}
                //size="small"
                value={position}
                fullWidth
                getOptionLabel={(option) => option["label"] || ""}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Position"
                    variant="standard"
                    inputProps={{
                      ...params.inputProps,
                    }}
                  />
                )}
                onChange={(e, value) => {
                  setPosition(value);
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FileUploader
                handleChange={handleFileChange}
                name="file"
                types={["PNG"]}
              />
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}

export default DialogUploadLogo;
