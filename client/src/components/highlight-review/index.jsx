import React, { useEffect, useState } from "react";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Snackbar,
  Alert,
} from "@mui/material";
import videoEditingApi from "../../api/video-editing";
import ReactPlayer from "react-player";
import DeleteIcon from "@mui/icons-material/Delete";
import TableHighlight from "./TableHighlight";
import { ConfirmDialog } from "../flugin";

function HighlightReview(props) {
  const { highlights, getHighlight } = props;
  //const [highlights, setHighlights] = useState();
  const [source, setSource] = useState();
  const [name, setName] = useState();
  const [openDConfirm, setOpenDConfirm] = useState(false);
  const [rowDelete, setRowDelete] = useState();

  const [opendialog, setOpenDialog] = useState(false);
  const handleClose = () => {
    setOpenDialog(false);
    setOpenDConfirm(false);
  };

  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  const [scroll, setScroll] = useState("paper");
  const descriptionElementRef = React.useRef(null);

  const handleViewClick = (highlight) => {
    setName(
      highlight.matchInfo?.substring(1, highlight.matchInfo.indexOf(")"))
    );
    setOpenDialog(true);
    setSource(highlight.mp4);
  };

  const handleDeleteClick = () => {
    const deleteMatch = async (id) => {
      try {
        await videoEditingApi.deleteHighlight(id);
        setNoti(true);
        setMessage("Delete Succeed");
        setTypeNoti("success");
        getHighlight();
      } catch (error) {
        console.log(error);
      }
    };
    deleteMatch(rowDelete.id);
  };

  const handleConfirmClick = () => {
    handleDeleteClick();
    setOpenDConfirm(false);
  };

  const handleIconDeleteClick = (highlight) => {
    setRowDelete(highlight);
    setOpenDConfirm(true);
  };
  return (
    <>
      <ConfirmDialog
        title="Confirm"
        description="Are you sure to delete the record?"
        onClose={handleClose}
        onConfirm={handleConfirmClick}
        open={openDConfirm}
      />

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
        open={opendialog}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
      >
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
          <h5>Highlight {name}</h5>
          <Button className="float-right-cancel" onClick={handleClose}>
            <CancelOutlinedIcon className="color-button-cancel" />
          </Button>
        </DialogTitle>

        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <ReactPlayer ref={null} playing={true} url={source} controls />
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <TableHighlight
        data={highlights}
        handleViewClick={handleViewClick}
        handleIconDeleteClick={handleIconDeleteClick}
      />
    </>
  );
}

export default HighlightReview;
