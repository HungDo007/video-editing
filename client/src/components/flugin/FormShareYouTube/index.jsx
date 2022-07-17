import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import videoEditingApi from "../../../api/video-editing";
import { FileUploader } from "react-drag-drop-files";
const privacyOpt = [
  { name: "Private", value: "private" },
  { name: "Public", value: "public" },
];
function FormShareYoutube(props) {
  const { open, handleClose, videoUrl } = props;

  //for noti
  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  const [title, setTitle] = useState();
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState();
  const [file, setFile] = useState();
  const [privacy, setPrivacy] = useState();

  useEffect(() => {
    setTitle();
    setFile();
    setDescription();
    setTag();
    setPrivacy();
  }, [videoUrl]);
  const handleSubmit = () => {
    if (!file) {
      setNoti(true);
      setMessage("Please chose file Credentials");
      setTypeNoti("error");
      return;
    } else if (!title || title === "") {
      setNoti(true);
      setMessage("Please enter Title for video");
      setTypeNoti("error");
      return;
    } else if (!privacy) {
      setNoti(true);
      setMessage("Please chose Privacy Status");
      setTypeNoti("error");
      return;
    }
    const formData = new FormData();
    formData.append("credential", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("urlVideo", videoUrl);
    formData.append("tags", tag);
    formData.append("privacy", privacy.value);
    console.log("a");
    const getUrlAuthor = async () => {
      try {
        var response = await videoEditingApi.shareYoutube(formData);
        const link = document.createElement("a");
        link.href = response.data;
        link.target = "_blank";
        // Append to html link element page
        document.body.appendChild(link);
        // Start download
        link.click();
        // Clean up and remove the link
        link.parentNode.removeChild(link);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    };
    getUrlAuthor();
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  const descriptionElementRef = useRef(null);
  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={noti}
        autoHideDuration={5000}
        onClose={() => setNoti(false)}
      >
        <Alert
          onClose={() => setNoti(false)}
          severity={typeNoti}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        fullWidth={true}
        maxWidth="md"
      >
        <DialogContent dividers={true}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <b>Credentials</b>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid
                item
                xs={10}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <FileUploader
                  fullWidth
                  handleChange={handleFileChange}
                  name="file"
                  types={["JSON"]}
                />
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={1}></Grid>
              <Grid item xs={10} style={{ textAlign: "center" }}>
                <a
                  href="https://docs.google.com/document/d/15Iro-HU-T8KOh42EBLnBNsRdi8m0NxE34UDUTua6Oqk/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  <small> How to get credentials</small>
                </a>
              </Grid>
              <Grid item xs={1}></Grid>

              <Grid item xs={12}>
                <b>Video</b>
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={11}>
                <TextField
                  value={title}
                  label="Title"
                  variant="standard"
                  size="small"
                  onChange={(e) => setTitle(e.target.value)}
                  fullWidth
                  required={true}
                />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={11}>
                <TextField
                  value={description}
                  variant="standard"
                  size="small"
                  label="Description"
                  onChange={(e) => setDescription(e.target.value)}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={11}>
                <TextField
                  value={tag}
                  variant="standard"
                  size="small"
                  label="Tags(If there are multiple tags, separate them by a space)"
                  onChange={(e) => setTag(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={1} />
              <Grid item xs={11}>
                <Autocomplete
                  options={privacyOpt ? privacyOpt : []}
                  size="small"
                  value={privacy || null}
                  fullWidth
                  getOptionLabel={(option) => option["name"] || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Privacy Status"
                      variant="standard"
                      required={true}
                      inputProps={{
                        ...params.inputProps,
                      }}
                    />
                  )}
                  onChange={(e, value) => setPrivacy(value)}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FormShareYoutube;
