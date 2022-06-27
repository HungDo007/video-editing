import React, { useEffect, useState } from "react";
import {
  Alert,
  Backdrop,
  Box,
  CircularProgress,
  Fab,
  Grid,
  Paper,
  Snackbar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Image, Typography, Button, Popover, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ReactPlayer from "react-player";
import DialogUpload from "./DialogUpload";
import videoEditingApi from "../../api/video-editing";

const { Title } = Typography;

const content = (onPopoverClick, viewMode) => (
  <div style={{ width: "100px" }}>
    <Button
      type={viewMode === -1 ? "primary" : ""}
      block
      onClick={() => onPopoverClick(-1)}
    >
      All
    </Button>
    <Button
      type={viewMode === 0 ? "primary" : ""}
      block
      onClick={() => onPopoverClick(0)}
    >
      Image
    </Button>
    <Button
      type={viewMode === 1 ? "primary" : ""}
      block
      onClick={() => onPopoverClick(1)}
    >
      Video
    </Button>
  </div>
);

function Gallery() {
  const [viewMode, setViewMode] = useState(-1);
  const [typeAdd, setTypeAdd] = useState(0);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const [event, setEvent] = useState();

  const [noti, setNoti] = useState(false);
  const [message, setMessage] = useState();
  const [typeNoti, setTypeNoti] = useState();

  const [gallery, setGallery] = useState([]);
  console.log(gallery);

  const getGallery = async () => {
    try {
      var response = await videoEditingApi.getGallery(viewMode);
      setGallery(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getGallery();
  }, [viewMode]);

  const onPopoverClick = (value) => {
    if (value === -1) {
      setViewMode(value);
    }
    if (value === 0) {
      setViewMode(value);
    }
    if (value === 1) {
      setViewMode(value);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleUploadClick = () => {
    if (!file || !event || event === "") {
      setNoti(true);
      setMessage("Please chose File or enter Name!!");
      setTypeNoti("error");
      return;
    }
    console.log("upload", file, typeAdd, event);

    const formData = new FormData();
    formData.append("eventName", event);
    formData.append("file", file);
    formData.append("type", typeAdd);
    const saveToGallery = async () => {
      try {
        await videoEditingApi.saveToGallery(formData);
        setOpen(false);
        setOpenBackdrop(false);
        setNoti(true);
        setMessage("Upload Succeed");
        setTypeNoti("success");
        getGallery();
      } catch (error) {
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
        setOpenBackdrop(false);
      }
    };
    setOpenBackdrop(true);
    saveToGallery();
  };

  const onDelete = (id) => {
    const deleteGallery = async () => {
      try {
        await videoEditingApi.deleteGallery(id);
        getGallery();
        setNoti(true);
        setMessage("Delete Succeed");
        setTypeNoti("success");
      } catch (error) {
        setNoti(true);
        setMessage(error.response.data.description);
        setTypeNoti("error");
      }
    };
    deleteGallery();
  };
  return (
    <>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 100000000,
        }}
        open={openBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
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
      <Box
        sx={{
          "& > :not(style)": { m: 1 },
          position: "fixed",
          right: "50px",
          bottom: "32px",
          zIndex: 1233333333,
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
        }}
      >
        <Popover
          content={content(onPopoverClick, viewMode)}
          title="View mode"
          trigger="click"
        >
          <Fab color="secondary" aria-label="add" marginBottom="15px">
            {viewMode === -1 ? "All" : viewMode === 0 ? "Image" : "Video"}
          </Fab>
        </Popover>
        <Fab color="primary" aria-label="add" onClick={() => setOpen(true)}>
          <AddIcon />
        </Fab>
      </Box>

      <DialogUpload
        type={typeAdd}
        setType={setTypeAdd}
        open={open}
        handleClose={handleClose}
        handleUploadClick={handleUploadClick}
        eventName={event}
        setEventName={setEvent}
        handleFileChange={handleFileChange}
      />
      <Grid container spacing={2}>
        {gallery.length > 0 &&
          gallery.map((gal) => {
            if (gal.type === 0)
              return (
                <Grid item xs={2}>
                  <Paper elevation={3} sx={{ height: "250px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "15px",
                      }}
                    >
                      <Title level={4}>{gal.event}</Title>
                      <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => onDelete(gal.id)}
                      >
                        <Button
                          shape="circle"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </div>
                    <Image width="100%" src={gal.file_name} />
                  </Paper>
                </Grid>
              );
            else
              return (
                <Grid item xs={4}>
                  <Paper elevation={3} sx={{ height: "250px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        margin: "15px",
                      }}
                    >
                      <Title level={4}>{gal.event}</Title>
                      <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => onDelete(gal.id)}
                      >
                        <Button
                          shape="circle"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </div>
                    <ReactPlayer
                      url={gal.file_name}
                      controls
                      height="75%"
                      width="100%"
                    />
                  </Paper>
                </Grid>
              );
          })}
      </Grid>
    </>
  );
}

export default Gallery;
