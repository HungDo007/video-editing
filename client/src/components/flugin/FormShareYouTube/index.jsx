import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
} from "@mui/material";
import React, { useRef, useState } from "react";

function FormShareYoutube(props) {
  const { open, handleClose } = props;
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [recoveryemail, setRecoveryemail] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState();

  const handleSubmit = () => {
    console.log("a");
  };
  const descriptionElementRef = useRef(null);
  return (
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
            <Grid item xs={1}>
              <small>Email</small>
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={email}
                variant="standard"
                size="small"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required={true}
                placeholder="Enter your email"
              />
            </Grid>
            <Grid item xs={1}>
              <small>Pass</small>
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={password}
                variant="standard"
                size="small"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                type="password"
                required={true}
                placeholder="Enter your password"
              />
            </Grid>
            <Grid item xs={1}>
              <small>Recovery Email</small>
            </Grid>
            <Grid item xs={3}>
              <TextField
                value={recoveryemail}
                variant="standard"
                size="small"
                onChange={(e) => setRecoveryemail(e.target.value)}
                fullWidth
                required={true}
                placeholder="Enter you Recovery Email"
              />
            </Grid>
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
              />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={11}>
              <TextField
                value={tag}
                variant="standard"
                size="small"
                label="Tag"
                onChange={(e) => setTag(e.target.value)}
                fullWidth
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
  );
}

export default FormShareYoutube;
