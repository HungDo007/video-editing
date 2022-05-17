import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmDialog(props) {
  const { title, description, onClose, onConfirm, open } = props;

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: "30%" } }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{description}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            variant="contained"
            color="error"
            size="small"
          >
            Disagree
          </Button>
          <Button
            onClick={onConfirm}
            autoFocus
            variant="contained"
            color="success"
            size="small"
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
